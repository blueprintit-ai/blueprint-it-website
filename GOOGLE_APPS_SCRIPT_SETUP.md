# Google Apps Script Setup Guide
## Complete Lead Management System for Blueprint IT

This guide will help you set up a complete lead management system that:
- ✅ **Sends email notifications** to your Gmail
- ✅ **Populates a Google Sheet** with form data
- ✅ **Provides organized lead tracking**
- ✅ **Works 100% free** with Google's platform

---

## 📋 **Step 1: Create Google Sheet**

### **1.1 Create New Google Sheet**
1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **"+ Blank"** to create new sheet
3. **Rename** the sheet to "Blueprint IT Leads"
4. **Rename the tab** from "Sheet1" to "Form Submissions"

### **1.2 Get Sheet ID**
1. **Copy the URL** of your Google Sheet
2. **Extract the Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit#gid=0
   ```
3. **Save this ID** - you'll need it in Step 3

---

## 📋 **Step 2: Create Google Apps Script**

### **2.1 Open Google Apps Script**
1. Go to [script.google.com](https://script.google.com)
2. Click **"+ New project"**
3. **Rename** the project to "Blueprint IT Form Handler"

### **2.2 Replace Default Code**
1. **Delete** all existing code in the editor
2. **Copy and paste** the entire contents of `google-apps-script.js` (included in this package)
3. **Save** the project (Ctrl+S or Cmd+S)

### **2.3 Configure Settings**
In the script, update the `CONFIG` section:

```javascript
const CONFIG = {
  // Your Gmail address for notifications
  EMAIL_TO: 'info@BlueprintIT.ai',
  
  // Email subject line
  EMAIL_SUBJECT: 'New Contact Form Submission - Blueprint IT',
  
  // Google Sheet ID (from Step 1.2)
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
  
  // Sheet name/tab
  SHEET_NAME: 'Form Submissions'
};
```

**Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID from Step 1.2**

---

## 📋 **Step 3: Initialize Google Sheet**

### **3.1 Run Initialization Function**
1. In Google Apps Script, **select function** `initializeGoogleSheet` from dropdown
2. Click **"Run"** button
3. **Grant permissions** when prompted:
   - Click **"Review permissions"**
   - Choose your Google account
   - Click **"Advanced"** → **"Go to Blueprint IT Form Handler (unsafe)"**
   - Click **"Allow"**

### **3.2 Verify Sheet Setup**
1. **Go back to your Google Sheet**
2. **Refresh the page**
3. **Verify** you see these column headers:
   - Timestamp
   - Company Name
   - Industry
   - First Name
   - Last Name
   - Email
   - Phone
   - IT Challenges
   - Goals & Objectives
   - Status

---

## 📋 **Step 4: Deploy Google Apps Script**

### **4.1 Deploy as Web App**
1. In Google Apps Script, click **"Deploy"** → **"New deployment"**
2. **Click gear icon** next to "Type" and select **"Web app"**
3. **Configure deployment:**
   - **Description:** "Blueprint IT Contact Form Handler"
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
4. Click **"Deploy"**

### **4.2 Get Web App URL**
1. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)
2. **Save this URL** - you'll need it in Step 5

---

## 📋 **Step 5: Update Website Code**

### **5.1 Update Form Submission URL**
1. **Open** `src/App.jsx` in your website files
2. **Find line 74** with: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'`
3. **Replace** `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL from Step 4.2
4. **Save** the file

### **5.2 Deploy Updated Website**
1. **Upload updated files** to your GitHub repository
2. **Vercel will automatically** redeploy your website
3. **Wait for deployment** to complete

---

## 📋 **Step 6: Test the System**

### **6.1 Test Google Apps Script**
1. In Google Apps Script, **select function** `testFormSubmission` from dropdown
2. Click **"Run"** button
3. **Check your Gmail** for test email
4. **Check your Google Sheet** for test row

### **6.2 Test Website Form**
1. **Go to your website**
2. **Fill out the contact form** with test data
3. **Submit the form**
4. **Verify:**
   - Success message appears on website
   - Email received in Gmail
   - New row added to Google Sheet

---

## 🎯 **What You'll Get**

### **📧 Email Notifications**
Every form submission sends an email to `info@BlueprintIT.ai` with:
- Company and contact information
- Industry and business details
- IT challenges and goals
- Submission timestamp

### **📊 Google Sheet Data**
Every submission creates a new row with:
- Automatic timestamp
- All form fields organized in columns
- "Status" column for lead tracking
- Professional formatting

### **🔄 Lead Management Workflow**
1. **Form submitted** → **Email notification** + **Sheet row**
2. **Review lead** in Google Sheet
3. **Update status** (New → Contacted → Qualified → Closed)
4. **Add notes** for follow-up
5. **Track progress** and analyze data

---

## 🛠️ **Troubleshooting**

### **Common Issues:**

**❌ "Script function not found"**
- Make sure you copied the entire script code
- Verify function names are correct
- Save the script before running

**❌ "Permission denied"**
- Re-run the authorization process
- Make sure you granted all permissions
- Try running `initializeGoogleSheet` again

**❌ "Sheet not found"**
- Verify Sheet ID is correct
- Make sure sheet tab is named "Form Submissions"
- Check that sheet is accessible

**❌ "Form submission fails"**
- Verify Web App URL is correct in website code
- Make sure deployment is set to "Anyone" access
- Check browser console for error messages

### **Testing Commands:**

**Test Email Only:**
```javascript
// In Google Apps Script console
sendEmailNotification({
  companyName: 'Test Company',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com'
})
```

**Test Sheet Only:**
```javascript
// In Google Apps Script console
addToGoogleSheet({
  companyName: 'Test Company',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com'
})
```

---

## 🎉 **Success Checklist**

- ✅ Google Sheet created with proper headers
- ✅ Google Apps Script deployed as web app
- ✅ Website updated with correct script URL
- ✅ Test email received in Gmail
- ✅ Test data appears in Google Sheet
- ✅ Website form shows success message
- ✅ Real form submissions work end-to-end

---

## 📞 **Need Help?**

If you encounter any issues:
1. **Check each step** carefully
2. **Verify all URLs and IDs** are correct
3. **Test each component** individually
4. **Check browser console** for error messages

**Your complete lead management system will be ready once all steps are completed!** 🚀

