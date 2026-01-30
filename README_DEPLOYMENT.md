# 🚀 Quick Deployment Guide

## Step 1: Push to GitHub

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SmartCart AI platform"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/smartcart-ai.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? smartcart-ai
# - Directory? ./
# - Override settings? No
```

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.railway.app`
6. Click "Deploy"

## Step 3: Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `smartcart-ai` repository
4. Configure:
   - **Root Directory**: `backend-simple`
   - **Start Command**: `python main.py`
5. Add Environment Variables:
   - `PORT` = `8080`
   - `ANTHROPIC_API_KEY` = `your-api-key` (optional)
6. Click "Deploy"
7. Copy the generated URL (e.g., `https://smartcart-backend.railway.app`)

## Step 4: Update Frontend Environment

1. Go back to Vercel dashboard
2. Go to your project → Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` with your Railway backend URL
4. Redeploy the frontend

## ✅ Done!

Your SmartCart AI is now live at:
- **Frontend**: `https://smartcart-ai.vercel.app`
- **Backend**: `https://your-backend.railway.app`

## 🔧 Troubleshooting

**Frontend won't build:**
```bash
cd frontend
npm install
npm run build
```

**Backend won't start:**
```bash
cd backend-simple
pip install -r requirements.txt
python main.py
```

**CORS errors:**
- Make sure backend has CORS enabled (already configured in `main.py`)
- Check that `NEXT_PUBLIC_API_URL` is set correctly

## 📝 Post-Deployment

- Test the chat demo on your live site
- Monitor Railway logs for backend errors
- Check Vercel deployment logs for frontend issues
- Add custom domain (optional)
