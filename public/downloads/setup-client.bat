@echo off
chcp 65001 >nul 2>&1
title managerkim-setup
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-client.ps1" %*
pause
