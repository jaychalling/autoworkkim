# =============================================================================
# Easy클코 — Claude Code Windows 환경 자동 설치
# =============================================================================
#
# 실행 방법:
#   1. easy-clco-setup.bat 더블클릭 (권장)
#   2. PowerShell 직접: Set-ExecutionPolicy Bypass -Scope Process -Force; .\install-windows.ps1
#   3. 원격 실행: irm https://managerkim.com/downloads/install-windows.ps1 | iex
#
# 테스트 모드 (감지만, 설치 안 함):
#   .\install-windows.ps1 --test
#
# =============================================================================

Set-ExecutionPolicy Bypass -Scope Process -Force

# --- UTF-8 출력 설정 ---
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"
chcp 65001 | Out-Null

# --- 실행 모드 ---
$script:TestMode = $false
if ($args -contains "--test" -or $args -contains "--dry-run" -or $args -contains "-t") {
    $script:TestMode = $true
}

# --- 전역 변수 ---
$script:Results = @{}
$script:StepNumber = 0
$script:TotalSteps = 7
$script:WorkspaceDir = Join-Path $env:USERPROFILE "claude-workspace"
$script:Cancelled = $false

# --- 로그 파일 ---
$script:LogFile = Join-Path $env:USERPROFILE "Desktop\easy-clco-install-log.txt"
if (-not (Test-Path (Split-Path $script:LogFile))) {
    $script:LogFile = Join-Path $env:USERPROFILE "easy-clco-install-log.txt"
}

# =============================================================================
# 유틸리티 함수
# =============================================================================

function Write-Log {
    param([string]$Message)
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $script:LogFile -Value "[$ts] $Message" -Encoding UTF8
}

function Write-SystemInfo {
    Write-Log "============================================"
    Write-Log "Easy클코 — 설치 로그"
    Write-Log "============================================"
    Write-Log "실행 시각: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    Write-Log "테스트 모드: $($script:TestMode)"
    Write-Log "OS: $([System.Environment]::OSVersion.VersionString)"
    $arch = if ([System.Environment]::Is64BitOperatingSystem) { "64-bit" } else { "32-bit" }
    Write-Log "아키텍처: $arch"
    Write-Log "사용자: $env:USERNAME"
    Write-Log "홈 경로: $env:USERPROFILE"
    Write-Log "PowerShell: $($PSVersionTable.PSVersion)"
    Write-Log "관리자 권한: $(([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))"

    $hasWinget = $null -ne (Get-Command "winget" -ErrorAction SilentlyContinue)
    Write-Log "winget 사용 가능: $hasWinget"

    Write-Log "--- PATH ---"
    $env:Path -split ";" | ForEach-Object { Write-Log "  $_" }
    Write-Log "--- END PATH ---"
    Write-Log ""
}

function Show-Header {
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║                                                        ║" -ForegroundColor Cyan
    Write-Host "  ║     Easy클코 — Claude Code 환경 자동 설치              ║" -ForegroundColor Cyan
    Write-Host "  ║                                                        ║" -ForegroundColor Cyan
    Write-Host "  ║     Git · Claude Code · Node.js · WezTerm              ║" -ForegroundColor Cyan
    Write-Host "  ║                                                        ║" -ForegroundColor Cyan
    Write-Host "  ╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    if ($script:TestMode) {
        Write-Host "  테스트 모드 — 감지만 수행하고 설치하지 않습니다" -ForegroundColor Magenta
    }
    Write-Host ""
}

function Show-Step {
    param([string]$Title)
    $script:StepNumber++
    $progress = "[$($script:StepNumber)/$($script:TotalSteps)]"
    $bar = ("█" * $script:StepNumber) + ("░" * ($script:TotalSteps - $script:StepNumber))
    Write-Host ""
    Write-Host "  ─────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  $progress $bar" -ForegroundColor Yellow
    Write-Host "  $Title" -ForegroundColor White
    Write-Host "  ─────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Log ""
    Write-Log "========== $progress $Title =========="
}

function Write-Status {
    param(
        [string]$Message,
        [ValidateSet("Info","Success","Error","Warning","Progress")]
        [string]$Type = "Info"
    )
    switch ($Type) {
        "Info"     { Write-Host "  ℹ️  $Message" -ForegroundColor Gray }
        "Success"  { Write-Host "  ✅ $Message" -ForegroundColor Green }
        "Error"    { Write-Host "  ❌ $Message" -ForegroundColor Red }
        "Warning"  { Write-Host "  ⚠️  $Message" -ForegroundColor Yellow }
        "Progress" { Write-Host "  ⏳ $Message" -ForegroundColor Cyan }
    }
    Write-Log "[$Type] $Message"
}

