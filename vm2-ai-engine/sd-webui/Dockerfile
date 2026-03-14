FROM nvidia/cuda:12.1.1-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    git python3 python3-pip python3-venv python3-dev \
    wget curl libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Use Forge - better fork, bundles dependencies, fewer clone issues
WORKDIR /
RUN git clone https://github.com/lllyasviel/stable-diffusion-webui-forge.git /stable-diffusion-webui

WORKDIR /stable-diffusion-webui

RUN python3 -m venv venv
RUN . venv/bin/activate && pip install --upgrade pip setuptools wheel packaging
RUN . venv/bin/activate && pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
RUN . venv/bin/activate && pip install xformers

# Pre-install CLIP to avoid pkg_resources error
RUN . venv/bin/activate && pip install ftfy regex tqdm open-clip-torch
RUN . venv/bin/activate && pip install --no-build-isolation git+https://github.com/openai/CLIP.git

# Pre-clone required repos to avoid DNS issues at runtime
RUN git clone https://github.com/crowsonkb/k-diffusion.git repositories/k-diffusion || true
RUN git clone https://github.com/salesforce/BLIP.git repositories/BLIP || true

RUN mkdir -p outputs/txt2img outputs/img2img outputs/extras models/Stable-diffusion

EXPOSE 7860

ENTRYPOINT ["/bin/bash", "-c"]
CMD [". venv/bin/activate && python3 launch.py --skip-torch-cuda-test ${CLI_ARGS}"]
