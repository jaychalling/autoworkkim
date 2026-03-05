@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo   Easy ClCo - Requesting admin privileges...
    echo.
    powershell.exe -NoProfile -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
chcp 65001 > nul
echo.
echo   ==========================================
echo    Easy ClCo - Claude Code Auto Setup
echo   ==========================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; $OutputEncoding=[System.Text.Encoding]::UTF8; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $wc=New-Object Net.WebClient; $wc.Encoding=[System.Text.Encoding]::UTF8; iex ($wc.DownloadString('https://managerkim.com/downloads/install-windows.ps1'))"
echo.
pause
