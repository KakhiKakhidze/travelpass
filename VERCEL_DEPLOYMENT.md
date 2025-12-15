# Vercel Deployment Guide

This guide will help you deploy your TravelPass frontend to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your project pushed to GitHub, GitLab, or Bitbucket (recommended)
3. Your backend API deployed separately (Railway, Render, Heroku, etc.)

## Step 1: Prepare Your Repository

Make sure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Create React App (or leave as "Other")
   - **Root Directory**: Leave as root (`.`)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts. When asked:
   - Set root directory to `.` (current directory)
   - The configuration in `vercel.json` will be used automatically

## Step 3: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

   ```
   REACT_APP_API_URL=https://your-backend-api-url.com/api
   ```

   Replace `https://your-backend-api-url.com/api` with your actual backend API URL.

   **Important**: Make sure your backend API:
   - Has CORS configured to allow requests from your Vercel domain
   - Is accessible via HTTPS
   - Has all necessary environment variables configured

## Step 4: Deploy Your Backend (If Not Already Done)

Your backend needs to be deployed separately. Here are some options:

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Create a new project from your GitHub repo
3. Select the `backend` directory as the root
4. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secret key for JWT tokens
   - `JWT_REFRESH_SECRET` - A secret key for refresh tokens
   - `PORT` - Port number (Railway will set this automatically)

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set root directory to `backend`
5. Configure environment variables

### Option 3: Heroku
1. Go to [heroku.com](https://heroku.com)
2. Create a new app
3. Deploy from GitHub
4. Set buildpack to Node.js
5. Configure environment variables

## Step 5: Update CORS Settings

Make sure your backend allows requests from your Vercel domain:

In `backend/server.js`, update the CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', // For local development
    'https://your-vercel-app.vercel.app', // Your Vercel URL
    'https://your-custom-domain.com' // Your custom domain (if applicable)
  ],
  credentials: true
}));
```

Or for production, you can use:

```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Then add `ALLOWED_ORIGINS` to your backend environment variables.

## Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Check the browser console for any errors
3. Test key features:
   - User registration/login
   - API calls
   - Navigation

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Calls Fail
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings on backend
- Verify backend is running and accessible

### Environment Variables Not Working
- Make sure variables start with `REACT_APP_` prefix
- Redeploy after adding new environment variables
- Check variable names for typos

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys when you push to your main branch. For preview deployments:
- Push to any branch → Preview deployment
- Merge to main → Production deployment

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

