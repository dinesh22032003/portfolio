@echo off
setlocal enabledelayedexpansion
echo ===================================================
echo   Dinesh Rajkumar Portfolio - GitHub Push Tool
echo ===================================================

:: Check if git is available in standard PATH
where git >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "GIT_CMD=git"
    goto :RUN_GIT
)

:: Check common Git installation paths on Windows
if exist "C:\Program Files\Git\cmd\git.exe" (
    set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    goto :RUN_GIT
)
if exist "C:\Program Files (x86)\Git\cmd\git.exe" (
    set "GIT_CMD=C:\Program Files (x86)\Git\cmd\git.exe"
    goto :RUN_GIT
)
if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
    set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    goto :RUN_GIT
)

:: If Git is not found at all
echo [!] Git was not detected on your system.
echo.
echo Installing Git automatically via winget...
winget install --id Git.Git -e --source winget
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Please download Git from https://git-scm.com/download/win
    echo Or upload files directly to https://github.com/dinesh22032003/portfolio
    pause
    exit /b 1
)

if exist "C:\Program Files\Git\cmd\git.exe" (
    set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
) else (
    set "GIT_CMD=git"
)

:RUN_GIT
echo [*] Using Git at: "!GIT_CMD!"
echo [*] Initializing repository and preparing files...
"!GIT_CMD!" init
"!GIT_CMD!" branch -M main
"!GIT_CMD!" add .
"!GIT_CMD!" commit -m "feat: initial release of Dinesh Rajkumar 3D developer portfolio"
"!GIT_CMD!" remote remove origin >nul 2>&1
"!GIT_CMD!" remote add origin https://github.com/dinesh22032003/portfolio.git

echo [*] Pushing files to https://github.com/dinesh22032003/portfolio.git ...
"!GIT_CMD!" push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [*] Note: If your remote repository already has existing files, trying force push:
    "!GIT_CMD!" push -u origin main --force
)

echo.
echo ===================================================
echo [SUCCESS] Your portfolio has been pushed to GitHub!
echo Repository: https://github.com/dinesh22032003/portfolio
echo Next: Deploy on https://vercel.com/new
echo ===================================================
pause
