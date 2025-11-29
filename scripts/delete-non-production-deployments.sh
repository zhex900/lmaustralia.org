#!/bin/bash
#
# Script to delete all Vercel deployments except the last 10 successful production deployments.
#
# Usage:
#   ./scripts/delete-non-production-deployments.sh
#   DRY_RUN=true ./scripts/delete-non-production-deployments.sh
#   KEEP_COUNT=5 ./scripts/delete-non-production-deployments.sh
#
# Requirements:
#   - Vercel CLI installed and authenticated (run `vercel login`)
#   - Project linked to Vercel (run `vercel link`)

set -e

# Number of production deployments to keep
KEEP_COUNT=${KEEP_COUNT:-10}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed.${NC}"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

# Check if user is authenticated
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with Vercel.${NC}"
    echo "Run: vercel login"
    exit 1
fi

# Get project info from .vercel/project.json
echo -e "${BLUE}🔍 Getting project information...${NC}"
VERCEL_PROJECT_FILE=".vercel/project.json"

if [ -f "$VERCEL_PROJECT_FILE" ]; then
    # Extract projectName using grep/sed (no jq needed)
    PROJECT_NAME=$(grep -o '"projectName":"[^"]*"' "$VERCEL_PROJECT_FILE" | sed 's/"projectName":"\(.*\)"/\1/' || echo "")
else
    # Fallback: try to get project name from vercel ls output
    echo -e "${YELLOW}⚠️  .vercel/project.json not found.${NC}"
    echo "Linking project..."
    vercel link
    if [ -f "$VERCEL_PROJECT_FILE" ]; then
        PROJECT_NAME=$(grep -o '"projectName":"[^"]*"' "$VERCEL_PROJECT_FILE" | sed 's/"projectName":"\(.*\)"/\1/' || echo "")
    fi
fi

if [ -z "$PROJECT_NAME" ]; then
    echo -e "${YELLOW}⚠️  Could not determine project name from config.${NC}"
    echo "Will use default project detection from vercel ls..."
    PROJECT_NAME=""
fi

echo -e "${GREEN}✅ Project: ${PROJECT_NAME}${NC}"
echo -e "${BLUE}📌 Keeping last ${KEEP_COUNT} successful production deployments${NC}"

# Get all deployments using Vercel CLI
echo -e "${BLUE}📦 Fetching deployments...${NC}"
DEPLOYMENTS_OUTPUT=$(vercel ls "$PROJECT_NAME" 2>&1 || vercel ls 2>&1)

if [ -z "$DEPLOYMENTS_OUTPUT" ]; then
    echo -e "${YELLOW}⚠️  No deployments found.${NC}"
    exit 0
fi

# Create temporary files for processing
TEMP_DIR=$(mktemp -d)
ALL_DEPLOYMENTS="$TEMP_DIR/all.txt"
PROD_READY="$TEMP_DIR/prod_ready.txt"
TO_DELETE="$TEMP_DIR/delete.txt"

# Parse all deployments (skip header lines)
echo "$DEPLOYMENTS_OUTPUT" | tail -n +5 | grep -E "(Ready|Error|Building|Queued|Canceled)" > "$ALL_DEPLOYMENTS" || true

# Extract production + Ready deployments
while IFS= read -r line; do
    ENV=$(echo "$line" | awk '{print $(NF-2)}')
    STATUS=$(echo "$line" | awk '{print $3}')
    
    if [ "$ENV" = "Production" ] && echo "$STATUS" | grep -q "Ready"; then
        echo "$line" >> "$PROD_READY"
    fi
done < "$ALL_DEPLOYMENTS"

# Count deployments
TOTAL_COUNT=$(wc -l < "$ALL_DEPLOYMENTS" 2>/dev/null | tr -d ' ' || echo "0")
PROD_READY_COUNT=$(wc -l < "$PROD_READY" 2>/dev/null | tr -d ' ' || echo "0")
PREVIEW_COUNT=$(grep -c "Preview" "$ALL_DEPLOYMENTS" 2>/dev/null || echo "0")
PROD_ERROR_COUNT=$(grep -cE "Production.*Error" "$ALL_DEPLOYMENTS" 2>/dev/null || echo "0")

echo -e "${GREEN}✅ Total deployments: ${TOTAL_COUNT}${NC}"
echo -e "${GREEN}✅ Successful production deployments: ${PROD_READY_COUNT}${NC}"
echo -e "${YELLOW}🗑️  Preview deployments: ${PREVIEW_COUNT}${NC}"
echo -e "${YELLOW}🗑️  Failed production deployments: ${PROD_ERROR_COUNT}${NC}"

# Create keep list file
KEEP_LIST="$TEMP_DIR/keep_list.txt"
if [ -f "$PROD_READY" ] && [ "$PROD_READY_COUNT" -gt 0 ]; then
    head -n "$KEEP_COUNT" "$PROD_READY" | awk '{print $2}' > "$KEEP_LIST"
fi

