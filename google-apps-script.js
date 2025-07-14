/**
 * Blueprint IT Contact Form Handler
 * Google Apps Script to handle form submissions
 * - Sends email notifications to Gmail
 * - Populates Google Sheet with form data
 * - Returns success/error responses to website
 */

// Configuration - UPDATE THESE VALUES
const CONFIG = {
  // Your Gmail address for notifications
  EMAIL_TO: 'info@BlueprintIT.ai',
  
  // Email subject line
  EMAIL_SUBJECT: 'New Contact Form Submission - Blueprint IT',
  
  // Google Sheet ID (get from URL after creating sheet)
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
  
  // Sheet name/tab
  SHEET_NAME: 'Form Submissions'
};

/**
 * Main function to handle POST requests from contact form
 */
function doPost(e) {
  try {
    // Parse form data
    const formData = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!formData.companyName || !formData.firstName || !formData.lastName || !formData.email) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Missing required fields'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Send email notification
    sendEmailNotification(formData);
    
    // Add to Google Sheet
    addToGoogleSheet(formData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Thank you for your interest! We will contact you soon.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'There was an error processing your request. Please try again or contact us directly.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Send email notification to Gmail
 */
function sendEmailNotification(formData) {
  const emailBody = `
New lead from Blueprint IT website:

Company Information:
• Company: ${formData.companyName}
• Industry: ${formData.industry || 'Not specified'}

Contact Information:
• Name: ${formData.firstName} ${formData.lastName}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}

Business Details:
• Current IT Challenges:
${formData.challenges || 'Not specified'}

• Goals & Objectives:
${formData.goals || 'Not specified'}

Submission Details:
• Date: ${new Date().toLocaleString()}
• Source: Blueprint IT Website Contact Form

---
This is an automated message from your website contact form.
  `;

  // Send email
  GmailApp.sendEmail(
    CONFIG.EMAIL_TO,
    CONFIG.EMAIL_SUBJECT,
    emailBody
  );
}

/**
 * Add form data to Google Sheet
 */
function addToGoogleSheet(formData) {
  try {
    // Open the Google Sheet
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    
    // Prepare row data
    const rowData = [
      new Date(), // Timestamp
      formData.companyName,
      formData.industry || '',
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone || '',
      formData.challenges || '',
      formData.goals || '',
      'New' // Status
    ];
    
    // Add row to sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 10);
    
  } catch (error) {
    console.error('Error adding to Google Sheet:', error);
    // Don't throw error - email notification should still work
  }
}

/**
 * Initialize Google Sheet with headers (run this once manually)
 */
function initializeGoogleSheet() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    
    // Clear existing content
    sheet.clear();
    
    // Add headers
    const headers = [
      'Timestamp',
      'Company Name',
      'Industry',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'IT Challenges',
      'Goals & Objectives',
      'Status'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Set column widths
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(2, 200); // Company Name
    sheet.setColumnWidth(3, 150); // Industry
    sheet.setColumnWidth(4, 120); // First Name
    sheet.setColumnWidth(5, 120); // Last Name
    sheet.setColumnWidth(6, 200); // Email
    sheet.setColumnWidth(7, 120); // Phone
    sheet.setColumnWidth(8, 300); // IT Challenges
    sheet.setColumnWidth(9, 300); // Goals & Objectives
    sheet.setColumnWidth(10, 100); // Status
    
    console.log('Google Sheet initialized successfully!');
    
  } catch (error) {
    console.error('Error initializing Google Sheet:', error);
  }
}

/**
 * Test function to verify everything works
 */
function testFormSubmission() {
  const testData = {
    companyName: 'Test Company',
    industry: 'Residential Cabinetry',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    phone: '555-123-4567',
    challenges: 'Testing the form submission system',
    goals: 'Verify that emails and Google Sheets integration work properly'
  };
  
  try {
    sendEmailNotification(testData);
    addToGoogleSheet(testData);
    console.log('Test submission completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

