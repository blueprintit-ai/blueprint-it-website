import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Brain, 
  Lightbulb, 
  Users, 
  Phone, 
  Settings, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Menu,
  X,
  Mail,
  MapPin,
  Clock,
  Shield,
  Monitor,
  Database,
  Server,
  Eye,
  Lock,
  Globe
} from 'lucide-react'
import './App.css'

// Import images
import heroImage from './assets/images/AICarpenter.jpg'
import aiBusinessImage from './assets/images/ai_business.jpg'
import aiWorkflowImage from './assets/images/ai_workflow.jpg'
import consultingImage from './assets/images/consulting_professional.png'
import techInnovationImage from './assets/images/technology_innovation.jpg'
import aiEmailWorkflowImage from './assets/images/ai-email-workflow.png'

// Import partner logos
import airtableLogo from './assets/images/airtable-logo.png'
import n8nLogo from './assets/images/n8n-logo.png'
import anthropicLogo from './assets/images/anthropic-logo.png'
import geminiLogo from './assets/images/gemini-logo.png'
import perplexityLogo from './assets/images/perplexity-logo.webp'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formSubmissionState, setFormSubmissionState] = useState('idle') // 'idle', 'submitting', 'success', 'error'
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // SIMPLE IFRAME FORM SUBMISSION - BYPASSES ALL CORS ISSUES
  const handleSubmit = (e) => {
    e.preventDefault()
    setFormSubmissionState('submitting')
    
    // Create hidden iframe for form submission
    const iframe = document.createElement('iframe')
    iframe.name = 'hidden-iframe'
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    
    // Create form
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'https://script.google.com/macros/s/AKfycbxyXTP7zgR2KPlMjSJTAUBHAD-vuZgR8IKewKJDXzkr_HAAtt_weEAijX31zDmE1JHR/exec'
    form.target = 'hidden-iframe'
    
    // Add form data as hidden inputs
    const fields = {
      companyName: formData.companyName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      industry: formData.industry,
      challenges: formData.challenges,
      goals: formData.goals
    }
    
    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value || ''
      form.appendChild(input)
    })
    
    // Submit form
    document.body.appendChild(form)
    form.submit()
    
    console.log('Form submitted via iframe - no CORS issues!')
    
    // Show success after a delay (since we can't read the response due to CORS)
    setTimeout(() => {
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
      
      // Cleanup
      if (document.body.contains(form)) document.body.removeChild(form)
      if (document.body.contains(iframe)) document.body.removeChild(iframe)
    }, 2000) // 2 second delay to allow submission to complete
  }

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-blue-800/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white">
                Blueprint<span className="text-orange-500">IT</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Services
                </button>
                <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  About
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Contact
                </button>
                <Button onClick={() => scrollToSection('contact')} className="bg-orange-600 hover:bg-orange-700 text-white">
                  Free Discovery Call
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900/95 backdrop-blur-sm">
              <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                Services
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                About
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                Contact
              </button>
              <Button onClick={() => scrollToSection('contact')} className="bg-orange-600 hover:bg-orange-700 text-white w-full mt-2">
                Free Discovery Call
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {/* ... unchanged hero section code ... */}

      {/* Services Section */}
      {/* ... unchanged services section code ... */}

      {/* Managed IT Services Section */}
      {/* ... unchanged managed IT section code ... */}

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/30">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Our Experience</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto text-left">
                Drawing from our direct experience working with small businesses across various industries, we understand the unique IT challenges facing growing companies. From safeguarding mission-critical applications to implementing time-saving AI workflows, we've experienced these pain points firsthand and are passionate about developing proven solutions that make a real difference.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/30">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Our Mission</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto text-left">
                To provide real value to small businesses everywhere. As fellow business owners, we understand the challenges of building and growing a business in today's competitive landscape. The small business community has welcomed us with open arms, and we're committed to giving back through our IT expertise. Our goal is simple: save you time, boost efficiency, and implement systems that keep your business running smoothly — so you can focus on what you do best.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/30">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Our Technology</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto text-left">
                We specialize in integrating modern IT solutions tailored for small businesses. Our technology platform automates critical patching and backups to keep you running. Our custom AI solutions can help solve problems and maximize efficiency across all the various systems and processes within your business operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Remaining sections (AI Automation, Partners, Contact, etc.) */}
      {/* ... unchanged code ... */}
    </div>
  )
}

export default App