function Update-PathEnvironment {
    $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath    = [System.Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$machinePath;$userPath"
}

function Test-CommandExists {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

function Get-TempFilePath {
    param([string]$FileName)
    Join-Path $env:TEMP $FileName
}

function Find-WezTermExe {
    $searchDirs = @(
        "C:\Program Files\WezTerm",
        "C:\Program Files (x86)\WezTerm",
        "${env:LOCALAPPDATA}\Programs\WezTerm"
    )
    foreach ($dir in $searchDirs) {
        if (Test-Path $dir) {
            $direct = Join-Path $dir "wezterm-gui.exe"
            if (Test-Path $direct) { return $direct }
            $sub = Get-ChildItem -Path $dir -Directory -ErrorAction SilentlyContinue |
                   Where-Object { $_.Name -match "WezTerm" } |
                   Sort-Object LastWriteTime -Descending |
                   Select-Object -First 1
            if ($sub) {
                $subExe = Join-Path $sub.FullName "wezterm-gui.exe"
                if (Test-Path $subExe) { return $subExe }
            }
        }
    }
    if (Test-CommandExists "wezterm-gui") {
        return (Get-Command "wezterm-gui" -ErrorAction SilentlyContinue).Source
    }
    return $null
}

# =============================================================================
# 환경 사전 분석 — 설치 전 현재 상태를 보여줌
# =============================================================================

function Show-EnvironmentScan {
    Write-Host "  시스템을 분석하고 있습니다..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  ─── 환경 분석 ──────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host ""

    $script:ToInstall = @()

    # Git
    $label = "Git".PadRight(18)
    Write-Host -NoNewline "    $label" -ForegroundColor White
    Start-Sleep -Milliseconds 300
    if (Test-CommandExists "git") {
        $v = & git --version 2>$null
        Write-Host "OK  $v" -ForegroundColor Green
    } else {
        Write-Host "X   미설치 -> 설치 예정" -ForegroundColor Red
        $script:ToInstall += "Git"
    }

    # Claude Code
    $label = "Claude Code".PadRight(18)
    Write-Host -NoNewline "    $label" -ForegroundColor White
    Start-Sleep -Milliseconds 300
    $nativePath = Join-Path $env:USERPROFILE ".local\bin\claude.exe"
    if ((Test-CommandExists "claude") -or (Test-Path $nativePath)) {
        $v = if (Test-CommandExists "claude") { & claude --version 2>$null } else { "설치됨 (PATH 미등록)" }
        Write-Host "OK  $v" -ForegroundColor Green
    } else {
        Write-Host "X   미설치 -> 설치 예정" -ForegroundColor Red
        $script:ToInstall += "Claude Code"
    }

    # Node.js
    $label = "Node.js".PadRight(18)
    Write-Host -NoNewline "    $label" -ForegroundColor White
    Start-Sleep -Milliseconds 300
    if (Test-CommandExists "node") {
        $v = & node --version 2>$null
        Write-Host "OK  $v" -ForegroundColor Green
    } else {
        Write-Host "X   미설치 -> 설치 예정" -ForegroundColor Red
        $script:ToInstall += "Node.js"
    }

    # WezTerm
    $label = "WezTerm".PadRight(18)
    Write-Host -NoNewline "    $label" -ForegroundColor White
    Start-Sleep -Milliseconds 300
    if (Find-WezTermExe) {
        Write-Host "OK  설치됨" -ForegroundColor Green
    } else {
        Write-Host "X   미설치 -> 설치 예정" -ForegroundColor Red
        $script:ToInstall += "WezTerm"
    }

    # 작업 폴더
    $label = "작업 폴더".PadRight(16)
    Write-Host -NoNewline "    $label" -ForegroundColor White
    Start-Sleep -Milliseconds 300
    if (Test-Path $script:WorkspaceDir) {
        Write-Host "OK  $($script:WorkspaceDir)" -ForegroundColor Green
    } else {
        Write-Host "X   없음 -> 생성 예정" -ForegroundColor Red
        $script:ToInstall += "작업 폴더"
    }

    Write-Host ""
    Write-Host "  ─────────────────────────────────────────────────────" -ForegroundColor DarkGray

    $found = 5 - $script:ToInstall.Count
    $missing = $script:ToInstall.Count

    if ($missing -eq 0) {
        Write-Host ""
        Write-Host "  모든 도구가 이미 설치되어 있습니다! 검증만 진행합니다." -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "    ${found}개 감지됨  /  ${missing}개 설치 필요" -ForegroundColor White
        Write-Host "    설치 예정: $($script:ToInstall -join ', ')" -ForegroundColor Yellow
        Write-Host ""

        if (-not $script:TestMode) {
            Write-Host -NoNewline "    설치를 진행할까요? (Y/n): " -ForegroundColor White
            $reply = Read-Host
            if ($reply -match "^[Nn]") {
                Write-Host ""
                Write-Host "  설치를 취소했습니다." -ForegroundColor Yellow
                Write-Host ""
                $script:Cancelled = $true
                return
            }
            Write-Host ""
            Write-Host "    설치를 시작합니다!" -ForegroundColor Green
            Write-Host ""
        }
    }
}

# =============================================================================
# Step 1: Git for Windows (Claude Code 필수 의존성)
# =============================================================================

function Install-Git {
    Show-Step "Git for Windows 설치 (Claude Code 필수)"

    if (Test-CommandExists "git") {
        $ver = & git --version 2>$null
        Write-Status "Git 이미 설치됨: $ver" -Type Success

        $gitBashExe = "C:\Program Files\Git\bin\bash.exe"
        if (Test-Path $gitBashExe) {
            Write-Status "Git Bash 확인: $gitBashExe" -Type Success
        } else {
            Write-Status "Git Bash 경로를 찾을 수 없습니다. Claude Code가 정상 동작하지 않을 수 있습니다." -Type Warning
        }

        $script:Results["Git"] = "✅ 설치 완료 ($ver)"
        return
    }

    Write-Status "Git이 없습니다. Claude Code 실행에 필수입니다." -Type Warning

    if ($script:TestMode) {
        Write-Status "[테스트 모드] 설치를 건너뜁니다." -Type Info
        $script:Results["Git"] = "⚠️ 미설치 (테스트 모드) — 필수!"
        return
    }

    Write-Status "설치를 시작합니다..." -Type Progress

    # --- 방법 1: winget ---
    $installed = $false
    if (Test-CommandExists "winget") {
        Write-Status "winget으로 Git 설치 시도..." -Type Progress
        try {
            $proc = Start-Process -FilePath "winget" `
                -ArgumentList "install","Git.Git","--accept-source-agreements","--accept-package-agreements","--silent" `
                -Wait -PassThru -NoNewWindow -ErrorAction SilentlyContinue
            if ($proc.ExitCode -eq 0) { $installed = $true }
        } catch {
            Write-Status "winget 설치 실패: $_" -Type Warning
        }
    }

    # --- 방법 2: 직접 다운로드 ---
    if (-not $installed) {
        Write-Status "직접 다운로드로 전환합니다..." -Type Warning
        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            $releasesApi = "https://api.github.com/repos/git-for-windows/git/releases/latest"
            $release = Invoke-RestMethod -Uri $releasesApi -UseBasicParsing -ErrorAction Stop
            $asset = $release.assets | Where-Object { $_.name -match "Git-.*-64-bit\.exe$" } | Select-Object -First 1

            if (-not $asset) { throw "64비트 Git 설치파일을 찾을 수 없습니다." }

            $exePath = Get-TempFilePath "git-installer.exe"
            Write-Status "다운로드 중: $($asset.browser_download_url)" -Type Progress
            Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $exePath -UseBasicParsing

            Write-Status "Git 설치 중..." -Type Progress
            $proc = Start-Process -FilePath $exePath `
                -ArgumentList "/VERYSILENT","/NORESTART","/NOCANCEL","/SP-","/CLOSEAPPLICATIONS","/RESTARTAPPLICATIONS","/COMPONENTS=icons,ext\reg\shellhere,assoc,assoc_sh" `
                -Wait -PassThru -Verb RunAs -ErrorAction Stop
            if ($proc.ExitCode -ne 0) { throw "Git installer exit code: $($proc.ExitCode)" }
            Remove-Item $exePath -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Status "Git 직접 설치도 실패했습니다: $_" -Type Error
            $script:Results["Git"] = "❌ 설치 실패 — Claude Code를 사용할 수 없습니다"
            return
        }
    }

    # --- 설치 확인 ---
    Update-PathEnvironment
    $gitCmdPath = "C:\Program Files\Git\cmd"
    if (Test-Path $gitCmdPath) { $env:Path = "$gitCmdPath;$env:Path" }
    Start-Sleep -Seconds 2

    if (Test-CommandExists "git") {
        $ver = & git --version 2>$null
        Write-Status "Git 설치 완료: $ver" -Type Success
        $script:Results["Git"] = "✅ 설치 완료 ($ver)"
    } else {
        Write-Status "Git 설치 후 확인 실패. 재부팅 후 다시 시도하세요." -Type Error
        $script:Results["Git"] = "❌ 설치 실패 (PATH 미반영 — 재부팅 필요)"
    }
}

# =============================================================================
# Step 2: Claude Code (네이티브 인스톨러 우선)
# =============================================================================

function Install-ClaudeCode {
    Show-Step "Claude Code 설치 (네이티브 인스톨러)"

    # 기존 설치 확인 (네이티브 또는 npm)
    if (Test-CommandExists "claude") {
        $ver = & claude --version 2>$null
        Write-Status "Claude Code 이미 설치됨: $ver" -Type Success

        $claudePath = (Get-Command "claude" -ErrorAction SilentlyContinue).Source
        if ($claudePath -like "*\.local\bin\*") {
            Write-Status "설치 방식: 네이티브 (자동 업데이트)" -Type Info
        } elseif ($claudePath -like "*npm*" -or $claudePath -like "*node_modules*") {
            Write-Status "설치 방식: npm (deprecated — 네이티브로 전환 권장)" -Type Warning
            Write-Status "전환 방법: claude install" -Type Info
        }

        $script:Results["Claude Code"] = "✅ 설치 완료 ($ver)"
        return
    }

    # 네이티브 바이너리 경로 확인
    $nativePath = Join-Path $env:USERPROFILE ".local\bin\claude.exe"
    if (Test-Path $nativePath) {
        $localBinDir = Split-Path $nativePath
        $env:Path = "$localBinDir;$env:Path"
        $ver = & claude --version 2>$null
        Write-Status "Claude Code 발견 (PATH 미등록): $nativePath" -Type Success
        Write-Status "PATH에 추가합니다." -Type Info
        $script:Results["Claude Code"] = "✅ 설치 완료 ($ver)"
        return
    }

    Write-Status "Claude Code가 없습니다." -Type Warning

    if ($script:TestMode) {
        Write-Status "[테스트 모드] 설치를 건너뜁니다." -Type Info
        Write-Status "[테스트 모드] 네이티브 경로 ($nativePath): $(Test-Path $nativePath)" -Type Info
        Write-Status "[테스트 모드] winget 사용 가능: $(Test-CommandExists 'winget')" -Type Info
        $npmAvail = Test-CommandExists "npm"
        Write-Status "[테스트 모드] npm 사용 가능: $npmAvail" -Type Info
        if ($npmAvail) {
            Write-Status "[테스트 모드] npm 버전: $(& npm --version 2>$null)" -Type Info
        }
        $script:Results["Claude Code"] = "⚠️ 미설치 (테스트 모드)"
        return
    }

    # --- 방법 1: 공식 네이티브 인스톨러 (권장) ---
    Write-Status "공식 네이티브 인스톨러로 설치 중... (Node.js 불필요)" -Type Progress
    $nativeInstalled = $false
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $installScript = Invoke-RestMethod -Uri "https://claude.ai/install.ps1" -UseBasicParsing -ErrorAction Stop
        Invoke-Expression $installScript
        Update-PathEnvironment
        $localBinDir = Join-Path $env:USERPROFILE ".local\bin"
        if (Test-Path $localBinDir) {
            $env:Path = "$localBinDir;$env:Path"
        }
        Start-Sleep -Seconds 2
        if (Test-CommandExists "claude") {
            $nativeInstalled = $true
        }
    } catch {
        Write-Status "네이티브 인스톨러 실패: $_" -Type Warning
    }

    # --- 방법 2: winget ---
    if (-not $nativeInstalled -and (Test-CommandExists "winget")) {
        Write-Status "winget으로 설치 시도..." -Type Progress
        try {
            $proc = Start-Process -FilePath "winget" `
                -ArgumentList "install","Anthropic.ClaudeCode","--accept-source-agreements","--accept-package-agreements","--silent" `
                -Wait -PassThru -NoNewWindow -ErrorAction SilentlyContinue
            if ($proc.ExitCode -eq 0) {
                Update-PathEnvironment
                Start-Sleep -Seconds 2
                if (Test-CommandExists "claude") { $nativeInstalled = $true }
            }
        } catch {
            Write-Status "winget 설치 실패: $_" -Type Warning
        }
    }

    # --- 방법 3: npm (레거시 — Node.js 필요) ---
    if (-not $nativeInstalled -and (Test-CommandExists "npm")) {
        Write-Status "npm으로 설치 시도 (레거시)..." -Type Progress
        try {
            & npm install -g @anthropic-ai/claude-code 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Update-PathEnvironment
                $npmPrefix = & npm config get prefix 2>$null
                if ($npmPrefix) { $env:Path = "$npmPrefix;$env:Path" }
                Start-Sleep -Seconds 2
                if (Test-CommandExists "claude") { $nativeInstalled = $true }
            }
        } catch {
            Write-Status "npm 설치 실패: $_" -Type Warning
        }
    }

    # --- 설치 확인 ---
    if (Test-CommandExists "claude") {
        $ver = & claude --version 2>$null
        Write-Status "Claude Code 설치 완료: $ver" -Type Success
        $script:Results["Claude Code"] = "✅ 설치 완료 ($ver)"
    } else {
        Write-Status "Claude Code 설치 실패. 수동 설치가 필요합니다." -Type Error
        Write-Status "수동 설치: PowerShell에서 irm https://claude.ai/install.ps1 | iex" -Type Info
        $script:Results["Claude Code"] = "❌ 설치 실패"
    }
}

