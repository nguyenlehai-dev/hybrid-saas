#!/bin/bash
# ============================================
# Script cài đặt models AI cho VM2
# Chạy trên VM2 (192.168.100.107) 
# ============================================

MODEL_DIR="/stable-diffusion-webui/models/Stable-diffusion"
LORA_DIR="/stable-diffusion-webui/models/Lora"
VAE_DIR="/stable-diffusion-webui/models/VAE"

echo "🎨 Đang cài đặt AI Models cho Stable Diffusion WebUI..."
echo "=================================================="

# --- ANIME MODELS ---
echo ""
echo "📦 1/3 - Download Anime Models..."

# mixProV3 - Anime model phổ biến
if [ ! -f "$MODEL_DIR/mixProV3_v3.safetensors" ]; then
  echo "  → Downloading mixProV3_v3..."
  wget -q --show-progress -O "$MODEL_DIR/mixProV3_v3.safetensors" \
    "https://civitai.com/api/download/models/119057" 2>&1
else
  echo "  ✅ mixProV3_v3 đã có"
fi

# Anything V5 - Model anime nổi tiếng
if [ ! -f "$MODEL_DIR/anythingV5_v5.safetensors" ]; then
  echo "  → Downloading Anything V5..."
  wget -q --show-progress -O "$MODEL_DIR/anythingV5_v5.safetensors" \
    "https://civitai.com/api/download/models/90854" 2>&1  
else
  echo "  ✅ Anything V5 đã có"
fi

# --- VAE ---
echo ""
echo "📦 2/3 - Download VAE..."

if [ ! -f "$VAE_DIR/vae-ft-mse-840000-ema-pruned.safetensors" ]; then
  echo "  → Downloading VAE..."
  mkdir -p "$VAE_DIR"
  wget -q --show-progress -O "$VAE_DIR/vae-ft-mse-840000-ema-pruned.safetensors" \
    "https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors" 2>&1
else
  echo "  ✅ VAE đã có"
fi

# --- UPSCALER ---
echo ""
echo "📦 3/3 - Download Upscaler models..."

ESRGAN_DIR="/stable-diffusion-webui/models/ESRGAN"
if [ ! -f "$ESRGAN_DIR/4x-AnimeSharp.pth" ]; then
  echo "  → Downloading 4x-AnimeSharp upscaler..."
  mkdir -p "$ESRGAN_DIR"
  wget -q --show-progress -O "$ESRGAN_DIR/4x-AnimeSharp.pth" \
    "https://huggingface.co/Kim2091/AnimeSharp/resolve/main/4x-AnimeSharp.pth" 2>&1
else
  echo "  ✅ 4x-AnimeSharp đã có"
fi

echo ""
echo "=================================================="
echo "✅ Hoàn tất! Restart SD WebUI để nhận model mới."
echo ""
echo "Chạy: sudo systemctl restart stable-diffusion"
echo "Hoặc vào SD WebUI → Settings → Reload model list"
echo ""

# List models
echo "📋 Danh sách models:"
ls -lh "$MODEL_DIR"/*.safetensors 2>/dev/null
