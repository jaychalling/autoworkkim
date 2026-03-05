#Requires -Version 5.1
<#
.SYNOPSIS
  managerkim-setup PowerShell client
.DESCRIPTION
  .NET ClientWebSocket으로 VPS 릴레이 서버(1664)에 연결하여
  강사의 원격 명령을 받아 실행하고 결과를 스트리밍합니다.
  36개 원격 액션 지원 (스크린샷, 메시지, TTS, 파일전송 등).
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
    Write-Host "    managerkim-setup v2.0" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "    $SessionName" -NoNewline -ForegroundColor White
    Write-Host " 님이 접속 중입니다" -ForegroundColor Gray
    Write-Host ""
    Write-Host "    $Status"
    Write-Host ""
    Write-Host $SEP
    if ($script:LogBuffer.Count -gt 0) {
        Write-Host ""
        $start = 0
        if ($script:LogBuffer.Count -gt 20) {
            $start = $script:LogBuffer.Count - 20
        }
        for ($i = $start; $i -lt $script:LogBuffer.Count; $i++) {
            $entry = $script:LogBuffer[$i]
            $color = "Gray"
            if ($entry.Icon -eq "[MSG]") { $color = "Cyan" }
            elseif ($entry.Icon -eq "[OK]") { $color = "Green" }
            elseif ($entry.Icon -eq "[X]") { $color = "Red" }
            Write-Host "    $($entry.Icon) $($entry.Text)" -ForegroundColor $color
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
        $jsonStr = $Message | ConvertTo-Json -Compress -Depth 10
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

# ── Action handler (36 actions) ─────────────────────────────────
function Invoke-Action {
    param(
        [string]$Id,
        [string]$Action,
        [PSObject]$Msg,
        [System.Net.WebSockets.ClientWebSocket]$Ws
    )

    $data = @{}

    try {
        switch ($Action) {

            "message" {
                $text = $Msg.text
                if (-not $text) { $text = "" }
                $script:LogBuffer.Add(@{ Icon = "[MSG]"; Text = $text }) | Out-Null
                Show-Status -SessionName $Name -Status "    [OK] 연결 완료! 강사의 지시를 기다리는 중..."
                $data = @{ status = "displayed" }
            }

            "screenshot" {
                Add-Type -AssemblyName System.Windows.Forms
                Add-Type -AssemblyName System.Drawing
                $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
                $bmp = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
                $g = [System.Drawing.Graphics]::FromImage($bmp)
                $g.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
                $ms = New-Object System.IO.MemoryStream
                $quality = $Msg.quality
                if (-not $quality) { $quality = 50 }
                $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
                $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
                $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int]$quality)
                $bmp.Save($ms, $jpegCodec, $encParams)
                $base64 = [Convert]::ToBase64String($ms.ToArray())
                $ms.Dispose(); $bmp.Dispose(); $g.Dispose()
                $data = @{ image = $base64; width = $bounds.Width; height = $bounds.Height; format = "jpeg" }
            }

            "alert" {
                Add-Type -AssemblyName System.Windows.Forms
                $title = $Msg.title
                if (-not $title) { $title = "managerkim-setup" }
                $text = $Msg.text
                if (-not $text) { $text = "" }
                $btnType = [System.Windows.Forms.MessageBoxButtons]::OK
                if ($Msg.buttons -eq "OKCancel") { $btnType = [System.Windows.Forms.MessageBoxButtons]::OKCancel }
                elseif ($Msg.buttons -eq "YesNo") { $btnType = [System.Windows.Forms.MessageBoxButtons]::YesNo }
                elseif ($Msg.buttons -eq "YesNoCancel") { $btnType = [System.Windows.Forms.MessageBoxButtons]::YesNoCancel }
                $result = [System.Windows.Forms.MessageBox]::Show($text, $title, $btnType)
                $data = @{ clicked = $result.ToString() }
            }

            "notify" {
                Add-Type -AssemblyName System.Windows.Forms
                Add-Type -AssemblyName System.Drawing
                $balloon = New-Object System.Windows.Forms.NotifyIcon
                $balloon.Icon = [System.Drawing.SystemIcons]::Information
                $balloon.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info
                $title = $Msg.title
                if (-not $title) { $title = "managerkim-setup" }
                $balloon.BalloonTipTitle = $title
                $text = $Msg.text
                if (-not $text) { $text = "" }
                $balloon.BalloonTipText = $text
                $balloon.Visible = $true
                $balloon.ShowBalloonTip(5000)
                Start-Sleep -Milliseconds 200
                $data = @{ status = "shown" }
            }

            "url" {
                Start-Process $Msg.url
                $data = @{ status = "opened"; url = $Msg.url }
            }

            "upload" {
                $content = [Convert]::FromBase64String($Msg.content)
                $dir = [System.IO.Path]::GetDirectoryName($Msg.path)
                if (-not (Test-Path $dir)) {
                    New-Item -ItemType Directory -Path $dir -Force | Out-Null
                }
                [System.IO.File]::WriteAllBytes($Msg.path, $content)
                $data = @{ status = "saved"; path = $Msg.path; size = $content.Length }
            }

            "download" {
                if (-not (Test-Path $Msg.path)) {
                    $data = @{ error = "File not found: $($Msg.path)" }
                } else {
                    $bytes = [System.IO.File]::ReadAllBytes($Msg.path)
                    $base64 = [Convert]::ToBase64String($bytes)
                    $data = @{ content = $base64; path = $Msg.path; size = $bytes.Length }
                }
            }

            "sysinfo" {
                $os = Get-CimInstance Win32_OperatingSystem
                $cpu = Get-CimInstance Win32_Processor
                $cs = Get-CimInstance Win32_ComputerSystem
                $disks = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
                    @{ drive = $_.DeviceID; freeGB = [math]::Round($_.FreeSpace / 1GB, 1); totalGB = [math]::Round($_.Size / 1GB, 1) }
                }
                $ips = @()
                try {
                    $ips = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
                        Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -ne "127.0.0.1" }).IPAddress
                } catch { }
                $data = @{
                    hostname = $env:COMPUTERNAME
                    username = $env:USERNAME
                    os = $os.Caption
                    osVersion = $os.Version
                    arch = $env:PROCESSOR_ARCHITECTURE
                    cpu = $cpu.Name
                    ramGB = [math]::Round($cs.TotalPhysicalMemory / 1GB, 1)
                    disks = $disks
                    ips = $ips
                    uptime = ((Get-Date) - $os.LastBootUpTime).ToString("d\.hh\:mm\:ss")
                    psVersion = $PSVersionTable.PSVersion.ToString()
                }
            }

            "processes" {
                $procs = Get-Process -ErrorAction SilentlyContinue
                if ($Msg.filter) {
                    $procs = $procs | Where-Object { $_.ProcessName -like "*$($Msg.filter)*" }
                }
                $list = $procs | Sort-Object -Property WorkingSet64 -Descending | Select-Object -First 50 | ForEach-Object {
                    @{ name = $_.ProcessName; pid = $_.Id; memMB = [math]::Round($_.WorkingSet64 / 1MB, 1); cpu = [math]::Round($_.CPU, 1) }
                }
                $data = @{ count = ($procs | Measure-Object).Count; top50 = $list }
            }

            "clipboard-get" {
                Add-Type -AssemblyName System.Windows.Forms
                $text = [System.Windows.Forms.Clipboard]::GetText()
                $data = @{ text = $text }
            }

            "clipboard-set" {
                Add-Type -AssemblyName System.Windows.Forms
                [System.Windows.Forms.Clipboard]::SetText($Msg.text)
                $data = @{ status = "set" }
            }

            "lock" {
                rundll32.exe user32.dll,LockWorkStation
                $data = @{ status = "locked" }
            }

            "shutdown" {
                $data = @{ status = "shutting-down" }
                Send-WsMessage -Ws $Ws -Message @{ type = "action-result"; id = $Id; action = $Action; data = $data }
                Start-Sleep -Seconds 1
                Stop-Computer -Force
                return
            }

            "restart" {
                $data = @{ status = "restarting" }
                Send-WsMessage -Ws $Ws -Message @{ type = "action-result"; id = $Id; action = $Action; data = $data }
                Start-Sleep -Seconds 1
                Restart-Computer -Force
                return
            }

            "speak" {
                $voice = New-Object -ComObject SAPI.SpVoice
                $voice.Speak($Msg.text, 1) | Out-Null
                $data = @{ status = "speaking" }
            }

            "beep" {
                $freq = $Msg.frequency
                if (-not $freq) { $freq = 800 }
                $dur = $Msg.duration
                if (-not $dur) { $dur = 300 }
                [Console]::Beep([int]$freq, [int]$dur)
                $data = @{ status = "beeped" }
            }

            "wallpaper" {
                $wpPath = $Msg.path
                if ($Msg.url) {
                    $wpPath = Join-Path $env:TEMP "relay-wallpaper.jpg"
                    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
                    (New-Object Net.WebClient).DownloadFile($Msg.url, $wpPath)
                }
                if (-not ([System.Management.Automation.PSTypeName]'WallpaperHelper').Type) {
                    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class WallpaperHelper {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
"@
                }
                [WallpaperHelper]::SystemParametersInfo(0x0014, 0, $wpPath, 0x0003)
                $data = @{ status = "changed"; path = $wpPath }
            }

            "input" {
                Add-Type -AssemblyName System.Windows.Forms
                Add-Type -AssemblyName System.Drawing
                $form = New-Object System.Windows.Forms.Form
                $title = $Msg.title
                if (-not $title) { $title = "managerkim-setup" }
                $form.Text = $title
                $form.Size = New-Object System.Drawing.Size(420, 200)
                $form.StartPosition = "CenterScreen"
                $form.TopMost = $true
                $form.FormBorderStyle = "FixedDialog"
                $form.MaximizeBox = $false

                $lbl = New-Object System.Windows.Forms.Label
                $lbl.Location = New-Object System.Drawing.Point(15, 20)
                $lbl.Size = New-Object System.Drawing.Size(370, 25)
                $prompt = $Msg.prompt
                if (-not $prompt) { $prompt = "" }
                $lbl.Text = $prompt
                $form.Controls.Add($lbl)

                $tb = New-Object System.Windows.Forms.TextBox
                $tb.Location = New-Object System.Drawing.Point(15, 55)
                $tb.Size = New-Object System.Drawing.Size(370, 25)
                $form.Controls.Add($tb)

                $okBtn = New-Object System.Windows.Forms.Button
                $okBtn.Location = New-Object System.Drawing.Point(305, 100)
                $okBtn.Size = New-Object System.Drawing.Size(80, 35)
                $okBtn.Text = "OK"
                $okBtn.DialogResult = [System.Windows.Forms.DialogResult]::OK
                $form.Controls.Add($okBtn)
                $form.AcceptButton = $okBtn

                $cancelBtn = New-Object System.Windows.Forms.Button
                $cancelBtn.Location = New-Object System.Drawing.Point(215, 100)
                $cancelBtn.Size = New-Object System.Drawing.Size(80, 35)
                $cancelBtn.Text = "Cancel"
                $cancelBtn.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
                $form.Controls.Add($cancelBtn)

                $dlgResult = $form.ShowDialog()
                $data = @{ text = $tb.Text; result = $dlgResult.ToString() }
                $form.Dispose()
            }

            "list-files" {
                $dir = $Msg.path
                if (-not $dir) { $dir = $env:USERPROFILE }
                $items = Get-ChildItem -Path $dir -ErrorAction SilentlyContinue | ForEach-Object {
                    $type = "file"
                    if ($_.PSIsContainer) { $type = "dir" }
                    $size = 0
                    if (-not $_.PSIsContainer) { $size = $_.Length }
                    @{ name = $_.Name; type = $type; size = $size; modified = $_.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss") }
                }
                $data = @{ path = $dir; items = $items }
            }

            "run-visible" {
                $cmd = $Msg.command
                if (-not $cmd) { $cmd = "echo done" }
                Start-Process cmd -ArgumentList "/k", $cmd
                $data = @{ status = "launched" }
            }

            "env-get" {
                if ($Msg.name) {
                    $val = [Environment]::GetEnvironmentVariable($Msg.name)
                    $data = @{ name = $Msg.name; value = $val }
                } else {
                    $all = @{}
                    foreach ($key in [Environment]::GetEnvironmentVariables().Keys) {
                        $all["$key"] = [Environment]::GetEnvironmentVariable("$key")
                    }
                    $data = @{ variables = $all }
                }
            }

            "env-set" {
                [Environment]::SetEnvironmentVariable($Msg.name, $Msg.value, "User")
                Set-Item -Path "Env:\$($Msg.name)" -Value $Msg.value -ErrorAction SilentlyContinue
                $data = @{ status = "set"; name = $Msg.name }
            }

            "installed" {
                $apps = Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*,
                    HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* -ErrorAction SilentlyContinue |
                    Where-Object { $_.DisplayName } |
                    Sort-Object DisplayName
                if ($Msg.filter) {
                    $apps = $apps | Where-Object { $_.DisplayName -like "*$($Msg.filter)*" }
                }
                $list = $apps | ForEach-Object {
                    @{ name = $_.DisplayName; version = $_.DisplayVersion; publisher = $_.Publisher }
                }
                $data = @{ count = ($list | Measure-Object).Count; apps = $list }
            }

            "wifi" {
                $profiles = netsh wlan show profiles 2>&1
                $current = netsh wlan show interfaces 2>&1
                $data = @{ profiles = "$profiles"; current = "$current" }
            }

            "services" {
                $svcs = Get-Service -ErrorAction SilentlyContinue
                if ($Msg.filter) {
                    $svcs = $svcs | Where-Object { $_.Name -like "*$($Msg.filter)*" -or $_.DisplayName -like "*$($Msg.filter)*" }
                }
                $list = $svcs | Select-Object -First 100 | ForEach-Object {
                    @{ name = $_.Name; display = $_.DisplayName; status = $_.Status.ToString() }
                }
                $data = @{ count = ($svcs | Measure-Object).Count; services = $list }
            }

            "registry-get" {
                if (Test-Path $Msg.path) {
                    $props = Get-ItemProperty -Path $Msg.path -ErrorAction SilentlyContinue
                    $values = @{}
                    foreach ($p in $props.PSObject.Properties) {
                        if ($p.Name -notlike "PS*") {
                            $values[$p.Name] = "$($p.Value)"
                        }
                    }
                    $data = @{ path = $Msg.path; values = $values }
                } else {
                    $data = @{ error = "Path not found: $($Msg.path)" }
                }
            }

            "network" {
                $adapters = Get-NetAdapter -ErrorAction SilentlyContinue | ForEach-Object {
                    @{ name = $_.Name; status = $_.Status.ToString(); mac = $_.MacAddress; speed = $_.LinkSpeed }
                }
                $connections = Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue |
                    Select-Object -First 30 | ForEach-Object {
                    @{ local = "$($_.LocalAddress):$($_.LocalPort)"; remote = "$($_.RemoteAddress):$($_.RemotePort)"; pid = $_.OwningProcess }
                }
                $data = @{ adapters = $adapters; connections = $connections }
            }

            "taskkill" {
                if ($Msg.pid) {
                    Stop-Process -Id $Msg.pid -Force -ErrorAction SilentlyContinue
                    $data = @{ status = "killed"; pid = $Msg.pid }
                } elseif ($Msg.name) {
                    $killed = Get-Process -Name $Msg.name -ErrorAction SilentlyContinue
                    $killed | Stop-Process -Force -ErrorAction SilentlyContinue
                    $data = @{ status = "killed"; name = $Msg.name; count = ($killed | Measure-Object).Count }
                } else {
                    $data = @{ error = "name or pid required" }
                }
            }

            "type-keys" {
                Add-Type -AssemblyName System.Windows.Forms
                [System.Windows.Forms.SendKeys]::SendWait($Msg.keys)
                $data = @{ status = "sent"; keys = $Msg.keys }
            }

            "window-list" {
                $windows = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle } | ForEach-Object {
                    @{ name = $_.ProcessName; pid = $_.Id; title = $_.MainWindowTitle; memMB = [math]::Round($_.WorkingSet64 / 1MB, 1) }
                }
                $data = @{ windows = $windows }
            }

            "window-focus" {
                if (-not ([System.Management.Automation.PSTypeName]'FocusHelper').Type) {
                    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class FocusHelper {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@
                }
                $proc = Get-Process -Id $Msg.pid -ErrorAction SilentlyContinue
                if ($proc -and $proc.MainWindowHandle -ne [IntPtr]::Zero) {
                    [FocusHelper]::ShowWindow($proc.MainWindowHandle, 9) | Out-Null
                    [FocusHelper]::SetForegroundWindow($proc.MainWindowHandle) | Out-Null
                    $data = @{ status = "focused"; pid = $Msg.pid }
                } else {
                    $data = @{ error = "Window not found for pid $($Msg.pid)" }
                }
            }

            "zip" {
                $source = $Msg.source
                $dest = $Msg.destination
                if (-not $dest) { $dest = "$source.zip" }
                if (Test-Path $dest) { Remove-Item $dest -Force }
                Add-Type -AssemblyName System.IO.Compression.FileSystem
                if (Test-Path $source -PathType Container) {
                    [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $dest)
                } else {
                    $zipArchive = [System.IO.Compression.ZipFile]::Open($dest, 'Create')
                    [void]$zipArchive.CreateEntryFromFile($source, [System.IO.Path]::GetFileName($source))
                    $zipArchive.Dispose()
                }
                $data = @{ status = "compressed"; path = $dest; size = (Get-Item $dest).Length }
            }

            "unzip" {
                $source = $Msg.source
                $dest = $Msg.destination
                if (-not $dest) { $dest = [System.IO.Path]::GetDirectoryName($source) }
                Add-Type -AssemblyName System.IO.Compression.FileSystem
                [System.IO.Compression.ZipFile]::ExtractToDirectory($source, $dest)
                $data = @{ status = "extracted"; path = $dest }
            }

            "ping" {
                $hostName = $Msg.host
                $count = $Msg.count
                if (-not $count) { $count = 4 }
                $results = Test-Connection -ComputerName $hostName -Count $count -ErrorAction SilentlyContinue | ForEach-Object {
                    @{ address = $_.Address.ToString(); time = $_.ResponseTime; ttl = $_.TimeToLive }
                }
                $data = @{ host = $hostName; results = $results }
            }

            "dns" {
                try {
                    $addrs = [System.Net.Dns]::GetHostAddresses($Msg.hostname)
                    $records = $addrs | ForEach-Object { @{ address = $_.ToString(); family = $_.AddressFamily.ToString() } }
                    $data = @{ hostname = $Msg.hostname; records = $records }
                } catch {
                    $data = @{ hostname = $Msg.hostname; error = $_.Exception.Message }
                }
            }

            "performance" {
                $cpu = (Get-CimInstance Win32_Processor).LoadPercentage
                $os = Get-CimInstance Win32_OperatingSystem
                $ramUsed = [math]::Round(($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / 1MB, 1)
                $ramTotal = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1)
                $ramPercent = [math]::Round(($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / $os.TotalVisibleMemorySize * 100, 1)
                $data = @{ cpuPercent = $cpu; ramUsedGB = $ramUsed; ramTotalGB = $ramTotal; ramPercent = $ramPercent }
            }

            default {
                $data = @{ error = "Unknown action: $Action" }
            }
        }
    }
    catch {
        $data = @{ error = $_.Exception.Message }
    }

    Send-WsMessage -Ws $Ws -Message @{
        type = "action-result"
        id = $Id
        action = $Action
        data = $data
    }
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
        $script:_recvBuffer = New-Object byte[] 262144
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

    # Handle multi-frame messages (for large payloads like file uploads)
    $ms = New-Object System.IO.MemoryStream
    $ms.Write($buf, 0, $result.Count)

    while (-not $result.EndOfMessage) {
        $contBuf = New-Object byte[] 262144
        $contSeg = New-Object System.ArraySegment[byte] -ArgumentList (,$contBuf)
        $contTask = $Ws.ReceiveAsync($contSeg, [System.Threading.CancellationToken]::None)
        try {
            $contTask.Wait(30000) | Out-Null
            $result = $contTask.Result
            $ms.Write($contBuf, 0, $result.Count)
        }
        catch {
            $ms.Dispose()
            return @{ type = "__error"; message = "Multi-frame receive failed" }
        }
    }

    $received = [System.Text.Encoding]::UTF8.GetString($ms.ToArray())
    $ms.Dispose()

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

                    if ($msg.type -eq "action") {
                        $actionName = $msg.action
                        $script:LogBuffer.Add(@{ Icon = "$(Get-Timestamp)"; Text = "[action] $actionName" }) | Out-Null
                        Show-Status -SessionName $Name -Status "    [>>] 액션 실행 중: $actionName"

                        Invoke-Action -Id $msg.id -Action $actionName -Msg $msg -Ws $ws

                        $script:LogBuffer.Add(@{ Icon = "[OK]"; Text = "$actionName 완료" }) | Out-Null
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
