#!/bin/bash

# CryptoStream Deploy Script untuk Vercel
# Usage: ./deploy.sh

echo "🚀 CryptoStream Deployment Script"
echo "=================================="
echo ""

# Check if git is clean
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    git status -s
    exit 1
fi

echo "✅ Git working directory is clean"
echo ""

# Build test
echo "🔨 Testing build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo "✅ Build successful"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub"
    exit 1
fi

echo "✅ Pushed to GitHub successfully"
echo ""

# Deploy to Vercel (if Vercel CLI is installed)
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo "🌐 Your app is now live!"
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "ℹ️  Vercel CLI not found. Install with: npm install -g vercel"
    echo "📝 Or deploy manually via: https://vercel.com/new"
fi

echo ""
echo "=================================="
echo "🎉 Deployment process complete!"
