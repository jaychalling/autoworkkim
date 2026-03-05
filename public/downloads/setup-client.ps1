#Requires -Version 5.1
<#
.SYNOPSIS
  managerkim-setup PowerShell client
.DESCRIPTION
  .NET ClientWebSocket으로 VPS 릴레이 서버(1664)에 연결하여
  강사의 원격 명령을 받아 실행하고 결과를 스트리밍합니다.
  Windows 10/11에서 추가 설치 없이 바로 실행 가능.
.EXAMPLE
  .\setup-client.ps1
  .\setup-client.ps1 -Name "학생-1"
#>

param(
    [string]$Name,
    [string]$RelayUrl = "ws://38.45.67.130:1664/ws"
)

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ── Console UI ──────────────────────────────────────────────────
$SEP = "---------------------------------------------"

function Show-Status {
    param([string]$SessionName, [string]$Status)
    Clear-Host
    Write-Host ""
    Write-Host $SEP
    Write-Host ""
    Write-Host "    managerkim-setup v1.0" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "    $SessionName" -NoNewline -ForegroundColor White
    Write-Host " 님이 접속 중입니다" -ForegroundColor Gray
    Write-Host ""
    Write-Host "    $Status"
    Write-Host ""
    Write-Host $SEP
    if ($script:LogBuffer.Count -gt 0) {
        Write-Host ""
        foreach ($entry in $script:LogBuffer) {
            Write-Host "    $($entry.Icon) $($entry.Text)"
        }
        Write-Host ""
        Write-Host $SEP
    }
    Write-Host ""
    Write-Host "    * 이 창을 닫지 마세요" -ForegroundColor Yellow
    Write-Host "    * 강사가 원격으로 설치를 진행합니다" -ForegroundColor Gray
    Write-Host "    * 종료하려면 Ctrl+C" -ForegroundColor Gray
    Write-Host ""
}

function Get-Timestamp {
    return (Get-Date).ToString("HH:mm:ss")
}

# ── Prompt for name ─────────────────────────────────────────────
if (-not $Name) {
    Write-Host ""
    Write-Host $SEP
    Write-Host ""
    Write-Host "    managerkim-setup" -ForegroundColor Cyan
    Write-Host "    워크샵 원격 설치 클라이언트" -ForegroundColor Gray
    Write-Host ""
    Write-Host $SEP
    Write-Host ""
    $Name = Read-Host "    이름을 입력하세요 (예: 홍길동)"
    if ([string]::IsNullOrWhiteSpace($Name)) {
        $Name = "student-$(Get-Date -Format 'fff')"
    }
}

$script:LogBuffer = New-Object System.Collections.ArrayList

# ── Admin check ─────────────────────────────────────────────────
try {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Host ""
        Write-Host "    [!] 관리자 권한 없이 실행 중 (일부 설치가 실패할 수 있음)" -ForegroundColor Yellow
        Start-Sleep -Seconds 1
    }
}
catch {
    # ignore
}

# ── WebSocket helpers ───────────────────────────────────────────
function Send-WsMessage {
    param(
        [System.Net.WebSockets.ClientWebSocket]$Ws,
        [hashtable]$Message
    )

    if ($Ws.State -ne [System.Net.WebSockets.WebSocketState]::Open) { return }

    try {
        $jsonStr = $Message | ConvertTo-Json -Compress -Depth 5
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
        $segment = New-Object System.ArraySegment[byte] -ArgumentList (,$bytes)
        $token = [System.Threading.CancellationToken]::None
        $task = $Ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $token)
        $task.GetAwaiter().GetResult() | Out-Null
    }
    catch {
        # ignore send errors
    }
}

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
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "powershell.exe"
        $cmdBytes = [System.Text.Encoding]::Unicode.GetBytes($Command)
        $cmdB64 = [Convert]::ToBase64String($cmdBytes)
        $psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -EncodedCommand $cmdB64"
        $psi.UseShellExecute = $false
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.CreateNoWindow = $true
        $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
        $psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8

        $proc = [System.Diagnostics.Process]::Start($psi)

        while (-not $proc.StandardOutput.EndOfStream) {
            $line = $proc.StandardOutput.ReadLine()
            if ($null -ne $line) {
                $text = $line + "`n"
                $outputAll += $text
                Send-WsMessage -Ws $Ws -Message @{
                    type = "output"
                    id = $Id
                    stream = "stdout"
                    data = $text
                }
            }
        }

        $stderr = $proc.StandardError.ReadToEnd()
        if ($stderr) {
            $outputAll += $stderr
            Send-WsMessage -Ws $Ws -Message @{
                type = "output"
                id = $Id
                stream = "stderr"
                data = $stderr
            }
        }

        $proc.WaitForExit()
        $exitCode = $proc.ExitCode
    }
    catch {
        $errText = "Error: $($_.Exception.Message)`n"
        $outputAll += $errText
        Send-WsMessage -Ws $Ws -Message @{
            type = "output"
            id = $Id
            stream = "stderr"
            data = $errText
        }
        $exitCode = 1
    }

    return @{ ExitCode = $exitCode; Output = $outputAll }
}

# ── Persistent receive ──────────────────────────────────────────
$script:_recvTask = $null
$script:_recvBuffer = $null
$script:_recvSegment = $null

function Reset-ReceiveState {
    $script:_recvTask = $null
    $script:_recvBuffer = $null
    $script:_recvSegment = $null
}

