#!/bin/bash
# ============================================================================
# PDF Smart Hub - One-Click Vercel Deploy (Interactive)
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                    ║${NC}"
echo -e "${CYAN}║   🚀  PDF Smart Hub - Vercel Deploy              ║${NC}"
echo -e "${CYAN}║                                                    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# 1) Check Node
echo -e "${BLUE}[1/4]${NC} التحقق من Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js مش مثبت. ثبّته من https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}   ✅ Node $(node --version)${NC}"
echo ""

# 2) Install Vercel CLI if needed
echo -e "${BLUE}[2/4]${NC} تثبيت Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    npm install -g vercel > /dev/null 2>&1
fi
echo -e "${GREEN}   ✅ Vercel CLI $(vercel --version)${NC}"
echo ""

# 3) Get token
echo -e "${YELLOW}[3/4]${NC} نحتاج Vercel Token${NC}"
echo ""
echo "   لإنشاء Token:"
echo "   1. افتح ${CYAN}https://vercel.com/account/tokens${NC}"
echo "   2. اضغط Create"
echo "   3. Scope: Full Account"
echo "   4. انسخ الـ Token والصقه هنا"
echo ""
read -p "Vercel Token: " VERCEL_TOKEN

if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}❌ لازم تدخّل Token${NC}"
    exit 1
fi

# 4) Deploy
echo ""
echo -e "${BLUE}[4/4]${NC} جاري النشر...${NC}"
echo ""

cd /workspace/pdf-smart-hub

# Link المشروع (أول مرة)
vercel link --yes --token "$VERCEL_TOKEN" 2>&1 | tail -3
echo ""

# Deploy للإنتاج
vercel deploy --prod --yes --token "$VERCEL_TOKEN" 2>&1 | tee /tmp/vercel-output.log

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅  تم النشر بنجاح!                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"

# عرض الرابط
URL=$(grep -oE 'https://[a-z0-9-]+\.vercel\.app' /tmp/vercel-output.log | head -1)
if [ -n "$URL" ]; then
    echo ""
    echo -e "${CYAN}🌐 موقعك شغال على:${NC}"
    echo -e "${GREEN}${URL}${NC}"
    echo ""
fi
