# Deployment Guide for Render.com

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Vercel URL**: Your React app should be deployed on Vercel and you should know the URL
   - Example: `https://kambaz-next-js-cs5610-sp25.vercel.app`
3. **Render.com Account**: Create an account at https://render.com if you don't have one

## Step-by-Step Deployment Instructions

### 1. Get Your Vercel URL

First, make sure your React app is deployed on Vercel and note the URL. This will be used as `CLIENT_URL` in the environment variables.

### 2. Create a New Web Service on Render.com

1. Log in to https://render.com
2. Click **"New +"** button (top right)
3. Select **"Web Service"**

### 3. Connect Your GitHub Repository

1. In the **"Connect a repository"** section:
   - Click **"Git Provider"** tab
   - Search for your repository: `kambaz-node-server-app`
   - Select it from the dropdown

### 4. Configure the Web Service

1. **Name**: Enter `kambaz-node-server-app-cs5610-sp25` (or your preferred name)
   - Note: Render may modify this to make it unique

2. **Region**: Select a region closest to you (e.g., `Oregon (US West)`)

3. **Branch**: `main` (or your default branch)

4. **Root Directory**: Leave empty (root of the repository)

5. **Runtime**: `Node`

6. **Build Command**: `npm install`

7. **Start Command**: `npm start`

8. **Instance Type**: Select **"Free"**

### 5. Configure Environment Variables

Click **"Add Environment Variable"** and add the following:

| Environment Variable | Value |
|---------------------|-------|
| `SERVER_ENV` | `production` |
| `CLIENT_URL` | `https://YOUR-VERCEL-APP-URL.vercel.app` |
| `SERVER_URL` | `kambaz-node-server-app-cs5610-sp25.onrender.com` |
| `SESSION_SECRET` | `super secret session phrase` |

**Important Notes:**
- Replace `YOUR-VERCEL-APP-URL.vercel.app` with your actual Vercel URL
- For `SERVER_URL`, use the name you chose in step 4 (without `https://`)
- Do NOT include `http://` or `https://` in `SERVER_URL`
- You can use a more secure value for `SESSION_SECRET` (generate a random string)

### 6. Deploy

1. Click **"Create Web Service"** or **"Deploy"**
2. Wait for the build to complete
3. Watch the logs for any errors

### 7. Check the Deployment

1. Once deployed, Render will provide a URL like:
   - `https://kambaz-node-server-app-cs5610-sp25.onrender.com`
   - Or: `https://kambaz-node-server-app-cs5610-sp25-xxxxx.onrender.com` (if modified)

2. **Test the deployment:**
   - Visit: `https://YOUR-RENDER-URL.onrender.com/`
   - Should see: "Welcome to Full Stack Development!"
   - Test courses: `https://YOUR-RENDER-URL.onrender.com/api/courses`
   - Test modules: `https://YOUR-RENDER-URL.onrender.com/api/courses/RS101/modules`

### 8. Update SERVER_URL if Domain Changed

If Render modified your domain name (added random characters):

1. Go to your Render dashboard
2. Click on your service
3. Go to **"Environment"** tab (left sidebar)
4. Click **"Edit"** on `SERVER_URL`
5. Update the value to match your actual domain (without `https://`)
6. Click **"Save Changes"**
7. Render will automatically rebuild and redeploy

### 9. Update CLIENT_URL in React App

After deployment, update your React app's `.env.development` or `.env.production` to use the Render URL:

```
NEXT_PUBLIC_HTTP_SERVER=https://YOUR-RENDER-URL.onrender.com
```

Then redeploy your React app on Vercel.

## Troubleshooting

### Build Fails

1. Check the build logs in Render dashboard
2. Common issues:
   - Missing dependencies in `package.json`
   - Syntax errors in code
   - Missing environment variables

### Deployment Fails

1. Check the runtime logs
2. Common issues:
   - Port not properly configured (should use `process.env.PORT`)
   - Missing environment variables
   - Database connection issues (if applicable)

### Cookies Not Working

1. Verify `CLIENT_URL` matches your Vercel URL exactly
2. Check that `SERVER_ENV` is set to `production`
3. Ensure `sameSite: 'none'` and `secure: true` in session config
4. Verify CORS is configured correctly

### CORS Errors

1. Verify `CLIENT_URL` in environment variables matches your Vercel URL
2. Check that CORS middleware is configured with `credentials: true`
3. Ensure both client and server are using HTTPS

## Useful Commands

- **View Logs**: Click on your service → "Logs" tab
- **Manual Deploy**: Click "Manual Deploy" → "Deploy latest commit"
- **Redeploy**: Click "Manual Deploy" → "Deploy last commit"

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SERVER_ENV` | Environment mode | `production` |
| `CLIENT_URL` | Your Vercel app URL | `https://kambaz-next-js.vercel.app` |
| `SERVER_URL` | Your Render domain | `kambaz-node-server-app.onrender.com` |
| `SESSION_SECRET` | Session encryption secret | `super secret session phrase` |
| `PORT` | Server port (auto-set by Render) | `10000` |

Note: `PORT` is automatically set by Render - don't set it manually.

