# 🚀 SmartCart AI - Complete Deployment Guide

## Prerequisites

Before deploying, you need:

1. **Git** - [Download Git for Windows](https://git-scm.com/download/win)
2. **GitHub Account** - [Sign up at GitHub](https://github.com/signup)
3. **Vercel Account** - [Sign up at Vercel](https://vercel.com/signup)
4. **Railway Account** - [Sign up at Railway](https://railway.app) (optional for backend)

---

## 📦 Step 1: Install Git (REQUIRED)

Since Git is not currently installed on your system:

1. Download Git: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (click "Next" through all prompts)
4. Restart your terminal/VS Code after installation
5. Verify installation: `git --version`

---

## 🌐 Step 2: Create GitHub Repository

### Option A: Using GitHub Desktop (Easier)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in to your GitHub account
3. Click "Add" → "Add Existing Repository"
4. Select folder: `C:\Users\parve\smartcart-ai`
5. Click "Publish repository"
6. Name: `smartcart-ai`
7. Description: "AI-powered grocery ordering platform"
8. Uncheck "Keep this code private" (or keep it private)
9. Click "Publish repository"

### Option B: Using Command Line (After Git is installed)

```bash
# Navigate to project
cd C:\Users\parve\smartcart-ai

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SmartCart AI with professional green design"

# Go to GitHub.com and create a new repository named 'smartcart-ai'
# Then run these commands (replace YOUR_USERNAME):

git remote add origin https://github.com/YOUR_USERNAME/smartcart-ai.git
git branch -M main
git push -u origin main
```

---

## ☁️ Step 3: Deploy Frontend to Vercel

### Using Vercel Dashboard (Recommended - No CLI needed)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New..."** → "Project"
4. **Import Repository**:
   - Find `smartcart-ai` in the list
   - Click "Import"
5. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Click "Edit" → Select `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)
6. **Environment Variables** (click "Add"):
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `http://localhost:8080` (temporary, we'll update this)
7. **Click "Deploy"**
8. **Wait 2-3 minutes** for deployment to complete
9. **Your site is live!** Copy the URL (e.g., `https://smartcart-ai.vercel.app`)

---

## 🚂 Step 4: Deploy Backend to Railway (Optional)

### Using Railway Dashboard

1. **Go to Railway**: https://railway.app
2. **Sign in** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose** `smartcart-ai` repository
6. **Configure**:
   - Railway will auto-detect Python
   - Click "Add variables" to add environment variables:
     - `PORT` = `8080`
     - `ANTHROPIC_API_KEY` = `your-key-here` (optional)
7. **Settings** → **Root Directory**: `backend-simple`
8. **Settings** → **Start Command**: `python main.py`
9. **Deploy** - Railway will automatically deploy
10. **Copy the URL** from "Deployments" tab (e.g., `https://smartcart-backend.up.railway.app`)

---

## 🔗 Step 5: Connect Frontend to Backend

1. **Go back to Vercel Dashboard**
2. **Select your project** (`smartcart-ai`)
3. **Go to Settings** → **Environment Variables**
4. **Edit** `NEXT_PUBLIC_API_URL`:
   - Change from `http://localhost:8080`
   - To your Railway URL: `https://smartcart-backend.up.railway.app`
5. **Save**
6. **Go to Deployments** tab
7. **Click "..." on latest deployment** → **"Redeploy"**
8. **Wait for redeployment** (1-2 minutes)

---

## ✅ Step 6: Test Your Live Site

1. **Visit your Vercel URL**: `https://smartcart-ai.vercel.app`
2. **Scroll to "Try It Now" section**
3. **Type in chat**: "I need 2kg tomatoes and 1L milk"
4. **Verify** the AI responds correctly
5. **Test other features**

---

## 🎉 You're Live!

Your SmartCart AI is now deployed:
- **Frontend**: `https://smartcart-ai.vercel.app`
- **Backend**: `https://smartcart-backend.up.railway.app` (if deployed)
- **GitHub**: `https://github.com/YOUR_USERNAME/smartcart-ai`

---

## 🔧 Troubleshooting

### "Git not found" error
- Install Git from https://git-scm.com/download/win
- Restart terminal/VS Code
- Try again

### Vercel build fails
- Check that `frontend` directory is selected as root
- Verify `package.json` exists in frontend folder
- Check build logs for specific errors

### Backend won't start on Railway
- Verify `requirements.txt` exists in `backend-simple`
- Check that `main.py` exists
- Review Railway logs for errors

### Chat not working
- Make sure backend is deployed and running
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check browser console for CORS errors

### CORS errors
- Backend already has CORS enabled in `main.py`
- Make sure you're using the correct backend URL
- Try redeploying backend

---

## 📝 Next Steps

1. **Custom Domain** (optional):
   - Vercel: Settings → Domains → Add domain
   - Railway: Settings → Domains → Generate domain

2. **Add Real AI** (optional):
   - Get Anthropic API key: https://console.anthropic.com
   - Add to Railway environment variables
   - Redeploy backend

3. **Monitor Usage**:
   - Vercel: Check Analytics tab
   - Railway: Check Metrics tab

4. **Make Changes**:
   - Edit code locally
   - Push to GitHub: `git add . && git commit -m "Update" && git push`
   - Vercel auto-deploys on push!
   - Railway auto-deploys on push!

---

## 💰 Cost Breakdown

- **Vercel**: FREE (100GB bandwidth, unlimited deployments)
- **Railway**: FREE ($5 credit/month, ~550 hours)
- **GitHub**: FREE (unlimited public repositories)
- **Total**: **$0/month** 🎉

---

## 🆘 Need Help?

If you get stuck:
1. Check the error messages carefully
2. Review the deployment logs
3. Make sure all files are committed to GitHub
4. Verify environment variables are set correctly

**Common Issues**:
- Git not installed → Install from git-scm.com
- Build fails → Check `frontend` is selected as root directory
- Chat doesn't work → Verify backend URL in environment variables
