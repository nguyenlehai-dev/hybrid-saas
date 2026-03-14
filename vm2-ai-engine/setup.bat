@echo off
REM ============================================================
REM VM2 AI Engine - Windows Setup Script
REM Chay tren Windows Command Prompt (Admin)
REM ============================================================

echo ============================================================
echo  VM2 AI Engine - Setup Script
echo  Yeu cau: Docker Desktop + NVIDIA GPU Driver
echo ============================================================
echo.

REM 1. Create data directories
echo [1/4] Tao thu muc data...
mkdir data\models\Stable-diffusion 2>nul
mkdir data\models\Lora 2>nul
mkdir data\models\ControlNet 2>nul
mkdir data\models\VAE 2>nul
mkdir data\models\ESRGAN 2>nul
mkdir data\outputs\txt2img 2>nul
mkdir data\outputs\img2img 2>nul
mkdir data\outputs\extras 2>nul
mkdir data\extensions 2>nul
echo    Done!

REM 2. Copy .env
echo [2/4] Tao file .env...
if not exist .env (
    copy .env.example .env
    echo    Created .env from .env.example
    echo    !!! HAY EDIT FILE .env TRUOC KHI CHAY !!!
) else (
    echo    .env da ton tai, skip.
)

REM 3. Check Docker
echo [3/4] Kiem tra Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ERROR: Docker chua duoc cai dat!
    echo    Tai Docker Desktop tai: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo    Docker OK!

REM 4. Check NVIDIA
echo [4/4] Kiem tra NVIDIA GPU...
nvidia-smi >nul 2>&1
if %errorlevel% neq 0 (
    echo    WARNING: nvidia-smi khong chay duoc
    echo    Dam bao da cai NVIDIA Driver moi nhat
) else (
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
    echo    GPU OK!
)

echo.
echo ============================================================
echo  Setup hoan tat! Cac buoc tiep theo:
echo.
echo  1. Tai model SD vao data\models\Stable-diffusion\
echo     - SD 1.5: https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5
echo     - SDXL:   https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
echo.
echo  2. Edit file .env (doi SD_API_PASSWORD)
echo.
echo  3. Build va chay:
echo     docker compose up -d --build
echo.
echo  4. Doi 5-10 phut roi test:
echo     curl http://localhost:7860/sdapi/v1/sd-models
echo ============================================================
pause