# =============================================================================
# Step 3: Node.js (선택)
# =============================================================================

function Install-NodeJS {
    Show-Step "Node.js 설치 확인 (선택)"

    if (Test-CommandExists "node") {
        $ver = & node --version 2>$null
        $major = [int]($ver -replace "v(\d+)\..*", '$1')
        if ($major -ge 18) {
            Write-Status "Node.js 이미 설치됨: $ver" -Type Success
        } else {
            Write-Status "Node.js $ver 설치됨 — 18+ 권장 (현재 $major)" -Type Warning
        }
        $script:Results["Node.js"] = "✅ 설치 완료 ($ver)"
        return
    }

    Write-Status "Node.js가 없습니다. (Claude Code에는 불필요, 일부 프로젝트에 필요)" -Type Info

    if ($script:TestMode) {
        Write-Status "[테스트 모드] 설치를 건너뜁니다." -Type Info
        $script:Results["Node.js"] = "⚠️ 미설치 (테스트 모드)"
        return
    }

    Write-Status "설치를 시작합니다..." -Type Progress

    # --- 방법 1: winget ---
    $installed = $false
    if (Test-CommandExists "winget") {
        Write-Status "winget으로 Node.js LTS 설치 시도..." -Type Progress
        try {
            $proc = Start-Process -FilePath "winget" `
                -ArgumentList "install","OpenJS.NodeJS.LTS","--accept-source-agreements","--accept-package-agreements","--silent" `
                -Wait -PassThru -NoNewWindow -ErrorAction SilentlyContinue
            if ($proc.ExitCode -eq 0) { $installed = $true }
        } catch {
            Write-Status "winget 설치 실패: $_" -Type Warning
        }
    }

    # --- 방법 2: MSI 직접 다운로드 ---
    if (-not $installed) {
        Write-Status "MSI 직접 다운로드로 전환합니다..." -Type Warning
        try {
            $nodeVersion = "v22.14.0"
            $msiUrl = "https://nodejs.org/dist/$nodeVersion/node-$nodeVersion-x64.msi"
            $msiPath = Get-TempFilePath "node-installer.msi"

            Write-Status "다운로드 중: $msiUrl" -Type Progress
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri $msiUrl -OutFile $msiPath -UseBasicParsing

            Write-Status "MSI 설치 중 (관리자 권한 필요)..." -Type Progress
            $proc = Start-Process -FilePath "msiexec.exe" `
                -ArgumentList "/i","`"$msiPath`"","/qn","/norestart" `
                -Wait -PassThru -Verb RunAs -ErrorAction Stop
            if ($proc.ExitCode -ne 0) { throw "MSI exit code: $($proc.ExitCode)" }
            Remove-Item $msiPath -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Status "MSI 설치도 실패했습니다: $_" -Type Error
            $script:Results["Node.js"] = "❌ 설치 실패"
            return
        }
    }

    Update-PathEnvironment
    Start-Sleep -Seconds 2

    if (Test-CommandExists "node") {
        $ver = & node --version 2>$null
        Write-Status "Node.js 설치 완료: $ver" -Type Success
        $script:Results["Node.js"] = "✅ 설치 완료 ($ver)"
    } else {
        Write-Status "Node.js 설치 후 확인 실패. 재부팅 후 다시 시도하세요." -Type Error
        $script:Results["Node.js"] = "❌ 설치 실패 (PATH 미반영 — 재부팅 필요)"
    }
}

