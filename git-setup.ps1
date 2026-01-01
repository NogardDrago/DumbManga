# Git Setup Script for Manga Reader App (PowerShell)

Write-Host "🚀 Setting up Git repository..." -ForegroundColor Green

# Initialize Git
git init

# Add all files
Write-Host "📦 Adding files to Git..." -ForegroundColor Yellow
git add .

# Make initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Manga Reader App with multi-source architecture

- Complete React Native Expo app structure
- Multi-tab reader with page flip and long strip modes
- Offline folder/PDF reading support
- Online MangaDex integration
- Modular manga source architecture
- Clean, production-ready code"

Write-Host "✅ Git repository initialized!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a repository on GitHub/GitLab"
Write-Host "2. Run: git remote add origin <your-repo-url>"
Write-Host "3. Run: git push -u origin main"
Write-Host ""
Write-Host "📖 See README_GIT.md for detailed Git workflow guide" -ForegroundColor Cyan

