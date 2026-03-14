# ============================================================
# VM2 - Install Stable Diffusion WebUI NATIVE on Windows
# Khong can Docker! Chay truc tiep tren Windows + GPU
# ============================================================

$ErrorActionPreference = "Continue"
$SD_DIR = "D:\stable-diffusion-webui"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  SD WebUI - Native Windows Install" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# ── Step 1: Check Python ──
Write-Host "`n[1/5] Checking Python..." -ForegroundColor Yellow
$pyVer = python --version 2>&1
if ($pyVer -match "Python 3\.1[0-1]") {
    Write-Host "  OK: $pyVer" -ForegroundColor Green
} else {
    Write-Host "  Python 3.10 not found. Installing..." -ForegroundColor Yellow
    # Download Python 3.10
    $pyUrl = "https://www.python.org/ftp/python/3.10.11/python-3.10.11-amd64.exe"
    Invoke-WebRequest -Uri $pyUrl -OutFile "$env:TEMP\python-install.exe"
    Start-Process -FilePath "$env:TEMP\python-install.exe" -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1" -Wait
    Write-Host "  OK: Python installed. RESTART PowerShell after this script!" -ForegroundColor Green
}

# ── Step 2: Check Git ──
Write-Host "`n[2/5] Checking Git..." -ForegroundColor Yellow
$gitVer = git --version 2>&1
if ($gitVer -match "git version") {
    Write-Host "  OK: $gitVer" -ForegroundColor Green
} else {
    Write-Host "  Git not found. Installing..." -ForegroundColor Yellow
    $gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.2/Git-2.47.1.2-64-bit.exe"
    Invoke-WebRequest -Uri $gitUrl -OutFile "$env:TEMP\git-install.exe"
    Start-Process -FilePath "$env:TEMP\git-install.exe" -ArgumentList "/SILENT" -Wait
    $env:PATH += ";C:\Program Files\Git\bin"
    Write-Host "  OK: Git installed" -ForegroundColor Green
}

# ── Step 3: Clone SD WebUI ──
Write-Host "`n[3/5] Cloning Stable Diffusion WebUI..." -ForegroundColor Yellow
if (Test-Path "$SD_DIR\webui.bat") {
    Write-Host "  SKIP: Already cloned at $SD_DIR" -ForegroundColor Green
} else {
    git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git $SD_DIR
    Write-Host "  OK: Cloned to $SD_DIR" -ForegroundColor Green
}

# ── Step 4: Create startup script with API mode ──
Write-Host "`n[4/5] Creating startup config..." -ForegroundColor Yellow

$webuiUser = @"
@echo off
set PYTHON=
set GIT=
set VENV_DIR=
set COMMANDLINE_ARGS=--api --listen --no-half-vae --xformers --enable-insecure-extension-access
call webui.bat
"@
Set-Content -Path "$SD_DIR\webui-user.bat" -Value $webuiUser -Encoding ASCII

# Create models directory
New-Item -ItemType Directory -Force -Path "$SD_DIR\models\Stable-diffusion" | Out-Null
Write-Host "  OK: webui-user.bat created with API mode" -ForegroundColor Green

# ── Step 5: Move model if downloaded ──
Write-Host "`n[5/5] Checking for model files..." -ForegroundColor Yellow
$modelSrc = "D:\vm2-ai-engine\data\models\Stable-diffusion\v1-5-pruned-emaonly.safetensors"
$modelDst = "$SD_DIR\models\Stable-diffusion\v1-5-pruned-emaonly.safetensors"
if (Test-Path $modelSrc) {
    Copy-Item $modelSrc $modelDst -Force
    Write-Host "  OK: Model copied!" -ForegroundColor Green
} elseif (Test-Path $modelDst) {
    Write-Host "  OK: Model already in place" -ForegroundColor Green
} else {
    Write-Host "  No model found. SD WebUI will download one on first start." -ForegroundColor Yellow
}

# ── Get IP ──
$ipInfo = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "172.*" } | Select-Object -First 1
$vm2IP = $ipInfo.IPAddress

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  INSTALL COMPLETE!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  VM2 IP: $vm2IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "  TO START SD WebUI:" -ForegroundColor Yellow
Write-Host "    cd $SD_DIR" -ForegroundColor White
Write-Host "    .\webui-user.bat" -ForegroundColor White
Write-Host ""
Write-Host "  First start takes 5-10 min (installs dependencies)" -ForegroundColor Yellow
Write-Host "  After that: http://${vm2IP}:7860" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ON VM1 (Ubuntu), run:" -ForegroundColor Yellow
Write-Host "  sudo bash /home/vpsroot/.gemini/antigravity/scratch/hybrid-saas/scripts/connect-vm2.sh $vm2IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green

Read-Host "Press Enter to close"
