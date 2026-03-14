# ============================================================
# VM2 AI Engine - ONE CLICK SETUP
# Double-click file nay tren VM2 Windows de tu dong cai dat
# Yeu cau: Docker Desktop da cai va dang chay
# ============================================================

$ErrorActionPreference = "Continue"
$VM2_DIR = "D:\vm2-ai-engine"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  VM2 AI ENGINE - AUTO SETUP" -ForegroundColor Cyan
Write-Host "  Stable Diffusion + RTX 3060" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Check Docker ──
Write-Host "[1/7] Checking Docker Desktop..." -ForegroundColor Yellow
$dockerOk = $false
try {
    $dv = docker --version 2>$null
    if ($dv) {
        Write-Host "  OK: $dv" -ForegroundColor Green
        $dockerOk = $true
    }
} catch {}
if (-not $dockerOk) {
    Write-Host "  ERROR: Docker not found! Install Docker Desktop first." -ForegroundColor Red
    Write-Host "  https://www.docker.com/products/docker-desktop/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# ── Step 2: Check GPU ──
Write-Host "[2/7] Checking NVIDIA GPU..." -ForegroundColor Yellow
try {
    $gpuInfo = nvidia-smi --query-gpu=name,memory.total --format=csv,noheader 2>$null
    if ($gpuInfo) {
        Write-Host "  OK: $gpuInfo" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: nvidia-smi failed. Install latest NVIDIA driver." -ForegroundColor Red
    }
} catch {
    Write-Host "  WARNING: nvidia-smi not found." -ForegroundColor Red
}

# Test GPU in Docker
Write-Host "  Testing GPU in Docker..." -ForegroundColor Yellow
try {
    $gpuDocker = docker run --rm --gpus all nvidia/cuda:12.1.1-base-ubuntu22.04 nvidia-smi --query-gpu=name --format=csv,noheader 2>$null
    if ($gpuDocker) {
        Write-Host "  OK: Docker GPU = $gpuDocker" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: Docker cannot access GPU. Enable WSL2 backend in Docker Desktop." -ForegroundColor Red
    }
} catch {
    Write-Host "  WARNING: Docker GPU test failed." -ForegroundColor Red
}

# ── Step 3: Create directories ──
Write-Host "[3/7] Creating directories..." -ForegroundColor Yellow
$dirs = @(
    "$VM2_DIR",
    "$VM2_DIR\data\models\Stable-diffusion",
    "$VM2_DIR\data\models\Lora",
    "$VM2_DIR\data\models\ControlNet",
    "$VM2_DIR\data\models\VAE",
    "$VM2_DIR\data\models\ESRGAN",
    "$VM2_DIR\data\outputs",
    "$VM2_DIR\data\extensions",
    "$VM2_DIR\sd-webui",
    "$VM2_DIR\task-api"
)
foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path $d | Out-Null
}
Write-Host "  OK: Directories created at $VM2_DIR" -ForegroundColor Green

# ── Step 4: Create Dockerfile ──
Write-Host "[4/7] Creating Docker files..." -ForegroundColor Yellow

$dockerfile = @'
FROM nvidia/cuda:12.1.1-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    git python3 python3-pip python3-venv \
    wget curl libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /
RUN git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git

WORKDIR /stable-diffusion-webui

RUN python3 -m venv venv
RUN . venv/bin/activate && pip install --upgrade pip setuptools wheel
RUN . venv/bin/activate && pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
RUN . venv/bin/activate && pip install xformers

RUN . venv/bin/activate && python3 launch.py --skip-torch-cuda-test --exit

RUN mkdir -p outputs/txt2img outputs/img2img outputs/extras

EXPOSE 7860

ENTRYPOINT ["/bin/bash", "-c"]
CMD [". venv/bin/activate && python3 launch.py --skip-torch-cuda-test ${CLI_ARGS}"]
'@
Set-Content -Path "$VM2_DIR\sd-webui\Dockerfile" -Value $dockerfile -Encoding UTF8

# docker-compose.yml
$compose = @'
version: "3.9"

services:
  stable-diffusion:
    build:
      context: ./sd-webui
      dockerfile: Dockerfile
    container_name: ai-stable-diffusion
    restart: unless-stopped
    ports:
      - "7860:7860"
    volumes:
      - ./data/models:/stable-diffusion-webui/models
      - ./data/outputs:/stable-diffusion-webui/outputs
      - ./data/extensions:/stable-diffusion-webui/extensions
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - CLI_ARGS=--api --listen --no-half-vae --xformers --enable-insecure-extension-access
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - ai-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7860/sdapi/v1/sd-models"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 180s

  task-api:
    image: node:20-alpine
    container_name: ai-task-api
    restart: unless-stopped
    ports:
      - "7862:3000"
    working_dir: /app
    volumes:
      - ./task-api:/app
      - ./data/outputs:/outputs:ro
    command: node server.js
    networks:
      - ai-network

