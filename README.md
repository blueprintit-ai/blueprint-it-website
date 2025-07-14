# Blueprint IT Website - Latest Version with Vercel Forms

This is the complete, updated Blueprint IT website with **Vercel Forms integration** for contact form functionality.

## 🆕 **What's New in This Version**

- ✅ **Working Contact Form** with Vercel Forms integration
- ✅ **Form Validation** and user feedback
- ✅ **Email Notifications** (configure in Vercel dashboard)
- ✅ **Success/Error Messages** for better user experience
- ✅ **All Previous Customizations** preserved

## 🚀 **Quick Deployment to Vercel**

### **Method 1: GitHub Repository Update (Recommended)**

1. **Go to your existing GitHub repository**
2. **Delete all files** (see detailed instructions below)
3. **Upload all files from this package**
4. **Vercel will auto-deploy** the updated version

### **Method 2: New Repository**

1. **Create new GitHub repository**
2. **Upload all files from this package**
3. **Connect to your existing Vercel project**

## 📁 **Package Contents**

- **src/** - React components with Vercel Forms integration
- **public/** - All images and static assets
- **package.json** - Dependencies and scripts
- **vite.config.js** - Build configuration
- **index.html** - Main HTML file
- **tailwind.config.js** - Styling configuration
- **postcss.config.js** - CSS processing
- **eslint.config.js** - Code linting rules

## 🔧 **After Deployment**

### **Configure Email Notifications:**
1. **Vercel Dashboard** → **Your Project** → **Settings**
2. **Look for "Forms" or "Integrations"** section
3. **Set notification email** to: info@BlueprintIT.ai

### **Test the Form:**
1. **Visit your website**
2. **Fill out the contact form**
3. **Submit and verify** success message appears
4. **Check email** for form submission notification

## 📧 **Form Data You'll Receive**

- Company Name
- Industry (Residential Cabinetry, Commercial, etc.)
- Contact Person (First & Last Name)
- Email Address
- Phone Number
- Current IT Challenges
- Goals & Objectives
- Submission Timestamp

## 🎯 **Technical Details**

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Form Handling**: Vercel Forms (data-netlify="true")
- **Package Manager**: pnpm (but npm/yarn work too)

## 🔄 **DNS Configuration**

After deployment, update your DNS:

**For blueprintit.ai:**
- Type: CNAME | Host: @ | Target: your-vercel-url.vercel.app

**For www.blueprintit.ai:**
- Type: CNAME | Host: www | Target: your-vercel-url.vercel.app

## 💡 **Need Help?**

If you encounter any issues:
1. **Check Vercel deployment logs**
2. **Verify all files uploaded correctly**
3. **Test form functionality**
4. **Configure email notifications in Vercel dashboard**

Your website will be faster, more reliable, and now includes a fully functional contact form!

