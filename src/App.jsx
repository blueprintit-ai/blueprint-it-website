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
  Lock
} from 'lucide-react'
import './App.css'

// Import images
import heroImage from './assets/images/cnc-manufacturing-bg.jpg'
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
    challenges: '',
    goals: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmissionState('submitting')
    
    try {
      // Replace with your Google Apps Script URL after deployment
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyi7-hDfiz9H12t8irp6AURiCNL1FLiBCvoV0mUJNjWuF0EuD8_XB8eZS2TIRUl81b6/exec'
      
      // Prepare form data for Google Apps Script
      const submissionData = {
        companyName: formData.companyName,
        industry: formData.industry,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        challenges: formData.challenges,
        goals: formData.goals
      }
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setFormSubmissionState('success')
        // Reset form
        setFormData({
          companyName: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          industry: '',
          challenges: '',
          goals: ''
        })
      } else {
        setFormSubmissionState('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormSubmissionState('error')
    }
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
                Blueprint<span className="text-blue-400">IT</span>
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
                <button onClick={() => scrollToSection('automation')} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  AI Automation
                </button>
                <button onClick={() => scrollToSection('contact')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Schedule Free Discovery Call
                </button>
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
              <button onClick={() => scrollToSection('automation')} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                AI Automation
              </button>
              <button onClick={() => scrollToSection('contact')} className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                Schedule Free Discovery Call
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            IT Solutions for the <span className="text-blue-400">Cabinetry & Manufacturing</span> Industry
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Specialized IT support and strategic technology solutions designed specifically for cabinet shops, 
            millwork companies, and manufacturing businesses - proactively monitoring your critical workstations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection('contact')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Schedule Free Discovery Call
            </Button>
            <Button 
              onClick={() => scrollToSection('services')} 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Information Technology Expertise</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Comprehensive IT solutions tailored for the unique challenges of cabinetry and manufacturing businesses. 
              From design software optimization to production workflow automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <Monitor className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Design Software Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Expert support for CAD software, CNC programming tools, and design applications critical to your manufacturing process.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <Database className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Data Protection & Backup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Secure your valuable design files, customer data, and business records with enterprise-grade backup and recovery options.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <Server className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Network Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Reliable network solutions to connect your design stations, CNC machines, and office systems seamlessly.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Cybersecurity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Protect your business from cyber threats with comprehensive security solutions designed for manufacturing environments.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <Settings className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">System Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Optimize your workstations and servers for peak performance with design software and manufacturing applications.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Strategic IT Consulting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Technology planning and implementation guidance to help your business grow and stay competitive.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Managed IT Services Section */}
      <section className="py-20 bg-slate-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Managed IT Services</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Proactive IT management to keep your business running smoothly. Our comprehensive monitoring and 
              maintenance services ensure your technology supports your productivity, not hinders it.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30">
              <CardHeader>
                <Eye className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white text-xl">RMM Platform</CardTitle>
                <CardDescription className="text-gray-300">
                  24/7 monitoring and management of your IT infrastructure through our enterprise-grade platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Continuous monitoring of workstation health, server performance, and network connectivity to prevent issues before they impact your business.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Real-time system monitoring</span>
                  </li>
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Automated patch management</span>
                  </li>
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Performance optimization</span>
                  </li>
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Proactive issue resolution</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30">
              <CardHeader>
                <Database className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white text-xl">Cove Data Protection</CardTitle>
                <CardDescription className="text-gray-300">
                  Enterprise-grade backup and disaster recovery to protect your critical workstations and data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Comprehensive backup solution with multiple recovery options to ensure your design files, customer data, and business records are always protected.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Automated daily backups</span>
                  </li>
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Cloud and local storage options</span>
                  </li>
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Rapid file recovery</span>
                  </li>
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Disaster recovery planning</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white text-xl">EDR Platform</CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced endpoint detection and response to protect against modern cyber threats.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Next-generation cybersecurity that goes beyond traditional antivirus to detect, investigate, and respond to advanced threats in real-time.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Real-time threat detection</span>
                  </li>
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Behavioral analysis</span>
                  </li>
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Automated threat response</span>
                  </li>
                  <li className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-gray-300">Forensic investigation tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Protect Your Shop?</h3>
            <p className="text-gray-300 mb-6">
              Get comprehensive IT protection and support tailored for your manufacturing business.
            </p>
            <Button 
              onClick={() => scrollToSection('contact')} 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              Schedule Free Discovery Call
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <img src={consultingImage} alt="Professional IT Consulting" className="w-full h-64 object-cover rounded-lg mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Experience</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                With decades of combined experience in both IT and manufacturing, we understand the unique technology challenges facing cabinet shops and millwork companies. Our team has worked with businesses ranging from small custom shops to large-scale manufacturing operations.
              </p>
            </div>
            
            <div className="text-center">
              <img src={aiBusinessImage} alt="Business Technology Solutions" className="w-full h-64 object-cover rounded-lg mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                We believe technology should empower your craftsmanship, not complicate it. Our mission is to provide reliable, efficient IT solutions that let you focus on what you do best - creating exceptional cabinetry and millwork while growing your business.
              </p>
            </div>
            
            <div className="text-center">
              <img src={techInnovationImage} alt="Technology Innovation" className="w-full h-64 object-cover rounded-lg mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Technology</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                We leverage cutting-edge tools and industry best practices to deliver enterprise-level IT services. From cloud solutions to advanced monitoring systems, we use proven technologies that scale with your business growth and evolving needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Automation Section */}
      <section id="automation" className="py-20 bg-slate-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What do you mean by AI Automation?</h2>
            <p className="text-xl text-gray-300 text-center mb-8">Here's a real example of an AI automation we built for ourselves</p>
            
            {/* Centered Image */}
            <div className="flex justify-center mb-12">
              <div className="max-w-4xl">
                <img 
                  src={aiEmailWorkflowImage} 
                  alt="AI Email Workflow Automation" 
                  className="w-full h-auto rounded-lg shadow-2xl border border-blue-800/30 bg-white/10 backdrop-blur-sm p-4"
                />
              </div>
            </div>
            
            {/* Centered Content */}
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-12">
                <div className="flex items-center justify-center mb-4">
                  <Mail className="h-16 w-16 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">AI-Powered Email Lead Responder</h3>
                <p className="text-xl text-blue-400 mb-6">Never Miss Another Lead</p>
                
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-green-400 mb-4 text-center">How It Works</h4>
                  <p className="text-gray-300 mb-6 text-center">
                    When a potential customer emails us, our AI system automatically analyzes their message, understands their needs, 
                    and sends a personalized response within minutes - even when we're busy or after hours.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-green-400 mb-4 text-center">What This Means for Your Business</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                      <Clock className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <h5 className="font-semibold text-white mb-2">Save Hours Daily</h5>
                      <p className="text-gray-300 text-sm">Automate repetitive email responses and lead qualification</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                      <Zap className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <h5 className="font-semibold text-white mb-2">Leads can get</h5>
                      <p className="text-gray-300 text-sm">Instant responses increase conversion rates and customer satisfaction</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                      <Settings className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <h5 className="font-semibold text-white mb-2">You set the rules</h5>
                      <p className="text-gray-300 text-sm">Customize responses and escalation rules to match your business</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI & Productivity Partners */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">AI & Productivity Partners</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We partner with leading AI and automation platforms to bring you custom AI automations to streamline your operations, 
              improve customer communication, and boost productivity.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/15 transition-all duration-300">
              <img src={airtableLogo} alt="Airtable" className="h-12 w-auto mx-auto mb-2 object-contain filter brightness-0 invert" />
              <div className="text-gray-400 text-xs">Database & CRM</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/15 transition-all duration-300">
              <img src={n8nLogo} alt="n8n" className="h-12 w-auto mx-auto mb-2 object-contain filter brightness-0 invert" />
              <div className="text-gray-400 text-xs">Automation</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/15 transition-all duration-300">
              <img src={anthropicLogo} alt="Anthropic" className="h-12 w-auto mx-auto mb-2 object-contain filter brightness-0 invert" />
              <div className="text-gray-400 text-xs">AI Platform</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/15 transition-all duration-300">
              <img src={geminiLogo} alt="Google Gemini" className="h-12 w-auto mx-auto mb-2 object-contain filter brightness-0 invert" />
              <div className="text-gray-400 text-xs">AI & Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Schedule Your Free Discovery Call</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Take the first step toward strategic IT transformation. Our free discovery consultation provides immediate insights 
              and actionable recommendations with no obligation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Schedule Your Consultation</CardTitle>
                <CardDescription className="text-gray-300">
                  Fill out the form below and we'll contact you within 2 business hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName" className="text-white">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                        placeholder="Your company name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry" className="text-white">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="bg-white/10 border-gray-600 text-white">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential-cabinetry">Residential Cabinetry</SelectItem>
                          <SelectItem value="commercial-cabinetry">Commercial Cabinetry</SelectItem>
                          <SelectItem value="custom-millwork">Custom Millwork</SelectItem>
                          <SelectItem value="furniture-manufacturing">Furniture Manufacturing</SelectItem>
                          <SelectItem value="architectural-millwork">Architectural Millwork</SelectItem>
                          <SelectItem value="other-manufacturing">Other Manufacturing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                        placeholder="Your first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                        placeholder="Your last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-white">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="challenges" className="text-white">Current IT Challenges</Label>
                    <Textarea
                      id="challenges"
                      name="challenges"
                      value={formData.challenges}
                      onChange={(e) => handleInputChange('challenges', e.target.value)}
                      className="bg-white/10 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                      placeholder="Describe your current IT challenges, pain points, or areas where you need support..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="goals" className="text-white">Goals & Objectives</Label>
                    <Textarea
                      id="goals"
                      name="goals"
                      value={formData.goals}
                      onChange={(e) => handleInputChange('goals', e.target.value)}
                      className="bg-white/10 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                      placeholder="What are your technology goals? What would you like to achieve with better IT support?"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                    disabled={formSubmissionState === 'submitting'}
                  >
                    {formSubmissionState === 'submitting' ? 'Submitting...' : 'Schedule Free Discovery Call'}
                  </Button>

                  {formSubmissionState === 'success' && (
                    <div className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                      <p className="text-green-400 text-center">
                        Thank you for your interest! We will contact you within 2 business hours to schedule your free discovery call.
                      </p>
                    </div>
                  )}

                  {formSubmissionState === 'error' && (
                    <div className="p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                      <p className="text-red-400 text-center">
                        There was an error submitting your form. Please try again or contact us directly at info@BlueprintIT.ai
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <Phone className="h-6 w-6 mr-3 text-blue-400" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-blue-400" />
                    <span className="text-gray-300">info@BlueprintIT.ai</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                    <span className="text-gray-300">Wake Forest, NC</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-blue-400" />
                    <span className="text-gray-300">Monday - Friday: 8:00 AM - 6:00 PM EST</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">What to Expect</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-400 mt-0.5" />
                      <span className="text-gray-300">30-minute consultation to understand your business needs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-400 mt-0.5" />
                      <span className="text-gray-300">Assessment of your current IT infrastructure</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-400 mt-0.5" />
                      <span className="text-gray-300">Customized recommendations for your industry</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-400 mt-0.5" />
                      <span className="text-gray-300">No obligation proposal with transparent pricing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-blue-800/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                Blueprint<span className="text-blue-400">IT</span>
              </div>
              <p className="text-gray-300">
                Specialized IT solutions for the cabinetry and manufacturing industry. 
                Technology that empowers your craftsmanship.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Managed IT Services</li>
                <li>Cybersecurity</li>
                <li>Data Backup & Recovery</li>
                <li>Network Infrastructure</li>
                <li>AI Automation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-300">
                <p>info@BlueprintIT.ai</p>
                <p>Wake Forest, NC</p>
                <p>Monday - Friday: 8:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800/30 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Blueprint IT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

