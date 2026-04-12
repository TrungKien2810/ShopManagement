@echo off
setlocal
cd /d "%~dp0\..\tools\openclaw-engine"
echo [ZôOS] Starting OpenClaw Agent Interface...
echo Loading Claude workflow enforcement and skills...
node openclaw.mjs agent %*
pause
