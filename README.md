# LA Bot

A bot project for deployment on Railway.

## Quick Start

### Step 1: Generate a GitHub Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `Railway Deploy Token`
4. Check the box for **`repo`** scope
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### Step 2: Clone the repo with your token
Replace `YOUR_TOKEN` with the token you just copied:
```bash
git clone https://YOUR_TOKEN@github.com/quiklyboy0-eng/la-bot.git
cd la-bot
```

### Step 3: Add your bot code
Put your bot files in this directory.

### Step 4: Push to GitHub
```bash
git add .
git commit -m "Add bot code"
git push origin main
```

If you get a 403 error, run:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/quiklyboy0-eng/la-bot.git
```

## Deploy to Railway

1. Go to: https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `quiklyboy0-eng/la-bot`
6. Railway will auto-detect your app type
7. Add any environment variables your bot needs
8. Click "Deploy"

Your bot will automatically redeploy whenever you push code to `main`.

## Need Help?

- **Bot not starting?** Check Railway logs at: https://railway.app/dashboard
- **Git push failing?** Make sure your token is valid and hasn't expired