function Receive-WsMessage {
    param(
        [System.Net.WebSockets.ClientWebSocket]$Ws,
        [int]$TimeoutMs = 2000
    )

    if ($Ws.State -ne [System.Net.WebSockets.WebSocketState]::Open) { return $null }

    if ($null -eq $script:_recvTask) {
        $script:_recvBuffer = New-Object byte[] 65536
        $script:_recvSegment = New-Object System.ArraySegment[byte] -ArgumentList (,$script:_recvBuffer)
        $script:_recvTask = $Ws.ReceiveAsync($script:_recvSegment, [System.Threading.CancellationToken]::None)
    }

    try {
        $completed = $script:_recvTask.Wait($TimeoutMs)
    }
    catch {
        $inner = $_.Exception
        while ($inner.InnerException) { $inner = $inner.InnerException }
        Reset-ReceiveState
        return @{ type = "__error"; message = $inner.Message }
    }

    if (-not $completed) {
        return $null
    }

    $result = $script:_recvTask.Result
    $buf = $script:_recvBuffer
    Reset-ReceiveState

    if ($result.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) {
        return @{ type = "__close" }
    }

    $received = [System.Text.Encoding]::UTF8.GetString($buf, 0, $result.Count)

    try {
        return ($received | ConvertFrom-Json)
    }
    catch {
        return $null
    }
}

# ── Main loop ───────────────────────────────────────────────────
function Start-RelayClient {
    while ($true) {
        $ws = $null
        Reset-ReceiveState
        try {
            Show-Status -SessionName $Name -Status "    [..] 서버에 연결하는 중..."

            $ws = New-Object System.Net.WebSockets.ClientWebSocket
            $ws.Options.KeepAliveInterval = [TimeSpan]::FromSeconds(30)
            $uri = New-Object System.Uri($RelayUrl)
            $token = [System.Threading.CancellationToken]::None

            $ws.ConnectAsync($uri, $token).GetAwaiter().GetResult() | Out-Null

            Send-WsMessage -Ws $ws -Message @{
                type        = "register"
                name        = $Name
                os          = "win32"
                nodeVersion = "powershell-$($PSVersionTable.PSVersion)"
            }

            Show-Status -SessionName $Name -Status "    [OK] 연결 완료! 강사의 지시를 기다리는 중..."

            # Message loop
            while ($ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
                try {
                    $msg = Receive-WsMessage -Ws $ws -TimeoutMs 2000

                    if ($null -eq $msg) { continue }

                    if ($msg.type -eq "__close") { break }
                    if ($msg.type -eq "__error") { break }

                    if ($msg.type -eq "registered") {
                        Show-Status -SessionName $Name -Status "    [OK] 연결 완료! 강사의 지시를 기다리는 중..."
                        continue
                    }

                    if ($msg.type -eq "exec") {
                        $cmdShort = $msg.command
                        if ($cmdShort.Length -gt 40) {
                            $cmdShort = $cmdShort.Substring(0, 40) + "..."
                        }

                        Show-Status -SessionName $Name -Status "    [>>] 명령 실행 중... (잠시 기다려주세요)"
                        Write-Host "    $(Get-Timestamp) $cmdShort" -ForegroundColor DarkGray

                        $result = Invoke-RelayCommand -Id $msg.id -Command $msg.command -Ws $ws

                        $icon = "[X]"
                        if ($result.ExitCode -eq 0) { $icon = "[OK]" }

                        $resultShort = "exit $($result.ExitCode)"
                        $trimmed = "$($result.Output)".Trim()
                        if ($trimmed.Length -gt 0) {
                            $lines = $trimmed.Split("`n")
                            $lastLine = $lines[$lines.Length - 1]
                            if ($lastLine.Length -gt 30) {
                                $resultShort = $lastLine.Substring(0, 30)
                            }
                            elseif ($lastLine.Length -gt 0) {
                                $resultShort = $lastLine
                            }
                        }

                        $script:LogBuffer.Add(@{ Icon = "$(Get-Timestamp)"; Text = $cmdShort }) | Out-Null
                        $script:LogBuffer.Add(@{ Icon = $icon; Text = $resultShort }) | Out-Null

                        Send-WsMessage -Ws $ws -Message @{
                            type     = "done"
                            id       = $msg.id
                            exitCode = $result.ExitCode
                        }

                        Show-Status -SessionName $Name -Status "    [OK] 연결 완료! 강사의 지시를 기다리는 중..."
                    }
                }
                catch {
                    Write-Host "    [!] 오류: $($_.Exception.Message)" -ForegroundColor Yellow
                }
            }
        }
        catch {
            Write-Host ""
            Write-Host "    [!] 연결 오류: $($_.Exception.Message)" -ForegroundColor Red
        }
        finally {
            Reset-ReceiveState
            if ($ws) {
                try {
                    $ws.Dispose()
                }
                catch {
                    # ignore
                }
            }
        }

        Write-Host "    3초 후 다시 연결합니다..." -ForegroundColor Gray
        Start-Sleep -Seconds 3
    }
}

# ── Entry point ─────────────────────────────────────────────────
try {
    Start-RelayClient
}
catch {
    if ($_.Exception.GetType().Name -eq "PipelineStoppedException") {
        Write-Host "`n    종료합니다..."
    }
    else {
        throw
    }
}
