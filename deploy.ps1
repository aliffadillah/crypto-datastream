# CryptoStream Deploy Script untuk Vercel (PowerShell)
# Usage: .\deploy.ps1

Write-Host "🚀 CryptoStream Deployment Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is clean
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  You have uncommitted changes. Please commit or stash them first." -ForegroundColor Yellow
    git status -s
    exit 1
}

Write-Host "✅ Git working directory is clean" -ForegroundColor Green
Write-Host ""

# Build test
Write-Host "🔨 Testing build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Pushed to GitHub successfully" -ForegroundColor Green
Write-Host ""

# Deploy to Vercel (if Vercel CLI is installed)
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host "🌐 Your app is now live!" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Deployment failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ️  Vercel CLI not found. Install with: npm install -g vercel" -ForegroundColor Yellow
    Write-Host "📝 Or deploy manually via: https://vercel.com/new" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment process complete!" -ForegroundColor Green
