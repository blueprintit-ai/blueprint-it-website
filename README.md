# Blueprint IT Website - Vercel Deployment Guide

This package contains all the necessary files to deploy your Blueprint IT website to Vercel.

## 📁 Package Contents

- `src/` - Source code including React components and styles
- `public/` - Static assets (images, icons, etc.)
- `package.json` - Project dependencies and scripts
- `pnpm-lock.yaml` - Lock file for exact dependency versions
- `vite.config.js` - Vite build configuration
- `index.html` - Main HTML template
- `components.json` - UI component configuration
- `eslint.config.js` - Code linting configuration
- `jsconfig.json` - JavaScript project configuration

## 🚀 Deployment Methods

### Method 1: Git Repository (Recommended)

1. **Create a new Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Blueprint IT website"
   ```

2. **Push to GitHub/GitLab:**
   - Create a new repository on GitHub or GitLab
   - Follow their instructions to push your code

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub/GitLab account
   - Click "New Project"
   - Select your repository
   - Vercel will auto-detect React/Vite settings
   - Click "Deploy"

### Method 2: Direct Upload

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from this directory:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Login to your Vercel account
   - Configure project settings (defaults should work)
   - Deploy!

## ⚙️ Build Configuration

Vercel will automatically detect these settings:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🌐 Custom Domain Setup

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Click "Domains"
   - Add `blueprintit.ai` and `www.blueprintit.ai`

2. **Update DNS (Porkbun):**
   - **Root Domain (@)**: CNAME to your-project.vercel.app
   - **WWW Subdomain**: CNAME to your-project.vercel.app

## 🔧 Environment Variables (if needed)

If you need to add environment variables:
1. Go to Project Settings → Environment Variables
2. Add any required variables
3. Redeploy if necessary

## 📝 Project Details

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: pnpm (but npm/yarn also work)

## 🎯 Features Included

- ✅ Responsive design for all devices
- ✅ Contact form with industry dropdown
- ✅ Service cards with proper spacing
- ✅ AI automation section with centered layout
- ✅ Consistent typography across all sections
- ✅ Professional CNC manufacturing theme
- ✅ SEO-optimized structure

## 🔄 Making Updates

After deployment, you can update your site by:
1. Making changes to your code
2. Pushing to your Git repository
3. Vercel will automatically rebuild and deploy

## 📞 Support

If you encounter any issues during deployment:
1. Check Vercel's build logs for errors
2. Ensure all dependencies are properly listed in package.json
3. Verify that the build command works locally: `npm run build`

## 🎉 Success!

Once deployed, your website will be available at:
- Your Vercel URL (e.g., blueprint-it-xyz.vercel.app)
- Your custom domain (blueprintit.ai) after DNS propagation

---

**Note**: This website was created with Manus and optimized for Vercel deployment. All customizations and text edits have been preserved in this migration package.