networks:
  ai-network:
    driver: bridge
'@
Set-Content -Path "$VM2_DIR\docker-compose.yml" -Value $compose -Encoding UTF8

# task-api/server.js
$taskApi = @'
const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 3000;
const OUTPUTS_DIR = "/outputs";
const tasks = new Map();

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "healthy", service: "vm2-task-api" }));
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/task/register") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        tasks.set(data.task_id, { id: data.task_id, status: "queued", created_at: new Date().toISOString(), output_image_url: null });
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, task_id: data.task_id }));
      } catch(e) { res.writeHead(400); res.end(JSON.stringify({error:"Invalid JSON"})); }
    });
    return;
  }
  if (req.method === "POST" && url.pathname.startsWith("/api/task/update/")) {
    const taskId = url.pathname.split("/").pop();
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const task = tasks.get(taskId);
        if (task) { Object.assign(task, data, { updated_at: new Date().toISOString() }); }
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
      } catch(e) { res.writeHead(400); res.end(JSON.stringify({error:"Invalid JSON"})); }
    });
    return;
  }
  if (req.method === "GET" && url.pathname.startsWith("/api/task-status/")) {
    const task = tasks.get(url.pathname.split("/").pop());
    if (task) { res.writeHead(200); res.end(JSON.stringify(task)); }
    else { res.writeHead(404); res.end(JSON.stringify({error:"Not found"})); }
    return;
  }
  if (req.method === "GET" && url.pathname.startsWith("/outputs/")) {
    const filePath = path.join(OUTPUTS_DIR, url.pathname.replace("/outputs/", ""));
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = { ".png":"image/png", ".jpg":"image/jpeg", ".webp":"image/webp" };
      res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
      fs.createReadStream(filePath).pipe(res);
    } else { res.writeHead(404); res.end(JSON.stringify({error:"File not found"})); }
    return;
  }
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[VM2 Task API] Running on port ${PORT}`);
});
'@
Set-Content -Path "$VM2_DIR\task-api\server.js" -Value $taskApi -Encoding UTF8
Write-Host "  OK: All Docker files created" -ForegroundColor Green

# ── Step 5: Download SD Model ──
Write-Host "[5/7] Downloading Stable Diffusion v1.5 model (~4GB)..." -ForegroundColor Yellow
$modelPath = "$VM2_DIR\data\models\Stable-diffusion\v1-5-pruned-emaonly.safetensors"
if (Test-Path $modelPath) {
    Write-Host "  SKIP: Model already exists" -ForegroundColor Green
} else {
    Write-Host "  Downloading from HuggingFace (this takes 5-20 minutes)..." -ForegroundColor Yellow
    try {
        # Use curl for progress bar
        & curl -L -o $modelPath "https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors" --progress-bar
        if (Test-Path $modelPath) {
            $size = (Get-Item $modelPath).Length / 1GB
            Write-Host "  OK: Model downloaded ($([math]::Round($size,2)) GB)" -ForegroundColor Green
        } else {
            Write-Host "  WARNING: Download may have failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ERROR: Download failed. You can download manually:" -ForegroundColor Red
        Write-Host "  https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5" -ForegroundColor Red
    }
}

# ── Step 6: Build & Start Docker ──
Write-Host "[6/7] Building Docker image (first time takes 15-30 min)..." -ForegroundColor Yellow
Set-Location $VM2_DIR
docker compose build
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK: Docker image built" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Docker build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "  Starting containers..." -ForegroundColor Yellow
docker compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK: Containers started!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Container start failed!" -ForegroundColor Red
}

# ── Step 7: Show IP & Done ──
Write-Host "[7/7] Getting network info..." -ForegroundColor Yellow
$ipInfo = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "172.*" } | Select-Object -First 1
$vm2IP = $ipInfo.IPAddress

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETE!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  VM2 IP Address: $vm2IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Services:" -ForegroundColor White
Write-Host "    SD WebUI API  : http://${vm2IP}:7860" -ForegroundColor White
Write-Host "    SD WebUI GUI  : http://${vm2IP}:7860 (browser)" -ForegroundColor White
Write-Host "    Task API      : http://${vm2IP}:7862" -ForegroundColor White
Write-Host ""
Write-Host "  NEXT STEP - Run this on VM1 (Ubuntu):" -ForegroundColor Yellow
Write-Host "  sudo bash /home/vpsroot/.gemini/antigravity/scratch/hybrid-saas/scripts/connect-vm2.sh $vm2IP" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Wait 3-5 minutes for SD WebUI to fully start, then test:" -ForegroundColor Yellow
Write-Host "  curl http://${vm2IP}:7860/sdapi/v1/sd-models" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green

# Keep window open
Read-Host "Press Enter to close"
