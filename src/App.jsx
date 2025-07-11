// Replace your existing handleSubmit function with this corrected version:

const handleSubmit = async (e) => {
  e.preventDefault()
  setFormSubmissionState('submitting')
  
  try {
    // Method 1: Send as JSON (recommended)
    const submitData = {
      companyName: formData.companyName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      industry: formData.industry,
      challenges: formData.challenges,
      goals: formData.goals
    }
    
    console.log('Submitting form data:', submitData)
  
    const response = await fetch('https://script.google.com/macros/s/AKfycbxyXTP7zgR2KPlMjSJTAUBHAD-vuZgR8IKewKJDXzkr_HAAtt_weEAijX31zDmE1JHR/exec', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData)
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    
    const result = await response.json()
    console.log('Response data:', result)
    
    if (response.ok && result.success) {
      setFormSubmissionState('success')
      // Reset form
      setFormData({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        industry: '',
        companySize: '',
        challenges: '',
        goals: '',
        timeline: '',
        budget: '',
        consultationType: 'video'
      })
    } else {
      console.error('Server returned error:', result)
      setFormSubmissionState('error')
    }
  } catch (error) {
    console.error('Form submission error:', error)
    setFormSubmissionState('error')
  }
}

// ALTERNATIVE METHOD: If JSON doesn't work, try this FormData approach:
const handleSubmitFormData = async (e) => {
  e.preventDefault()
  setFormSubmissionState('submitting')
  
  try {
    const formDataToSend = new FormData()
    formDataToSend.append('companyName', formData.companyName)
    formDataToSend.append('firstName', formData.firstName)
    formDataToSend.append('lastName', formData.lastName)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('phone', formData.phone)
    formDataToSend.append('industry', formData.industry)
    formDataToSend.append('challenges', formData.challenges)
    formDataToSend.append('goals', formData.goals)
    
    console.log('Submitting form data (FormData):', Object.fromEntries(formDataToSend))
  
    const response = await fetch('https://script.google.com/macros/s/AKfycbxyXTP7zgR2KPlMjSJTAUBHAD-vuZgR8IKewKJDXzkr_HAAtt_weEAijX31zDmE1JHR/exec', {
      method: 'POST',
      body: formDataToSend // No headers needed with FormData
    })
    
    const result = await response.json()
    console.log('Response:', result)
    
    if (response.ok && result.success) {
      setFormSubmissionState('success')
      // Reset form...
    } else {
      setFormSubmissionState('error')
    }
  } catch (error) {
    console.error('Form submission error:', error)
    setFormSubmissionState('error')
  }
}
