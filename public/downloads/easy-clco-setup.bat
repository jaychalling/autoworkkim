@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo   Easy ClCo - Requesting admin privileges...
    echo.
    powershell.exe -NoProfile -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
echo.
echo   Easy ClCo - Launching installer...
echo.
start "" /wait powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; $OutputEncoding=[System.Text.Encoding]::UTF8; chcp 65001|Out-Null; irm 'https://managerkim.com/downloads/install-windows.ps1' | iex; Write-Host ''; Read-Host '  Enter to close'"
