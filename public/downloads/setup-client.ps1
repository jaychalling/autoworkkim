#Requires -Version 5.1
<#
.SYNOPSIS
  managerkim-setup PowerShell client — Node.js 없이 릴레이 서버에 연결
.DESCRIPTION
  .NET ClientWebSocket으로 VPS 릴레이 서버(1664)에 연결하여
  강사의 원격 명령을 받아 실행하고 결과를 스트리밍합니다.
  Windows 10/11에서 추가 설치 없이 바로 실행 가능.
.EXAMPLE
  .\setup-client.ps1
  .\setup-client.ps1 -Name "학생-1"
  .\setup-client.ps1 -Name "학생-1" -RelayUrl "ws://38.45.67.130:1664/ws"
#>

param(
    [string]$Name,
    [string]$RelayUrl = "ws://38.45.67.130:1664/ws"
)

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ── Console UI ──────────────────────────────────────────────────
$SEP = [string]::new([char]0x2500, 45)

function Show-Status {
    param([string]$SessionName, [string]$Status)
    Clear-Host
    Write-Host $SEP
    Write-Host "  managerkim-setup v1.0 (PowerShell)"
    Write-Host "  연결: $($RelayUrl -replace 'ws://','')"
    Write-Host "  세션: $SessionName"
    Write-Host "  상태: $Status"
    Write-Host $SEP
    foreach ($entry in $script:LogBuffer) {
        Write-Host "  $($entry.Icon) $($entry.Text)"
    }
    Write-Host $SEP
    Write-Host "  Ctrl+C로 종료"
}

function Get-Timestamp {
    return (Get-Date).ToString("HH:mm:ss")
}

# ── Prompt for name ─────────────────────────────────────────────
if (-not $Name) {
    $Name = Read-Host "이름을 입력하세요 (예: 학생-1)"
    if ([string]::IsNullOrWhiteSpace($Name)) {
        $Name = "학생-$(Get-Date -Format 'fff')"
    }
}

$script:LogBuffer = [System.Collections.ArrayList]::new()

# ── Admin check ─────────────────────────────────────────────────
try {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Host "⚠️  관리자 권한 없이 실행 중. 일부 설치가 실패할 수 있습니다." -ForegroundColor Yellow
        Start-Sleep -Seconds 1
    }
} catch {}

# ── Execute command ─────────────────────────────────────────────
function Invoke-RelayCommand {
    param(
        [string]$Id,
        [string]$Command,
        [System.Net.WebSockets.ClientWebSocket]$Ws
    )

    $outputAll = ""
    $exitCode = 1

    try {
        # Start the process
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "powershell.exe"
        $psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -Command `"$($Command -replace '"','\"')`""
        $psi.UseShellExecute = $false
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.CreateNoWindow = $true
        $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
        $psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8

        $proc = [System.Diagnostics.Process]::Start($psi)

        # Read stdout in chunks
        while (-not $proc.StandardOutput.EndOfStream) {
            $line = $proc.StandardOutput.ReadLine()
            if ($null -ne $line) {
                $text = "$line`n"
                $outputAll += $text
                Send-WsMessage -Ws $Ws -Message @{
                    type = "output"; id = $Id; stream = "stdout"; data = $text
                }
            }
        }

        # Read stderr
        $stderr = $proc.StandardError.ReadToEnd()
        if ($stderr) {
            $outputAll += $stderr
            Send-WsMessage -Ws $Ws -Message @{
                type = "output"; id = $Id; stream = "stderr"; data = $stderr
            }
        }

        $proc.WaitForExit()
        $exitCode = $proc.ExitCode
    }
    catch {
        $errText = "Error: $($_.Exception.Message)`n"
        $outputAll += $errText
        Send-WsMessage -Ws $Ws -Message @{
            type = "output"; id = $Id; stream = "stderr"; data = $errText
        }
        $exitCode = 1
    }

    return @{ ExitCode = $exitCode; Output = $outputAll }
}

# ── WebSocket helpers ───────────────────────────────────────────
function Send-WsMessage {
    param(
        [System.Net.WebSockets.ClientWebSocket]$Ws,
        [hashtable]$Message
    )

    if ($Ws.State -ne [System.Net.WebSockets.WebSocketState]::Open) { return }

    $jsonStr = $Message | ConvertTo-Json -Compress -Depth 5
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
    $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
    $token = [System.Threading.CancellationToken]::None

    try {
        $Ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $token).GetAwaiter().GetResult() | Out-Null
    } catch {}
}