# Find deployments to delete
while IFS= read -r line; do
    DEPLOYMENT_URL=$(echo "$line" | awk '{print $2}')
    ENV=$(echo "$line" | awk '{print $(NF-2)}')
    STATUS=$(echo "$line" | awk '{print $3}')
    
    # Delete if:
    # 1. It's a preview deployment (non-production), OR
    # 2. It's a production deployment that's not Ready (failed), OR
    # 3. It's a production Ready deployment NOT in the last KEEP_COUNT (older successful production)
    DELETE_THIS=false
    
    if [ "$ENV" = "Preview" ]; then
        # Delete all non-production/preview deployments
        DELETE_THIS=true
    elif [ "$ENV" = "Production" ] && ! echo "$STATUS" | grep -q "Ready"; then
        # Delete failed production deployments
        DELETE_THIS=true
    elif [ "$ENV" = "Production" ] && echo "$STATUS" | grep -q "Ready"; then
        # Delete production Ready deployments that are NOT in the keep list
        # (i.e., older than the last KEEP_COUNT successful production deployments)
        if [ ! -f "$KEEP_LIST" ] || ! grep -q "^${DEPLOYMENT_URL}$" "$KEEP_LIST"; then
            DELETE_THIS=true
        fi
    fi
    
    if [ "$DELETE_THIS" = true ]; then
        echo "$line" >> "$TO_DELETE"
    fi
done < "$ALL_DEPLOYMENTS"

DELETE_COUNT=$(wc -l < "$TO_DELETE" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$DELETE_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✨ No deployments to delete!${NC}"
    rm -rf "$TEMP_DIR"
    exit 0
fi

# Show deployments to keep
echo -e "\n${GREEN}📋 Deployments to KEEP (last ${KEEP_COUNT} successful production):${NC}"
if [ -f "$PROD_READY" ] && [ "$PROD_READY_COUNT" -gt 0 ]; then
    head -n "$KEEP_COUNT" "$PROD_READY" | while IFS= read -r line; do
        DEPLOYMENT_URL=$(echo "$line" | awk '{print $2}')
        STATUS=$(echo "$line" | awk '{print $3}')
        AGE=$(echo "$line" | awk '{print $1}')
        printf "  ${GREEN}✓${NC} %s | %s | %s\n" "$DEPLOYMENT_URL" "$STATUS" "$AGE"
    done
else
    echo -e "  ${YELLOW}(none)${NC}"
fi

# Show deployments to be deleted
echo -e "\n${RED}📋 Deployments to DELETE (${DELETE_COUNT}):${NC}"
echo -e "${YELLOW}   (All preview deployments + production deployments not in last ${KEEP_COUNT} successful)${NC}"

PREVIEW_DELETE_COUNT=0
PROD_DELETE_COUNT=0

while IFS= read -r line; do
    DEPLOYMENT_URL=$(echo "$line" | awk '{print $2}')
    STATUS=$(echo "$line" | awk '{print $3}')
    ENV=$(echo "$line" | awk '{print $(NF-2)}')
    AGE=$(echo "$line" | awk '{print $1}')
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        if [ "$ENV" = "Preview" ]; then
            PREVIEW_DELETE_COUNT=$((PREVIEW_DELETE_COUNT + 1))
        else
            PROD_DELETE_COUNT=$((PROD_DELETE_COUNT + 1))
        fi
        printf "  ${RED}✗${NC} %s | %s | %s | %s\n" "$DEPLOYMENT_URL" "$STATUS" "$ENV" "$AGE"
    fi
done < "$TO_DELETE"

echo -e "\n${YELLOW}   Summary: ${PREVIEW_DELETE_COUNT} preview + ${PROD_DELETE_COUNT} production deployments to delete${NC}"

# Dry run check
if [ "$DRY_RUN" = "true" ]; then
    echo -e "\n${BLUE}🔍 DRY_RUN mode: No deployments will be deleted${NC}"
    rm -rf "$TEMP_DIR"
    exit 0
fi

# Confirmation check
if [ "$FORCE_DELETE" != "true" ] && [ -z "$CI" ]; then
    echo -e "\n${RED}⚠️  This will permanently delete ${DELETE_COUNT} deployment(s).${NC}"
    echo "Set FORCE_DELETE=true to skip confirmation, or DRY_RUN=true to preview."
    read -p "Are you sure you want to continue? (yes/no): " -r
    if [ "$REPLY" != "yes" ]; then
        echo -e "${YELLOW}Aborted.${NC}"
        rm -rf "$TEMP_DIR"
        exit 0
    fi
fi

# Delete deployments using Vercel CLI
echo -e "\n${BLUE}🗑️  Deleting deployments...${NC}"
DELETED=0
FAILED=0

while IFS= read -r line; do
    DEPLOYMENT_URL=$(echo "$line" | awk '{print $2}')
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        continue
    fi
    
    echo -e "${BLUE}🗑️  Deleting ${DEPLOYMENT_URL}...${NC}"
    
    # Use vercel rm command with --yes flag to skip confirmation
    if vercel rm "$DEPLOYMENT_URL" --yes 2>&1 | grep -qE "(Removed|removed|Success|successfully)"; then
        echo -e "  ${GREEN}✅ Deleted ${DEPLOYMENT_URL}${NC}"
        DELETED=$((DELETED + 1))
    else
        echo -e "  ${RED}❌ Failed to delete ${DEPLOYMENT_URL}${NC}"
        FAILED=$((FAILED + 1))
    fi
done < "$TO_DELETE"

# Cleanup
rm -rf "$TEMP_DIR"

echo -e "\n${GREEN}✨ Done! Deleted ${DELETED} deployment(s), ${FAILED} failed${NC}"
KEPT_COUNT=$((PROD_READY_COUNT < KEEP_COUNT ? PROD_READY_COUNT : KEEP_COUNT))
echo -e "${GREEN}✅ Kept ${KEPT_COUNT} successful production deployment(s)${NC}"
