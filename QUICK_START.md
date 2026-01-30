# SmartCart AI - Quick Start Guide

## 🚀 Test Locally (2 Minutes)

### Prerequisites
- Node.js 20+
- Python 3.11+

### Step 1: Start Backend

```bash
# Navigate to backend
cd backend-simple

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

Backend will start at: http://localhost:8080

### Step 2: Start Frontend

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start at: http://localhost:3000

### Step 3: Test It!

1. Open http://localhost:3000 in your browser
2. Scroll to "Try It Now" section
3. Type: "I need 2kg tomatoes and 1L milk"
4. See the AI response!

---

## 🌐 Deploy to Production (FREE)

Follow the complete guide: `DEPLOYMENT_FREE_TIER.md`

### Quick Deploy Links:

**Frontend (Vercel):**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Set root directory: `frontend`
5. Deploy!

**Backend (Railway):**
1. Go to https://railway.app
2. Deploy from GitHub
3. Set root directory: `backend-simple`
4. Deploy!

**Total Time:** ~10 minutes
**Total Cost:** $0/month

---

## 📝 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend (.env)
```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here  # Optional
PORT=8080
```

---

## 🧪 Test API Endpoints

```bash
# Health check
curl http://localhost:8080/health

# Chat
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I need milk"}'

# Products
curl http://localhost:8080/api/products
```

---

## 🎨 Customize

### Change Colors
Edit `frontend/tailwind.config.js`

### Update Content
Edit files in `frontend/components/`

### Add Features
Modify `backend-simple/main.py`

---

## 📚 Full Documentation

- **Deployment Guide:** `DEPLOYMENT_FREE_TIER.md`
- **API Docs:** `docs/api-specification.yaml`
- **Database Schema:** `database/schema.sql`
- **Main README:** `README.md`

---

## 🆘 Troubleshooting

**Backend won't start:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Frontend won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Chat not working:**
- Check backend is running on port 8080
- Check browser console for errors
- Verify CORS is enabled

---

**Ready to deploy? See `DEPLOYMENT_FREE_TIER.md`** 🚀
