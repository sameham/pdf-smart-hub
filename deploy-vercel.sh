#!/bin/bash
# ============================================================================
# PDF Smart Hub - Complete Vercel Deploy + Domain Setup
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║   🚀  PDF Smart Hub - Vercel Deploy + Domain Setup       ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: التحقق
echo -e "${BLUE}[1/5]${NC} ${BOLD}التحقق من البيئة${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js مش مثبت${NC}"
    exit 1
fi
echo -e "${GREEN}   ✅ Node $(node --version)${NC}"

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}   ⏳ تثبيت Vercel CLI...${NC}"
    npm install -g vercel > /dev/null 2>&1
fi
echo -e "${GREEN}   ✅ Vercel CLI $(vercel --version)${NC}"
echo ""

# Step 2: الحصول على Token
echo -e "${BLUE}[2/5]${NC} ${BOLD}Vercel Token${NC}"
echo ""
echo -e "${YELLOW}   لإنشاء Token:${NC}"
echo -e "   ${CYAN}https://vercel.com/account/tokens${NC}"
echo -e "   - Name: ${BOLD}pdf-smart-hub-deploy${NC}"
echo -e "   - Scope: ${BOLD}Full Account${NC}"
echo ""
read -p "   🔑 Vercel Token: " VERCEL_TOKEN

if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}❌ Token مطلوب${NC}"
    exit 1
fi
echo ""

# Step 3: اختيار اسم المشروع
echo -e "${BLUE}[3/5]${NC} ${BOLD}إعدادات المشروع${NC}"
read -p "   📦 اسم المشروع على Vercel [pdf-smart-hub]: " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-pdf-smart-hub}
echo ""

# Step 4: Supabase Env Vars (اختياري)
echo -e "${BLUE}[4/5]${NC} ${BOLD}Environment Variables${NC}"
echo -e "   ${YELLOW}(اتركها فارغة للتخطي)${NC}"
echo ""
read -p "   🔗 NEXT_PUBLIC_SUPABASE_URL: " SUPABASE_URL
read -p "   🔑 NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_KEY
echo ""

# Step 5: Deploy
echo -e "${BLUE}[5/5]${NC} ${BOLD}جاري النشر على Vercel...${NC}"
echo ""

cd /workspace/pdf-smart-hub

# إضافة Environment Variables قبل الـ deploy
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_KEY" ]; then
    echo "   ⚙️ إضافة Environment Variables..."
    
    cat > .vercel.json.tmp << EOF
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "$SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "$SUPABASE_KEY"
  }
}
EOF
fi

# Deploy
DEPLOY_OUTPUT=$(vercel deploy --prod --yes --token "$VERCEL_TOKEN" --name "$PROJECT_NAME" 2>&1)
echo "$DEPLOY_OUTPUT" | tail -10

# استخراج الـ URL
VERCEL_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE 'https://[a-z0-9-]+\.vercel\.app' | head -1)

if [ -z "$VERCEL_URL" ]; then
    echo -e "${RED}❌ فشل النشر${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅  تم النشر بنجاح على Vercel!                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}🌐 Vercel URL:${NC}"
echo -e "${GREEN}   ${VERCEL_URL}${NC}"
echo ""

# Step 6: ربط الدومين
echo -e "${BLUE}[6/6]${NC} ${BOLD}ربط الدومين www.pdfsmarthub.com${NC}"
echo ""

read -p "   ❓ هل تريد ربط www.pdfsmarthub.com؟ (y/n): " LINK_DOMAIN

if [ "$LINK_DOMAIN" = "y" ] || [ "$LINK_DOMAIN" = "Y" ]; then
    echo ""
    echo -e "${YELLOW}   ⏳ إضافة الدومين للمشروع...${NC}"
    
    # إضافة www subdomain
    vercel domains add "www.pdfsmarthub.com" --token "$VERCEL_TOKEN" --yes 2>&1 | tail -5
    
    # إضافة الدومين الأساسي (اختياري)
    read -p "   ❓ كمان تضيف pdfsmarthub.com (root)؟ (y/n): " ADD_ROOT
    if [ "$ADD_ROOT" = "y" ] || [ "$ADD_ROOT" = "Y" ]; then
        vercel domains add "pdfsmarthub.com" --token "$VERCEL_TOKEN" --yes 2>&1 | tail -5
    fi
    
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   🎉  كل حاجة جاهزة!                                     ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}📝 الخطوات النهائية:${NC}"
    echo ""
    echo -e "   1. 🌐 روح ${CYAN}https://vercel.com/dashboard${NC}"
    echo -e "   2. 📦 اختار المشروع: ${BOLD}${PROJECT_NAME}${NC}"
    echo -e "   3. ⚙️  Settings → Domains → تأكد إن ${BOLD}www.pdfsmarthub.com${NC} added"
    echo -e "   4. ⏳ DNS propagation هتاخد 5-30 دقيقة"
    echo ""
    echo -e "${CYAN}🌐 روابطك:${NC}"
    echo -e "   ${GREEN}https://www.pdfsmarthub.com${NC} ← الدومين بتاعك"
    echo -e "   ${GREEN}${VERCEL_URL}${NC} ← Vercel URL (فوري)"
    echo ""
else
    echo ""
    echo -e "${CYAN}🌐 موقعك متاح على:${NC}"
    echo -e "   ${GREEN}${VERCEL_URL}${NC}"
fi

echo ""
echo -e "${YELLOW}💡 لربط الدومين لاحقاً:${NC}"
echo -e "   ${CYAN}vercel domains add www.pdfsmarthub.com --token YOUR_TOKEN${NC}"
echo ""