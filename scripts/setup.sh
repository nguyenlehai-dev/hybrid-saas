#!/bin/bash
# ============================================================
# Hybrid SaaS - VM1 Control Hub Setup Script
# Ubuntu Server 22.04 LTS + aaPanel + PostgreSQL + Redis
# Domain: vpspanel.io.vn
# ============================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step()  { echo -e "${BLUE}[STEP]${NC} $1"; }

# ============================================================
# PRE-FLIGHT CHECKS
# ============================================================
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root: sudo bash setup.sh"
    exit 1
fi

if ! grep -q "Ubuntu 22.04" /etc/os-release 2>/dev/null; then
    log_warn "This script is designed for Ubuntu 22.04 LTS. Proceeding anyway..."
fi

DOMAIN="vpspanel.io.vn"
APP_USER="saasapp"
APP_DIR="/opt/hybrid-saas"
DB_NAME="hybrid_saas"
DB_USER="saas_admin"
DB_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
REDIS_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
JWT_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 48)

log_info "============================================="
log_info "  Hybrid SaaS - VM1 Control Hub Setup"
log_info "  Domain: ${DOMAIN}"
log_info "============================================="

# ============================================================
# STEP 1: System Update & Essential Packages
# ============================================================
log_step "1/8 - Updating system and installing essential packages..."

export DEBIAN_FRONTEND=noninteractive

apt update -y && apt upgrade -y

apt install -y \
    curl \
    wget \
    git \
    htop \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    net-tools \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    libpq-dev \
    supervisor

log_info "System packages installed successfully."

# ============================================================
# STEP 2: Create Application User
# ============================================================
log_step "2/8 - Creating application user..."

if ! id "$APP_USER" &>/dev/null; then
    useradd -m -s /bin/bash "$APP_USER"
    log_info "User '$APP_USER' created."
else
    log_info "User '$APP_USER' already exists."
fi

mkdir -p "$APP_DIR"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# ============================================================
# STEP 3: Install Docker & Docker Compose
# ============================================================
log_step "3/8 - Installing Docker..."

if ! command -v docker &>/dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update -y
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    usermod -aG docker "$APP_USER"
    systemctl enable docker
    systemctl start docker
    log_info "Docker installed successfully."
else
    log_info "Docker already installed."
fi

# ============================================================
# STEP 4: Install PostgreSQL 15
# ============================================================
log_step "4/8 - Installing PostgreSQL 15..."

if ! command -v psql &>/dev/null; then
    echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
    apt update -y
    apt install -y postgresql-15 postgresql-client-15
    systemctl enable postgresql
    systemctl start postgresql
    log_info "PostgreSQL 15 installed successfully."
else
    log_info "PostgreSQL already installed."
fi

# Create database and user
log_info "Setting up database..."
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};" 2>/dev/null || true

# Import schema
if [ -f "$(dirname "$0")/../database/init-db.sql" ]; then
    sudo -u postgres psql -d "$DB_NAME" -f "$(dirname "$0")/../database/init-db.sql"
    log_info "Database schema imported."
fi

# Import seed data
if [ -f "$(dirname "$0")/../database/seed-data.sql" ]; then
    sudo -u postgres psql -d "$DB_NAME" -f "$(dirname "$0")/../database/seed-data.sql"
    log_info "Seed data imported."
fi

# ============================================================
# STEP 5: Install Redis
# ============================================================
log_step "5/8 - Installing Redis..."

if ! command -v redis-server &>/dev/null; then
    apt install -y redis-server
    # Configure Redis password
    sed -i "s/# requirepass foobared/requirepass ${REDIS_PASS}/" /etc/redis/redis.conf
    # Bind to localhost only
    sed -i "s/^bind .*/bind 127.0.0.1 ::1/" /etc/redis/redis.conf
    systemctl enable redis-server
    systemctl restart redis-server
    log_info "Redis installed and configured."
else
    log_info "Redis already installed."
fi

# ============================================================
# STEP 6: Install aaPanel
# ============================================================
log_step "6/8 - Installing aaPanel..."

if ! command -v bt &>/dev/null; then
    log_info "Downloading and installing aaPanel..."
    wget -O install.sh http://www.aapanel.com/script/install-ubuntu_6.0_en.sh
    echo "y" | bash install.sh aapanel
    rm -f install.sh
    log_info "aaPanel installed. Check output above for login credentials."
else
    log_info "aaPanel already installed."
fi

# ============================================================
# STEP 7: Configure Firewall
# ============================================================
log_step "7/8 - Configuring Firewall (UFW)..."

ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# SSH
ufw allow 22/tcp comment 'SSH'
# HTTP & HTTPS
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
# aaPanel
ufw allow 8888/tcp comment 'aaPanel'
# API Gateway (internal, adjust as needed)
ufw allow 8000/tcp comment 'FastAPI'

ufw --force enable
log_info "Firewall configured."

# ============================================================
# STEP 8: Setup Application Directory & Environment
# ============================================================
log_step "8/8 - Setting up application directory..."

mkdir -p "$APP_DIR"/{api-gateway,nginx,logs,uploads,landing-pages}

# Create .env file
cat > "$APP_DIR/.env" <<EOF
# ============================================================
# Hybrid SaaS - Environment Configuration
# Generated on: $(date)
# ============================================================

# Domain
DOMAIN=${DOMAIN}
API_URL=https://api.${DOMAIN}
FRONTEND_URL=https://${DOMAIN}

# Database
DATABASE_URL=postgresql+asyncpg://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}

# Redis
REDIS_URL=redis://:${REDIS_PASS}@localhost:6379/0
REDIS_PASS=${REDIS_PASS}

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# VM2 AI Engine Connection
# ⚠️ Update this with the actual IP of your VM2 (Docker AI Engine)
AI_ENGINE_URL=http://192.168.1.100:7860
AI_ENGINE_TIMEOUT=120

# File Storage
UPLOAD_DIR=${APP_DIR}/uploads
LANDING_PAGES_DIR=${APP_DIR}/landing-pages
MAX_UPLOAD_SIZE_MB=50

# App Settings
APP_NAME=Hybrid SaaS AI Platform
APP_ENV=production
DEBUG=false
LOG_LEVEL=info
WORKERS=4
EOF

chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# ============================================================
# SETUP COMPLETE
# ============================================================
echo ""
log_info "============================================="
log_info "  ✅ VM1 Control Hub Setup Complete!"
log_info "============================================="
echo ""
log_info "📋 Credentials (SAVE THESE!):"
echo "  Database User:     ${DB_USER}"
echo "  Database Password: ${DB_PASS}"
echo "  Database Name:     ${DB_NAME}"
echo "  Redis Password:    ${REDIS_PASS}"
echo "  JWT Secret:        ${JWT_SECRET}"
echo ""
log_info "📁 App Directory: ${APP_DIR}"
log_info "📄 Env File:      ${APP_DIR}/.env"
echo ""
log_warn "⚠️  NEXT STEPS:"
echo "  1. Update AI_ENGINE_URL in ${APP_DIR}/.env with VM2's actual IP"
echo "  2. Copy API Gateway code to ${APP_DIR}/api-gateway/"
echo "  3. Copy Nginx configs to /etc/nginx/sites-available/"
echo "  4. Set up SSL with: certbot --nginx -d ${DOMAIN} -d api.${DOMAIN}"
echo "  5. Run: docker compose up -d"
echo ""
log_info "🔗 aaPanel: Check 'bt default' for panel URL and credentials"
echo ""
