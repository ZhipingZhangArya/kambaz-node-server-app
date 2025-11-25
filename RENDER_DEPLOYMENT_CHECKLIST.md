# Render Deployment Checklist

## Pre-Deployment Checklist

- [x] Code is committed and pushed to GitHub
- [x] `.gitignore` includes `.env` files
- [x] `package.json` has `start` script: `npm start`
- [x] Server uses `process.env.PORT` (Render provides this automatically)
- [x] Environment variables are configured in code

## Deployment Steps

### Step 1: Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up or log in
- [ ] Verify account

### Step 2: Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository: `kambaz-node-server-app`
- [ ] Select repository from dropdown

### Step 3: Configure Service
- [ ] **Name**: `kambaz-node-server-app-cs5610-sp25` (or your preferred name)
- [ ] **Region**: Choose closest to you (e.g., Oregon US West)
- [ ] **Branch**: `main` (or your default branch)
- [ ] **Root Directory**: Leave empty (root of repo)
- [ ] **Runtime**: `Node`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Instance Type**: `Free`

### Step 4: Set Environment Variables
Click "Add Environment Variable" for each:

- [ ] **SERVER_ENV** = `production`
- [ ] **CLIENT_URL** = `https://kambaz-next-js-cs5610-sp25.vercel.app` (placeholder - will update after Vercel deployment)
- [ ] **SERVER_URL** = `kambaz-node-server-app-cs5610-sp25.onrender.com` (without https:// - Render may modify this)
- [ ] **SESSION_SECRET** = `super secret session phrase` (use a secure random string in production)

**Important Notes:**
- `CLIENT_URL` is a placeholder - you'll update it after Vercel is deployed
- `SERVER_URL` should NOT include `http://` or `https://`
- Render may modify your domain to make it unique (e.g., add random characters)
- You'll need to update `SERVER_URL` if Render modifies the domain

### Step 5: Deploy
- [ ] Click "Create Web Service" or "Deploy"
- [ ] Wait for build to complete
- [ ] Watch build logs for errors

### Step 6: Test Deployment
- [ ] **Note your Render URL** (e.g., `https://kambaz-node-server-app-cs5610-sp25.onrender.com`)
- [ ] Test root endpoint: `https://YOUR-URL.onrender.com/`
  - Should see: "Welcome to Full Stack Development!"
- [ ] Test courses API: `https://YOUR-URL.onrender.com/api/courses`
  - Should see: JSON array of courses
- [ ] Test modules API: `https://YOUR-URL.onrender.com/api/courses/RS101/modules`
  - Should see: JSON array of modules

### Step 7: Update SERVER_URL if Domain Changed
If Render modified your domain (added random characters):

- [ ] Go to Render dashboard
- [ ] Click on your service
- [ ] Go to "Environment" tab
- [ ] Click "Edit" on `SERVER_URL`
- [ ] Update value to match your actual domain (without `https://`)
- [ ] Click "Save Changes"
- [ ] Render will automatically rebuild

## Post-Deployment Checklist

- [ ] Deployment is successful
- [ ] Server URL is accessible
- [ ] API endpoints are working
- [ ] SERVER_URL is updated if domain changed
- [ ] Ready to deploy Vercel app (with Render URL)

## Next Steps

After Render deployment is successful:
1. **Note your Render URL** - You'll need this for Vercel
2. **Deploy Vercel** - Use Render URL in `NEXT_PUBLIC_HTTP_SERVER`
3. **Update Render** - Update `CLIENT_URL` with your Vercel URL
4. **Test Integration** - Verify everything works together

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Common issues:
  - Missing dependencies in `package.json`
  - Syntax errors in code
  - Missing environment variables

### Deployment Fails
- Check runtime logs in Render dashboard
- Common issues:
  - Port not properly configured (should use `process.env.PORT`)
  - Missing environment variables
  - Application crashes on startup

### API Endpoints Not Working
- Verify server is running (check logs)
- Test endpoints directly in browser
- Check CORS configuration
- Verify environment variables are set correctly

## Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| `SERVER_ENV` | `production` | Environment mode |
| `CLIENT_URL` | `https://kambaz-next-js-cs5610-sp25.vercel.app` | Placeholder - update after Vercel deployment |
| `SERVER_URL` | `kambaz-node-server-app-cs5610-sp25.onrender.com` | Without https:// - may be modified by Render |
| `SESSION_SECRET` | `super secret session phrase` | Use secure random string in production |
| `PORT` | Auto-set by Render | Don't set manually |

## Useful Render Dashboard Features

- **Logs**: View real-time logs from your service
- **Metrics**: Monitor CPU, memory, and request metrics
- **Environment**: Manage environment variables
- **Events**: View deployment events and history
- **Manual Deploy**: Deploy last commit or specific commit

