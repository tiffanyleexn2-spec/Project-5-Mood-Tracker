#!/bin/bash

# Project 5: Mood Tracker - Local Development Setup
# W3 Server-Side Development & Authentication

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo "🌈 Mood Tracker - Firebase + SvelteKit Project Setup"
echo "====================================================="
echo ""

# Check if script is run from correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project-05-mood-tracker directory${NC}"
    echo "   Expected: cd Templates/project-05-mood-tracker && ./setup.sh"
    exit 1
fi

echo -e "${CYAN}🎓 DISCOVERY LEARNING OBJECTIVES:${NC}"
echo "   • Set up Firebase Authentication"
echo "   • Work with Firestore database"
echo "   • Implement real-time data updates"
echo "   • Manage user-specific data"
echo ""

echo -e "${CYAN}📚 Key Concepts (Lessons 17-18):${NC}"
echo "   → Firebase SDK integration"
echo "   → Email/Password authentication"
echo "   → Firestore CRUD operations"
echo "   → Real-time listeners and subscriptions"
echo ""

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo ""
    npm install

    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ npm install failed${NC}"
        echo "   Try running: npm install --legacy-peer-deps"
        exit 1
    fi

    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
    echo ""
fi

# Firebase configuration check
echo -e "${BLUE}🔥 Firebase Configuration Check${NC}"
echo ""

if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file found${NC}"
    echo ""
elif [ -f ".env.example" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo ""
    echo "Firebase requires configuration before running:"
    echo ""
    echo -e "${CYAN}Setup Steps:${NC}"
    echo "  1. Create Firebase project at: https://console.firebase.google.com/"
    echo "  2. Enable Email/Password authentication"
    echo "  3. Create Firestore database"
    echo "  4. Copy your Firebase config"
    echo ""
    echo -e "${CYAN}Configuration:${NC}"
    echo "  cp .env.example .env"
    echo "  # Edit .env with your Firebase credentials"
    echo ""
    read -p "Continue without Firebase config? (y/n): " continue_choice
    if [[ "$continue_choice" != "y" ]] && [[ "$continue_choice" != "Y" ]]; then
        echo ""
        echo -e "${BLUE}👉 Set up your Firebase config first, then run: ./setup.sh${NC}"
        exit 0
    fi
    echo ""
else
    echo -e "${YELLOW}⚠️  No .env.example found${NC}"
    echo "   You may need to configure Firebase manually"
    echo ""
fi

echo "📁 Project Structure:"
echo "   • Entry point: src/routes/+page.svelte"
echo "   • Firebase config: src/firebase.js (uses .env)"
echo "   • Auth logic: Implement login/signup"
echo "   • Firestore: Store mood entries per user"
echo ""

echo -e "${GREEN}🚀 Starting SvelteKit development server...${NC}"
echo ""
echo "   → Server will start at: http://localhost:5173"
echo "   → Press Ctrl+C to stop the server"
echo ""
echo "====================================================="
echo ""

# Start the development server
npm run dev
