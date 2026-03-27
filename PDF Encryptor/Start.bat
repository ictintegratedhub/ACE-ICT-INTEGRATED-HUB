@echo off
title PDF Encryptor - Auto Installer
echo.
echo ================================================
echo    PDF Encryptor - Starting...
echo ================================================
echo.

cd /d C:\pdf-encryptor

echo Checking and installing required packages...
python -m pip install -r requirement.txt --upgrade --quiet

echo.
echo ✅ Packages are ready!
echo.
echo 🌐 Opening browser at http://127.0.0.1:8000
start "" http://127.0.0.1:8000

echo.
echo 🚀 Starting PDF Encryptor...
echo (Press Ctrl + C in this window to stop)
echo.

python mainn.py

echo.
echo PDF Encryptor has stopped.
pause