function Receive-WsMessage {
    param(
        [System.Net.WebSockets.ClientWebSocket]$Ws,
        [int]$TimeoutMs = 1000
    )

    if ($Ws.State -ne [System.Net.WebSockets.WebSocketState]::Open) { return $null }

    $buffer = New-Object byte[] 65536
    $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$buffer)
    $cts = New-Object System.Threading.CancellationTokenSource
    $cts.CancelAfter($TimeoutMs)

    try {
        $result = $Ws.ReceiveAsync($segment, $cts.Token).GetAwaiter().GetResult()

        if ($result.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) {
            return @{ type = "__close" }
        }

        $received = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)

        # Handle multi-frame messages
        while (-not $result.EndOfMessage) {
            $result = $Ws.ReceiveAsync($segment, $cts.Token).GetAwaiter().GetResult()
            $received += [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)
        }

        return $received | ConvertFrom-Json
    }
    catch [System.OperationCanceledException] {
        return $null  # Timeout, no message
    }
    catch {
        return @{ type = "__error"; message = $_.Exception.Message }
    }
    finally {
        $cts.Dispose()
    }
}

# ── Main loop ───────────────────────────────────────────────────
function Start-RelayClient {
    while ($true) {
        $ws = $null
        try {
            Show-Status -SessionName $Name -Status "🔌 연결 중..."

            $ws = New-Object System.Net.WebSockets.ClientWebSocket
            $ws.Options.KeepAliveInterval = [TimeSpan]::FromSeconds(30)
            $uri = New-Object System.Uri($RelayUrl)
            $token = [System.Threading.CancellationToken]::None

            $ws.ConnectAsync($uri, $token).GetAwaiter().GetResult() | Out-Null

            # Register
            Send-WsMessage -Ws $ws -Message @{
                type        = "register"
                name        = $Name
                os          = "win32"
                nodeVersion = "powershell-$($PSVersionTable.PSVersion)"
            }

            Show-Status -SessionName $Name -Status "⏳ 대기 중"

            # Message loop
            while ($ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
                $msg = Receive-WsMessage -Ws $ws -TimeoutMs 2000

                if ($null -eq $msg) { continue }

                if ($msg.type -eq "__close") { break }
                if ($msg.type -eq "__error") {
                    Write-Host "  ⚠️ 수신 오류: $($msg.message)" -ForegroundColor Yellow
                    break
                }

                if ($msg.type -eq "registered") {
                    Show-Status -SessionName $Name -Status "⏳ 대기 중"
                    continue
                }

                if ($msg.type -eq "exec") {
                    $cmdShort = if ($msg.command.Length -gt 40) {
                        $msg.command.Substring(0, 40) + "..."
                    } else { $msg.command }

                    Show-Status -SessionName $Name -Status "⚡ 실행 중"
                    Write-Host "  📥 [$(Get-Timestamp)] $cmdShort"

                    $result = Invoke-RelayCommand -Id $msg.id -Command $msg.command -Ws $ws

                    $icon = if ($result.ExitCode -eq 0) { "✅" } else { "❌" }
                    $lastLine = ($result.Output.Trim() -split "`n")[-1]
                    $resultShort = if ($lastLine.Length -gt 30) { $lastLine.Substring(0, 30) } else { $lastLine }
                    if (-not $resultShort) { $resultShort = "exit $($result.ExitCode)" }

                    $script:LogBuffer.Add(@{ Icon = "📥 [$(Get-Timestamp)]"; Text = $cmdShort }) | Out-Null
                    $script:LogBuffer.Add(@{ Icon = $icon; Text = $resultShort }) | Out-Null

                    Send-WsMessage -Ws $ws -Message @{
                        type     = "done"
                        id       = $msg.id
                        exitCode = $result.ExitCode
                    }

                    Show-Status -SessionName $Name -Status "⏳ 대기 중"
                }
            }
        }
        catch {
            Write-Host "`n연결 오류: $($_.Exception.Message)" -ForegroundColor Red
        }
        finally {
            if ($ws) {
                try { $ws.Dispose() } catch {}
            }
        }

        Write-Host "3초 후 재연결..."
        Start-Sleep -Seconds 3
    }
}

# ── Entry point ─────────────────────────────────────────────────
try {
    Start-RelayClient
}
catch {
    if ($_.Exception.GetType().Name -eq "PipelineStoppedException") {
        Write-Host "`n종료합니다..."
    } else {
        throw
    }
}
