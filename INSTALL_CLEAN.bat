@echo off
setlocal
cd /d "%~dp0"
echo Membersihkan instalasi lama...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist .vite rmdir /s /q .vite
echo Menginstal dependency bersih...
call npm ci
if errorlevel 1 (
  echo.
  echo Instalasi gagal. Pastikan Node.js versi 20.19 atau lebih baru terpasang.
  pause
  exit /b 1
)
echo.
echo Instalasi selesai. Menjalankan game...
call npm run dev
