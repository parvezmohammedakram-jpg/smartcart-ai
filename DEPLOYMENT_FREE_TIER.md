# SmartCart AI - Free Tier Deployment Guide

## 🚀 Quick Deploy (3 Free Services)

This guide shows you how to deploy SmartCart AI completely FREE using:
- **Vercel** (Frontend) - FREE forever
- **Railway/Render** (Backend API) - FREE tier
- **Supabase** (Database - Optional) - FREE tier

---

## 📦 What You're Deploying

### Frontend (Vercel)
- Beautiful landing page
- Interactive AI chat demo
- Fully responsive design
- **Location:** `frontend/`

### Backend (Railway/Render)
- Simplified unified API
- AI chat processing (optional Claude AI)
- Product catalog
- **Location:** `backend-simple/`

---

## 🎯 Step 1: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/login with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `smartcart-ai` repo

3. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   ```

4. **Add Environment Variable**
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app
   ```
   (You'll get this URL in Step 2)

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at `https://your-project.vercel.app`

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: smartcart-ai
# - Directory: ./
# - Override settings? No

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend-url.railway.app

# Deploy to production
vercel --prod
```

---

## 🎯 Step 2: Deploy Backend to Railway

### Option A: Railway (Recommended - Easier)

1. **Go to Railway**
   - Visit https://railway.app
   - Sign up/login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `smartcart-ai` repository

3. **Configure Service**
   ```
   Root Directory: backend-simple
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Environment Variables** (Optional)
   ```
   ANTHROPIC_API_KEY = sk-ant-api03-your-key-here
   ```
   (Skip this if you don't have Claude API key - it will use fallback)

5. **Deploy!**
   - Railway will auto-deploy
   - Copy your app URL: `https://your-app.railway.app`

6. **Update Frontend**
   - Go back to Vercel
   - Update `NEXT_PUBLIC_API_URL` to your Railway URL
   - Redeploy frontend

### Option B: Render

1. **Go to Render**
   - Visit https://render.com
   - Sign up/login with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select `smartcart-ai`

3. **Configure**
   ```
   Name: smartcart-ai-backend
   Root Directory: backend-simple
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

4. **Environment Variables**
   ```
   ANTHROPIC_API_KEY = your-key (optional)
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Copy URL: `https://smartcart-ai-backend.onrender.com`

---

## 🎯 Step 3: Test Your Deployment

### Test Frontend
1. Visit your Vercel URL
2. Scroll to "Try It Now" section
3. Type a message in the chat: "I need 2kg tomatoes"
4. You should get an AI response!

### Test Backend API
```bash
# Health check
curl https://your-backend-url.railway.app/health

# Test chat
curl -X POST https://your-backend-url.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I need milk and bread"}'

# Get products
curl https://your-backend-url.railway.app/api/products
```

---

## 📝 Optional: Add Database (Supabase)

If you want to store real data:

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project (FREE tier)
   - Wait for database to initialize

2. **Run Schema**
   - Go to SQL Editor in Supabase
   - Copy contents from `database/schema.sql`
   - Run the schema

3. **Get Connection String**
   - Go to Project Settings → Database
   - Copy connection string

4. **Update Backend**
   - Add to Railway/Render environment:
     ```
     DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
     ```

5. **Update Code**
   - Modify `backend-simple/main.py` to use database instead of mock data

---

## 🎨 Customize Your Deployment

### Change Colors/Branding
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    600: '#your-darker-color',
  },
}
```

### Add Your Logo
Replace logo in `frontend/app/page.tsx`

### Update Content
Edit text in:
- `frontend/components/Hero.tsx`
- `frontend/components/Features.tsx`

---

## 💰 Cost Breakdown

### FREE Tier Limits

**Vercel (Frontend)**
- ✅ Unlimited bandwidth
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ 100 GB bandwidth/month
- ✅ FREE forever

**Railway (Backend)**
- ✅ $5 free credit/month
- ✅ ~500 hours runtime
- ✅ Enough for demo/MVP
- ⚠️ Sleeps after 30 min inactivity

**Render (Alternative Backend)**
- ✅ 750 hours/month FREE
- ✅ Automatic SSL
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold start: 30-60 seconds

**Supabase (Database - Optional)**
- ✅ 500 MB database
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users
- ✅ FREE forever

### Total Cost: **$0/month** 🎉

---

## 🔧 Troubleshooting

### Frontend shows "API Error"
- Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Make sure backend URL is correct and includes `https://`
- Redeploy frontend after changing env vars

### Backend not responding
- Check Railway/Render logs
- Verify build succeeded
- Test health endpoint: `https://your-backend.railway.app/health`

### Chat not working
- Backend works without Claude API (uses fallback)
- Check browser console for errors
- Verify CORS is enabled in backend

### Railway/Render sleeping
- FREE tier sleeps after inactivity
- First request after sleep takes 10-30 seconds
- Upgrade to paid tier ($5-7/month) for always-on

---

## 🚀 Next Steps

1. ✅ **Deploy** - Follow steps above
2. 🎨 **Customize** - Update branding and content
3. 📱 **Share** - Send your Vercel URL to friends
4. 📊 **Monitor** - Check Vercel/Railway analytics
5. 💡 **Upgrade** - Add real database, more features

---

## 📞 Support

- **Frontend Issues**: Check Vercel logs
- **Backend Issues**: Check Railway/Render logs
- **General Help**: See main README.md

---

## ✅ Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables set
- [ ] Frontend can reach backend
- [ ] Chat demo works
- [ ] Custom domain (optional)
- [ ] Analytics setup (optional)

---

**Congratulations! 🎉 Your SmartCart AI is now live and FREE!**

Share your deployment: `https://your-project.vercel.app`