# =============================================================================
# Step 4: WezTerm (선택)
# =============================================================================

function Install-WezTerm {
    Show-Step "WezTerm 설치 확인 (선택)"

    $weztermExe = Find-WezTermExe

    if ($weztermExe) {
        Write-Status "WezTerm 이미 설치됨: $weztermExe" -Type Success
        $script:Results["WezTerm"] = "✅ 설치 완료"
        return
    }

    Write-Status "WezTerm이 없습니다." -Type Warning

    if ($script:TestMode) {
        Write-Status "[테스트 모드] 설치를 건너뜁니다." -Type Info
        $script:Results["WezTerm"] = "⚠️ 미설치 (테스트 모드)"
        return
    }

    Write-Status "설치를 시작합니다..." -Type Progress

    # --- 방법 1: winget ---
    $installed = $false
    if (Test-CommandExists "winget") {
        Write-Status "winget으로 WezTerm 설치 시도..." -Type Progress
        try {
            $proc = Start-Process -FilePath "winget" `
                -ArgumentList "install","wez.wezterm","--accept-source-agreements","--accept-package-agreements","--silent" `
                -Wait -PassThru -NoNewWindow -ErrorAction SilentlyContinue
            if ($proc.ExitCode -eq 0) { $installed = $true }
        } catch {
            Write-Status "winget 설치 실패: $_" -Type Warning
        }
    }

    # --- 방법 2: GitHub Releases ---
    if (-not $installed) {
        Write-Status "GitHub에서 직접 다운로드합니다..." -Type Warning
        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            $releasesApi = "https://api.github.com/repos/wez/wezterm/releases/latest"
            $release = Invoke-RestMethod -Uri $releasesApi -UseBasicParsing -ErrorAction Stop
            $asset = $release.assets | Where-Object { $_.name -match "WezTerm-windows-.*\.exe$" -and $_.name -notmatch "nightly" } | Select-Object -First 1
            if (-not $asset) {
                $asset = $release.assets | Where-Object { $_.name -match "\.msi$" } | Select-Object -First 1
            }
            if (-not $asset) { throw "WezTerm 설치파일을 찾을 수 없습니다." }

            $installerPath = Get-TempFilePath $asset.name
            Write-Status "다운로드 중: $($asset.browser_download_url)" -Type Progress
            Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $installerPath -UseBasicParsing

            if ($asset.name -match "\.msi$") {
                $proc = Start-Process -FilePath "msiexec.exe" `
                    -ArgumentList "/i","`"$installerPath`"","/qn","/norestart" `
                    -Wait -PassThru -Verb RunAs -ErrorAction Stop
            } else {
                $proc = Start-Process -FilePath $installerPath -ArgumentList "/S" `
                    -Wait -PassThru -Verb RunAs -ErrorAction Stop
            }
            Remove-Item $installerPath -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Status "WezTerm 직접 설치도 실패했습니다: $_" -Type Error
            $script:Results["WezTerm"] = "❌ 설치 실패 (Git Bash로 대체 가능)"
            return
        }
    }

    Update-PathEnvironment
    Start-Sleep -Seconds 2

    $weztermExe = Find-WezTermExe
    if ($weztermExe -or (Test-CommandExists "wezterm")) {
        Write-Status "WezTerm 설치 완료" -Type Success
        $script:Results["WezTerm"] = "✅ 설치 완료"
    } else {
        Write-Status "WezTerm 설치 후 확인 실패." -Type Error
        $script:Results["WezTerm"] = "❌ 설치 실패"
    }
}

# =============================================================================
# Step 5: 작업 폴더 생성
# =============================================================================

function New-WorkspaceFolder {
    Show-Step "작업 폴더 생성"

    if (Test-Path $script:WorkspaceDir) {
        Write-Status "작업 폴더 이미 존재: $($script:WorkspaceDir)" -Type Success
        $script:Results["작업 폴더"] = "✅ 이미 존재"
        return
    }

    try {
        New-Item -ItemType Directory -Path $script:WorkspaceDir -Force | Out-Null
        Write-Status "작업 폴더 생성 완료: $($script:WorkspaceDir)" -Type Success
        $script:Results["작업 폴더"] = "✅ 생성 완료"
    } catch {
        Write-Status "작업 폴더 생성 실패: $_" -Type Error
        $script:Results["작업 폴더"] = "❌ 생성 실패"
    }
}

# =============================================================================
# Step 6: PATH 환경변수 영구 설정
# =============================================================================

function Set-PermanentPath {
    Show-Step "PATH 환경변수 확인 및 설정"

    $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
    if (-not $userPath) { $userPath = "" }
    $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")

    Write-Status "현재 User PATH 항목 수: $(($userPath -split ';' | Where-Object { $_ }).Count)" -Type Info

    $pathsToAdd = @()

    # 1) Claude Code 네이티브 경로 (~\.local\bin)
    $claudeLocalBin = Join-Path $env:USERPROFILE ".local\bin"
    if (Test-Path $claudeLocalBin) {
        if (($userPath -notlike "*$claudeLocalBin*") -and ($machinePath -notlike "*$claudeLocalBin*")) {
            $pathsToAdd += $claudeLocalBin
            Write-Status "Claude Code 네이티브 경로 추가 필요: $claudeLocalBin" -Type Warning
        } else {
            Write-Status "Claude Code 네이티브 경로 OK: $claudeLocalBin" -Type Success
        }
    }

    # 2) Git
    $gitCmdPath = "C:\Program Files\Git\cmd"
    if (Test-Path $gitCmdPath) {
        if (($userPath -notlike "*$gitCmdPath*") -and ($machinePath -notlike "*$gitCmdPath*")) {
            $pathsToAdd += $gitCmdPath
            Write-Status "Git 경로 추가 필요: $gitCmdPath" -Type Warning
        } else {
            Write-Status "Git 경로 OK: $gitCmdPath" -Type Success
        }
    }

    # 3) Node.js
    if (Test-CommandExists "node") {
        $nodePath = Split-Path (Get-Command "node" -ErrorAction SilentlyContinue).Source
        if ($nodePath -and ($userPath -notlike "*$nodePath*") -and ($machinePath -notlike "*$nodePath*")) {
            $pathsToAdd += $nodePath
            Write-Status "Node.js 경로 추가 필요: $nodePath" -Type Warning
        } else {
            Write-Status "Node.js 경로 OK" -Type Success
        }
    }

    # 4) npm global bin
    if (Test-CommandExists "npm") {
        try {
            $npmPrefix = (& npm.cmd config get prefix 2>$null) | Select-Object -First 1
            if ($npmPrefix -and (Test-Path $npmPrefix -ErrorAction SilentlyContinue)) {
                if (($userPath -notlike "*$npmPrefix*") -and ($machinePath -notlike "*$npmPrefix*")) {
                    $pathsToAdd += $npmPrefix
                    Write-Status "npm global 경로 추가 필요: $npmPrefix" -Type Warning
                } else {
                    Write-Status "npm global 경로 OK: $npmPrefix" -Type Success
                }
            }
        } catch {
            Write-Status "npm global 경로 확인 실패 (무시)" -Type Info
        }
    }

    # 5) WezTerm
    $weztermFound = Find-WezTermExe
    if ($weztermFound) {
        $weztermDir = Split-Path $weztermFound
        if (($userPath -notlike "*$weztermDir*") -and ($machinePath -notlike "*$weztermDir*")) {
            $pathsToAdd += $weztermDir
            Write-Status "WezTerm 경로 추가 필요: $weztermDir" -Type Warning
        } else {
            Write-Status "WezTerm 경로 OK: $weztermDir" -Type Success
        }
    }

    if ($pathsToAdd.Count -eq 0) {
        Write-Status "모든 PATH가 정상입니다." -Type Success
        $script:Results["환경변수"] = "✅ 이미 정상"
        return
    }

    if ($script:TestMode) {
        Write-Status "[테스트 모드] 아래 경로를 User PATH에 추가해야 합니다:" -Type Info
        foreach ($p in $pathsToAdd) {
            Write-Status "[테스트 모드]   → $p" -Type Info
        }
        $script:Results["환경변수"] = "⚠️ $($pathsToAdd.Count)개 추가 필요 (테스트 모드)"
        return
    }

    Write-Status "$($pathsToAdd.Count)개 경로를 User PATH에 추가합니다..." -Type Progress
    $newUserPath = $userPath
    foreach ($p in $pathsToAdd) {
        $newUserPath = "$newUserPath;$p"
        Write-Status "  추가: $p" -Type Info
    }
    $newUserPath = ($newUserPath -split ";" | Where-Object { $_ }) -join ";"

    try {
        [System.Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
        Update-PathEnvironment
        Write-Status "User PATH 영구 설정 완료" -Type Success

        Write-Log "--- 설정된 User PATH ---"
        $newUserPath -split ";" | ForEach-Object { Write-Log "  $_" }
        Write-Log "--- END ---"

        $script:Results["환경변수"] = "✅ $($pathsToAdd.Count)개 경로 추가 완료"
    } catch {
        Write-Status "PATH 설정 실패: $_" -Type Error
        $script:Results["환경변수"] = "❌ 설정 실패"
    }
}

# =============================================================================
# Step 7: 검증 및 실행
# =============================================================================

function Start-Verification {
    Show-Step "검증 및 환경 실행"

    # --- claude doctor 검증 ---
    if ((Test-CommandExists "claude") -and (-not $script:TestMode)) {
        Write-Status "claude doctor 실행 중 (최대 15초)..." -Type Progress
        try {
            $job = Start-Job -ScriptBlock { & claude doctor 2>&1 }
            $completed = Wait-Job $job -Timeout 15
            if ($completed) {
                $doctorOutput = Receive-Job $job | Out-String
                Write-Log "--- claude doctor ---"
                Write-Log $doctorOutput
                Write-Log "--- END ---"
                Write-Status "claude doctor 완료 (상세 내용은 로그 참조)" -Type Success
            } else {
                Stop-Job $job
                Write-Status "claude doctor 타임아웃 (15초 초과) — 건너뜁니다" -Type Warning
            }
            Remove-Job $job -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Status "claude doctor 실행 실패: $_" -Type Warning
        }
    } elseif (Test-CommandExists "claude") {
        Write-Status "[테스트 모드] claude --version: $(& claude --version 2>$null)" -Type Info
    }

    if ($script:TestMode) {
        Write-Status "[테스트 모드] 실행을 건너뜁니다." -Type Info
        $foundWez = Find-WezTermExe
        Write-Status "[테스트 모드] WezTerm: $(if ($foundWez) { $foundWez } else { '감지 실패' })" -Type Info

        $gitBashCheck = @("C:\Program Files\Git\git-bash.exe", "C:\Program Files (x86)\Git\git-bash.exe")
        $gbFound = $gitBashCheck | Where-Object { Test-Path $_ } | Select-Object -First 1
        Write-Status "[테스트 모드] Git Bash: $(if ($gbFound) { $gbFound } else { '감지 실패' })" -Type Info

        $script:Results["검증/실행"] = "⏭️ 건너뜀 (테스트 모드)"
        return
    }

    # --- 터미널 실행 ---
    $weztermExe = Find-WezTermExe

    $launched = $false

    if ($weztermExe) {
        Write-Status "WezTerm으로 Claude Code를 시작합니다..." -Type Progress
        try {
            Start-Process -FilePath $weztermExe `
                -ArgumentList "start","--cwd",$script:WorkspaceDir,"--","claude" `
                -ErrorAction Stop
            Write-Status "WezTerm 실행 완료." -Type Success
            $launched = $true
        } catch {
            Write-Status "WezTerm 실행 실패: $_" -Type Warning
        }
    }

    if (-not $launched) {
        $gitBashPaths = @(
            "C:\Program Files\Git\git-bash.exe",
            "C:\Program Files (x86)\Git\git-bash.exe"
        )
        $gitBash = $gitBashPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

        if ($gitBash) {
            Write-Status "Git Bash로 Claude Code를 시작합니다..." -Type Progress
            try {
                Start-Process -FilePath $gitBash `
                    -ArgumentList "--cd=$($script:WorkspaceDir)","-c","claude; exec bash" `
                    -ErrorAction Stop
                Write-Status "Git Bash 실행 완료." -Type Success
                $launched = $true
            } catch {
                Write-Status "Git Bash 실행 실패: $_" -Type Warning
            }
        }
    }

    if (-not $launched) {
        Write-Status "터미널을 자동 실행하지 못했습니다." -Type Warning
        Write-Status "아래 명령어를 직접 실행해 주세요:" -Type Info
        Write-Host ""
        Write-Host "    cd $($script:WorkspaceDir)" -ForegroundColor Yellow
        Write-Host "    claude" -ForegroundColor Yellow
        Write-Host ""
        $script:Results["검증/실행"] = "⚠️ 수동 실행 필요"
        return
    }

    $script:Results["검증/실행"] = "✅ 실행 완료"
}

# =============================================================================
# 결과 요약
# =============================================================================

function Show-Summary {
    Write-Host ""
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║                    설치 결과 요약                       ║" -ForegroundColor Cyan
    Write-Host "  ╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    $failCount = 0
    foreach ($key in @("Git", "Claude Code", "Node.js", "WezTerm", "작업 폴더", "환경변수", "검증/실행")) {
        $status = $script:Results[$key]
        if (-not $status) { $status = "⏭️  건너뜀" }

        $color = if ($status -match "✅") { "Green" }
                 elseif ($status -match "❌") { "Red"; $failCount++ }
                 elseif ($status -match "⚠️") { "Yellow" }
                 else { "Gray" }

        $paddedKey = $key.PadRight(16)
        Write-Host "    $paddedKey $status" -ForegroundColor $color
    }

    Write-Host ""
    Write-Host "  ─────────────────────────────────────────────────────────" -ForegroundColor DarkGray

    if ($failCount -eq 0) {
        Write-Host ""
        Write-Host "  모든 설정이 완료되었습니다!" -ForegroundColor Green
        Write-Host "  작업 폴더: $($script:WorkspaceDir)" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "  ⚠️  $failCount 개 항목이 실패했습니다." -ForegroundColor Yellow
        Write-Host "  실패한 항목은 수동으로 설치해 주세요." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  도움이 필요하면 managerkim.com을 방문하세요." -ForegroundColor Gray
        Write-Host ""
    }

    Write-Host "  Happy coding!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  전체 로그: $($script:LogFile)" -ForegroundColor DarkGray
    Write-Host ""

    Write-Log ""
    Write-Log "========== 최종 결과 =========="
    foreach ($key in @("Git", "Claude Code", "Node.js", "WezTerm", "작업 폴더", "환경변수", "검증/실행")) {
        $status = $script:Results[$key]
        if (-not $status) { $status = "건너뜀" }
        Write-Log "  $key : $status"
    }
    Write-Log "로그 종료: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

# =============================================================================
# 메인 실행
# =============================================================================

function Main {
    "=" * 60 | Out-File -FilePath $script:LogFile -Encoding UTF8
    Write-SystemInfo

    Show-Header

    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
        [Security.Principal.WindowsBuiltInRole]::Administrator
    )
    if (-not $isAdmin) {
        Write-Host "  ⚠️  관리자 권한 없이 실행 중입니다." -ForegroundColor Yellow
        Write-Host "  일부 설치에서 권한 상승 창(UAC)이 뜰 수 있습니다." -ForegroundColor Yellow
        Write-Host ""
    }

    Show-EnvironmentScan
    if ($script:Cancelled) { return }

    Install-Git           # 1. Git (필수)
    Install-ClaudeCode    # 2. Claude Code (네이티브 우선)
    Install-NodeJS        # 3. Node.js (선택)
    Install-WezTerm       # 4. WezTerm (선택)
    New-WorkspaceFolder   # 5. 작업 폴더
    Set-PermanentPath     # 6. 환경변수
    Start-Verification    # 7. 검증 + 실행
    Show-Summary
}

# --- 실행 ---
Main
