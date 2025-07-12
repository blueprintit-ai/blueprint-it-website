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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmissionState('submitting')
    
    try {
      const formElement = e.target
      const formData = new FormData(formElement)
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbxyXTP7zgR2KPlMjSJTAUBHAD-vuZgR8IKewKJDXzkr_HAAtt_weEAijX31zDmE1JHR/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      
      if (response.ok) {
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
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-blue-900/90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              IT Solutions for<br />
              <span className="text-blue-400">the Cabinetry & Manufacturing</span> Industry
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Specialized IT consulting and automation for cabinetry, millwork, and closet manufacturers. From proactively monitoring your critical workstations to implementing AI automations that save you time. We understand your business and what is important. Start with a free discovery call to blueprint your digital transformation journey.
            </p>          
            {/* Value Propositions */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
              <div className="flex items-center text-white">
                <CheckCircle className="text-green-400 mr-3" size={24} />
                <span className="text-lg font-semibold">STRATEGIC</span>
              </div>
              <div className="flex items-center text-white">
                <Lightbulb className="text-blue-400 mr-3" size={24} />
                <span className="text-lg font-semibold">INNOVATIVE</span>
              </div>
              <div className="flex items-center text-white">
                <Users className="text-orange-400 mr-3" size={24} />
                <span className="text-lg font-semibold">INDUSTRY EXPERTISE</span>
              </div>
            </div>

            <Button 
              onClick={() => scrollToSection('contact')} 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Schedule Your Free Discovery Call
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Information Technology Expertise + Industry Experience</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized solutions for cabinetry, millwork, and closet manufacturers who understand that downtime costs money
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1: IT Consulting */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Workstation Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Critical file backups for CNC applications, customer files, and manufacturing settings. Hot-swappable workstation 
                  configurations to minimize downtime. We understand that when your machines stop, your business stops - our solutions keep you running.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Service 2: Discovery Calls */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Technology Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Comprehensive evaluation of your shop technology infrastructure, connectivity, and backup systems. 
                  We assess your current vulnerabilities and provide recommendations to protect your critical data.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Service 3: AI Automation */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">AI Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Streamline your production workflows with intelligent automation. From AI powered customer response to inventory management, 
                  we develop custom solutions that integrate with your existing processes and systems.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Managed IT Services Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/30 to-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Managed IT Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Powered by our enterprise-grade platform, our system provides active monitoring, automated protection, and recovery options for your critical workstations.
            </p>
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg inline-block font-semibold text-lg">
              🎯 30-Day Free Trial - No Obligation
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">RMM Platform</CardTitle>
                <CardDescription className="text-blue-300 font-semibold">Remote Monitoring & Management</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Comprehensive monitoring and management of all your manufacturing workstations and servers. Real-time visibility into workstation health, automated patch management, and remote troubleshooting capabilities to minimize production downtime.
                </CardDescription>
                <div className="space-y-2 mb-6 mt-4">
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">24/7 Real-time Monitoring</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">Automated Patch Management</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">Secure Remote Access</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">Automated Self-Healing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cove Data Protection */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Cove Data Protection</CardTitle>
                <CardDescription className="text-green-300 font-semibold">Cloud-First Backup & Recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Advanced cloud backup solution protecting your critical workstations and data. TrueDelta technology enables backups every 15 minutes with 60x more efficiency than traditional methods, ensuring your data is always protected.
                </CardDescription>
                <div className="space-y-2 mb-6 mt-4">
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">15-Minute Backup Intervals</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">Ransomware Protection</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">Instant File Recovery</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">Workstation Backup and Restoration</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* N-able EDR */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white" size={32} />
                </div>
                <CardTitle className="text-white text-xl">EDR Platform</CardTitle>
                <CardDescription className="text-red-300 font-semibold">Endpoint Detection & Response</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  AI-powered endpoint security that goes beyond traditional antivirus. Behavioral threat detection, automated remediation, and rollback capabilities protect your workstations from advanced threats and ransomware attacks.
                </CardDescription>
                <div className="space-y-2 mb-6 mt-4">
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">AI Behavioral Detection</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">Automated Remediation</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">System Rollback</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">24/7 Threat Monitoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-slate-800/50 to-blue-900/50 rounded-2xl p-8 border border-blue-800/30">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Protect Your Shop?</h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Experience enterprise-grade IT management designed specifically for manufacturing environments. 
                Our enterprise-grade solutions ensure your workstations and critical data are always protected and accessible.
              </p>
            <div className="flex flex-col items-center gap-4">
              <Button 
                onClick={() => scrollToSection('contact')} 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Your Free 30-Day Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <div className="text-gray-400 text-sm text-center">
                No credit card required • Full access
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section id="about" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Our Approach */}
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Experience</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                As commercial cabinetry and closet manufacturers ourselves, we understand the unique IT challenges of the industry. From protecting critical applications to implementing time saving AI workflows, we've lived the pain points and are excited to share and continue to develop proven solutions for the industry.
              </p>
            </div>

            {/* Our Mission */}
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                To provide value to our industry. Most of us are small shops and we understand that building a business is hard. The cabinetry, millwork, and closet industry has welcomed us with open arms and we are grateful. We have the IT background and expertise to truly make a positive impact. The goal is simple; Save you time by helping you operate more efficiently and implement systems to keep your shop running.
              </p>
            </div>

            {/* Our Technology */}
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Technology</h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                We specialize in integrating modern IT solutions. Our technology platform automates critical patching and backups to keep you running. 
                Our custom AI solutions can help solve problems and maximize efficiency across all the various systems and processes within your business operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Automation Section */}
      <section className="py-20 bg-slate-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What do you mean by AI Automation?</h2>
            <p className="text-xl text-gray-300 text-center mb-8">Here's a real example of an AI automation we built for ourselves</p>
          </div>

          {/* Centered Image */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-800/30 max-w-2xl">
              <img 
                src={aiEmailWorkflowImage} 
                alt="AI Email Lead Responder Workflow" 
                className="w-full h-auto rounded-lg"
              />
              <p className="text-gray-400 text-sm text-center mt-4">Automated AI powered Email Lead Responder</p>
            </div>
          </div>

          {/* Centered Content */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg inline-block font-semibold text-xl mb-6">
                AI-Powered Email Lead Responder
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Never Miss Another Lead - Respond Professionally in Minutes, Not Hours</h3>
            </div>
            
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-blue-400 mb-4 text-center">How It Works</h4>
              <p className="text-gray-300 mb-4 text-center">When a potential customer fills out your contact form, our AI system immediately springs into action:</p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1 flex-shrink-0">1</div>
                    <div>
                      <h5 className="font-semibold text-white">Instant Lead Capture</h5>
                      <p className="text-gray-300 text-sm">The moment someone submits an inquiry through your website, the system captures their details and project requirements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1 flex-shrink-0">2</div>
                    <div>
                      <h5 className="font-semibold text-white">Smart Response Generation</h5>
                      <p className="text-gray-300 text-sm">Our AI analyzes their project description, budget, and timeline, then searches through your completed projects database to find similar work you've done.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1 flex-shrink-0">3</div>
                    <div>
                      <h5 className="font-semibold text-white">Human Review & Approval</h5>
                      <p className="text-gray-300 text-sm">Before any email is sent, you have the option to receive a notification with the proposed response. You can approve it as-is, request modifications, or decline.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1 flex-shrink-0">4</div>
                    <div>
                      <h5 className="font-semibold text-white">Professional Follow-Up</h5>
                      <p className="text-gray-300 text-sm">Once approved, the system sends a polished email to your prospect, complete with relevant project examples.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1 flex-shrink-0">5</div>
                    <div>
                      <h5 className="font-semibold text-white">Organized Lead Management</h5>
                      <p className="text-gray-300 text-sm">All leads are automatically organized in your database, with processed inquiries moved to a separate tracking sheet for follow-up.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-green-400 mb-4 text-center">What This Means for Your Business</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                    <span><strong>Save Hours Daily</strong> - No more manually responding to each inquiry or searching through old projects for examples.</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                    <span><strong>Respond While You Sleep</strong> - Leads can get professional responses within minutes, even when you're busy with installations or after hours. You set the rules of when responses are sent.</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                    <span><strong>Never Sound Unprepared</strong> - Every response can include relevant project examples that prove your capability to handle their specific needs.</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                    <span><strong>Higher Conversion Rates</strong> - Fast, professional responses with proof of your work convert more inquiries into consultations.</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                    <span><strong>Stay Organized</strong> - All leads automatically flow into your management system with instant Telegram notifications for urgent follow-ups.</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Technology Partners Section */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">AI & Productivity Partners</h2>
            <p className="text-gray-300">Leveraging cutting-edge AI automations to streamline your operations</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center">
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
                <form onSubmit={handleSubmit} className="space-y-6" data-netlify="true" name="contact-form" method="POST">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName" className="text-white mb-3 block">Company Name *</Label>
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
                      <Label htmlFor="industry" className="text-white mb-3 block">Industry</Label>
                      <Select onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="bg-white/10 border-gray-600 text-white">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential-cabinetry">Residential Cabinetry</SelectItem>
                          <SelectItem value="commercial-cabinetry">Commercial Cabinetry</SelectItem>
                          <SelectItem value="millwork">Millwork</SelectItem>
                          <SelectItem value="closets">Closets</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="industry" value={formData.industry} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white mb-3 block">First Name *</Label>
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
                      <Label htmlFor="lastName" className="text-white mb-3 block">Last Name *</Label>
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
                      <Label htmlFor="email" className="text-white mb-3 block">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white mb-3 block">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="challenges" className="text-white mb-3 block">Current IT Challenges</Label>
                    <Textarea
                      id="challenges"
                      name="challenges"
                      value={formData.challenges}
                      onChange={(e) => handleInputChange('challenges', e.target.value)}
                      className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                      placeholder="Describe your main technology pain points..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="goals" className="text-white mb-3 block">Goals & Objectives</Label>
                    <Textarea
                      id="goals"
                      name="goals"
                      value={formData.goals}
                      onChange={(e) => handleInputChange('goals', e.target.value)}
                      className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                      placeholder="What you hope to achieve..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3"
                    disabled={formSubmissionState === 'submitting'}
                  >
                    {formSubmissionState === 'submitting' ? 'Submitting...' : 'Schedule Free Discovery Call'}
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                  
                  {/* Form submission feedback */}
                  {formSubmissionState === 'success' && (
                    <div className="p-4 bg-green-600/20 border border-green-500 rounded-lg text-green-300">
                      <p className="font-semibold">Thank you for your interest!</p>
                      <p>We will contact you within 2 business hours to schedule your free discovery consultation.</p>
                    </div>
                  )}
                  
                  {formSubmissionState === 'error' && (
                    <div className="p-4 bg-red-600/20 border border-red-500 rounded-lg text-red-300">
                      <p className="font-semibold">Submission Error</p>
                      <p>There was an issue submitting your form. Please try again or contact us directly at <a href="mailto:info@BlueprintIT.ai" className="text-blue-300 hover:text-blue-200 underline">info@BlueprintIT.ai</a></p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <Mail className="mr-3 text-blue-400" size={20} />
                    <a href="mailto:info@BlueprintIT.ai" className="text-blue-300 hover:text-blue-200 underline">info@BlueprintIT.ai</a>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="mr-3 text-blue-400" size={20} />
                    <span>5101 Unicon Drive, Suite B - Wake Forest, NC</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="mr-3 text-blue-400" size={20} />
                    <span>Response within 1 business hour</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-blue-800/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Schedule your Discovery Call</h4>
                        <p className="text-gray-300 text-sm">Fill out the form and a link to our calendar will be emailed to you for scheduling</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Discovery Session</h4>
                        <p className="text-gray-300 text-sm">15-30 minute discovery consultation (no cost, no obligation)</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Recommendations</h4>
                        <p className="text-gray-300 text-sm">Recommendations and next steps provided in our discovery session</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-4">
              Blueprint<span className="text-orange-500">IT</span>
            </div>
            <p className="text-gray-400 mb-6">
              Strategic IT Solutions & AI Automation for Your Business
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 Blueprint IT. All rights reserved. | <a href="mailto:info@BlueprintIT.ai" className="text-blue-600 hover:text-blue-500 underline">info@BlueprintIT.ai</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
