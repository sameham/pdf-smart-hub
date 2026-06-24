#!/bin/bash
# ============================================================================
# PDF Smart Hub - Vercel Auto Deploy
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Vercel Deploy                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

echo -e "${YELLOW}📝 للحصول على Vercel Token:${NC}"
echo "   1. افتح https://vercel.com/account/tokens"
echo "   2. اضغط Create Token"
echo "   3. سمّيه: pdf-smart-hub-deploy"
echo "   4. Scope: Full Account"
echo "   5. انسخ الـ Token"
echo ""

read -p "Vercel Token: " VERCEL_TOKEN

if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}❌ Token مطلوب${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}⏳ جاري النشر...${NC}"

# Deploy
cd /workspace/pdf-smart-hub

# Link المشروع
vercel link --yes --token "$VERCEL_TOKEN" 2>&1 | tail -5

# Deploy للإنتاج
vercel deploy --prod --yes --token "$VERCEL_TOKEN" 2>&1 | tail -10

echo ""
echo -e "${GREEN}✅ تم النشر بنجاح!${NC}"