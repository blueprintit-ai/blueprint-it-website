import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import {
  ArrowRight,
  Check,
  MapPin,
  Clock,
  Mail,
} from 'lucide-react'
import '../App.css'
import { SectionTag, RegMark, Plate } from '@/components/blueprint.jsx'
import SiteNav from '@/components/SiteNav.jsx'
import SiteFooter from '@/components/SiteFooter.jsx'

// Assets
import aiEmailWorkflowImage from '../assets/images/ai-email-workflow.png'
import airtableLogo from '../assets/images/airtable-logo.png'
import n8nLogo from '../assets/images/n8n-logo.png'
import anthropicLogo from '../assets/images/anthropic-logo.png'
import geminiLogo from '../assets/images/gemini-logo.png'

// -----------------------------------------------------------------------------

function Home() {
  const [formSubmissionState, setFormSubmissionState] = useState('idle')
  const thankYouRef = useRef(null)
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
    consultationType: 'video',
  })

  useEffect(() => {
    if (formSubmissionState !== 'success') return
    const id = requestAnimationFrame(() => {
      thankYouRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, [formSubmissionState])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Iframe-based form submission — bypasses CORS, stays inline (no popup)
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
    form.action =
      'https://script.google.com/macros/s/AKfycbx7zmF1s-Zai8dw75o9URi43m-J-_aOHAWZPco1cPnmlljFh5gt0TuiE41eVaeLqDyM/exec'
    form.target = 'hidden-iframe'

    const fields = {
      companyName: formData.companyName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      industry: formData.industry,
      challenges: formData.challenges,
      goals: formData.goals,
    }

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value || ''
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()

    setFormSubmissionState('success')
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
      consultationType: 'video',
    })

    // Clean up hidden DOM nodes shortly after submit; keep success state
    // visible so the inline thank-you panel stays until the page is reloaded.
    setTimeout(() => {
      if (document.body.contains(form)) document.body.removeChild(form)
      if (document.body.contains(iframe)) document.body.removeChild(iframe)
    }, 2000)
  }

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Services after removing System Monitoring
  const services = [
    {
      id: '01',
      title: 'Technology Assessment',
      tag: 'Diagnostic',
      body: 'A structured, end-to-end audit of your infrastructure, connectivity, backups, and workflows. You receive a documented schematic of where your business stands — and a prioritized path forward.',
      deliverables: [
        'Infrastructure audit',
        'Vulnerability review',
        'Resilience plan',
      ],
      accent: 'cyan',
    },
    {
      id: '02',
      title: 'AI Automation',
      tag: 'Systems of Work',
      body: 'Custom automations that slot into the tools you already use. We design, build, and maintain intelligent workflows — from inbox triage to proposal generation — so your team reclaims hours per week.',
      deliverables: [
        'Lead & inbox automation',
        'Process orchestration',
        'Custom AI agents',
      ],
      accent: 'rust',
    },
    {
      id: '03',
      title: 'Website Development',
      tag: 'Presentation Layer',
      body: 'Distinctive, fast, conversion-focused websites built specifically for small businesses. Portfolio galleries, lead capture, and the polish of a brand that takes itself seriously.',
      deliverables: [
        'Custom design system',
        'Lead capture & CRM',
        'Mobile-first build',
      ],
      accent: 'cyan',
    },
  ]

  const about = [
    {
      id: '01',
      title: 'Experience',
      body: 'We\'ve worked directly inside growing small businesses, felt the pain of brittle tools, and learned what separates infrastructure that supports growth from infrastructure that quietly drags it down. That perspective is in every recommendation we make.',
    },
    {
      id: '02',
      title: 'Mission',
      body: 'Deliver real, measurable value — not retainers-for-retainers. As fellow business owners, we treat every engagement like it\'s our own shop: save time, add leverage, install systems that keep running without constant attention.',
    },
    {
      id: '03',
      title: 'Technology',
      body: 'We specialize in integrating modern AI tooling with the everyday systems small businesses already rely on. The result is less manual work, fewer dropped balls, and infrastructure that scales with the business instead of against it.',
    },
  ]

  const steps = [
    {
      n: '01',
      title: 'Instant Lead Capture',
      body: 'The moment someone submits an inquiry through your website, the system captures their details and project requirements.',
    },
    {
      n: '02',
      title: 'Smart Response Generation',
      body: 'Our AI analyzes their project description, budget, and timeline, then searches your completed-projects database to surface the most relevant prior work.',
    },
    {
      n: '03',
      title: 'Human Review & Approval',
      body: 'Before any email is sent, you can receive a notification with the proposed response. Approve as-is, request modifications, or decline.',
    },
    {
      n: '04',
      title: 'Professional Follow-Up',
      body: 'Once approved, the system sends a polished email to your prospect — complete with relevant project examples.',
    },
    {
      n: '05',
      title: 'Organized Lead Management',
      body: 'All leads are automatically organized in your database, with processed inquiries moved to a separate tracking sheet for follow-up.',
    },
  ]

  const outcomes = [
    {
      label: 'Save Hours Daily',
      body: 'No more manually responding to each inquiry or digging through old projects for examples.',
    },
    {
      label: 'Respond While You Sleep',
      body: 'Leads get professional responses within minutes, on your schedule — even after hours.',
    },
    {
      label: 'Never Sound Unprepared',
      body: 'Every response can include relevant project examples that prove your capability.',
    },
    {
      label: 'Higher Conversion Rates',
      body: 'Fast, professional responses with proof of work convert more inquiries into consultations.',
    },
    {
      label: 'Stay Organized',
      body: 'All leads flow into your management system with instant Telegram notifications for urgent follow-ups.',
    },
  ]

  const partners = [
    { logo: airtableLogo, name: 'Airtable', caption: 'Database / CRM' },
    { logo: n8nLogo, name: 'n8n', caption: 'Automation' },
    { logo: anthropicLogo, name: 'Anthropic', caption: 'AI Platform' },
    { logo: geminiLogo, name: 'Google Gemini', caption: 'AI & Analytics' },
  ]

  const tickerWords = [
    'AI AUTOMATION',
    'TECHNOLOGY ASSESSMENT',
    'WEBSITE DEVELOPMENT',
    'LEAD WORKFLOWS',
    'PROCESS DESIGN',
    'SMALL BUSINESS',
  ]

  return (
    <div className="bp-grid bp-grain min-h-screen text-[color:var(--ink)]">
      {/* =========================================================
          NAV
      ==========================================================*/}
      <SiteNav
        ctaLabel="Discovery Call"
        onCtaClick={() => scrollToSection('contact')}
        navItems={[
          { kind: 'button', label: 'Services', onClick: () => scrollToSection('services') },
          { kind: 'button', label: 'Studio', onClick: () => scrollToSection('about') },
          { kind: 'button', label: 'Case', onClick: () => scrollToSection('workflow') },
          { kind: 'button', label: 'Contact', onClick: () => scrollToSection('contact') },
        ]}
      />

      {/* =========================================================
          HERO
      ==========================================================*/}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-14 md:pt-24 pb-20 md:pb-32">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <SectionTag id="00">Drawing № 01 · Introduction</SectionTag>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className="font-display mt-8 text-[clamp(2.6rem,8vw,7.2rem)] leading-[0.92] tracking-[-0.03em] text-[color:var(--ink)]"
              >
                Schematics for the{' '}
                <span className="font-display-italic text-[color:var(--cyan)]">
                  AI‑native
                </span>
                <br />
                business.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="mt-8 max-w-2xl text-lg md:text-xl leading-[1.55] text-[color:var(--ink-soft)]"
              >
                Blueprint IT designs precise, production‑grade systems for
                growing small businesses. We pair focused IT consulting with
                custom AI automation — so your team spends more time on the
                work that matters and less on the work that shouldn&apos;t exist.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-5"
              >
                <button
                  onClick={() => scrollToSection('contact')}
                  className="btn-ink"
                >
                  Schedule Discovery Call
                  <ArrowRight size={14} strokeWidth={2.2} />
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] transition-colors underline-offset-[6px] hover:underline"
                >
                  ↓ View the drawing set
                </button>
              </motion.div>
            </div>

            {/* Right spec plate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="md:col-span-4"
            >
              <Plate accent="cyan">
                <div className="label label-cyan mb-4">Spec sheet</div>
                <dl className="divide-y divide-[color:var(--paper-line)] font-mono text-xs">
                  {[
                    ['Practice', 'IT Consulting + AI'],
                    ['Client Size', '1–50 staff'],
                    ['Locale', 'Wake Forest, NC'],
                    ['Stack', 'Custom · Open tools'],
                    ['Response', '< 1 business hr'],
                    ['Obligation', 'None'],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between py-2.5"
                    >
                      <dt className="uppercase tracking-[0.14em] text-[color:var(--ink-mute)]">
                        {k}
                      </dt>
                      <dd className="text-[color:var(--ink)] font-medium">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Plate>
            </motion.div>
          </div>

          {/* Value props row */}
          <div className="mt-16 md:mt-24 border-t border-[color:var(--ink)]">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[color:var(--paper-line)]">
              {[
                [
                  'STR / 01',
                  'Strategic',
                  'Every recommendation tied to a business outcome, not a feature list.',
                ],
                [
                  'INV / 02',
                  'Innovative',
                  'Selecting the sharpest tool for the job — even when it\'s new.',
                ],
                [
                  'FOC / 03',
                  'Business-focused',
                  'We speak small-business. Margins, speed, and trust, first.',
                ],
              ].map(([tag, head, body]) => (
                <div key={tag} className="p-6 md:p-8">
                  <div className="label label-cyan">{tag}</div>
                  <div className="font-display text-3xl md:text-4xl mt-3">
                    {head}
                  </div>
                  <p className="mt-3 text-[color:var(--ink-soft)] max-w-xs">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee ticker */}
        <div className="border-y border-[color:var(--ink)] bg-[color:var(--ink)] text-[color:var(--paper)] overflow-hidden">
          <div className="py-3">
            <div className="bp-ticker font-mono text-[12px] uppercase tracking-[0.35em]">
              {[...tickerWords, ...tickerWords, ...tickerWords].map((w, i) => (
                <span key={i} className="flex items-center gap-12">
                  <span>✦</span>
                  <span>{w}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ==========================================================*/}
      <section id="services" className="relative">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
            <div className="md:col-span-5">
              <SectionTag id="01">Drawing № 02 · Services</SectionTag>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
                Three practices,{' '}
                <span className="font-display-italic text-[color:var(--rust)]">
                  one drafting table.
                </span>
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 md:pt-8">
              <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
                We stay narrow on purpose. Three disciplines, all sharpened by
                the same operating principle: the smallest intervention that
                moves the business forward.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="h-full"
              >
                <Plate accent={s.accent} className="h-full flex flex-col">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-display text-5xl leading-none text-[color:var(--ink)]">
                      {s.id}
                    </span>
                    <span
                      className={`label ${
                        s.accent === 'rust' ? 'label-rust' : 'label-cyan'
                      }`}
                    >
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-[2rem] leading-[1.05] tracking-[-0.015em] mb-4">
                    {s.title}
                  </h3>
                  <p className="text-[color:var(--ink-soft)] leading-relaxed mb-6 flex-1">
                    {s.body}
                  </p>
                  <div className="pt-5 border-t border-[color:var(--paper-line)] space-y-2 mt-auto">
                    {s.deliverables.map((d) => (
                      <div
                        key={d}
                        className="flex items-center gap-3 font-mono text-[12px]"
                      >
                        <span
                          className={`inline-block h-1.5 w-4 ${
                            s.accent === 'rust'
                              ? 'bg-[color:var(--rust)]'
                              : 'bg-[color:var(--cyan)]'
                          }`}
                        />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </Plate>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          STUDIO / ABOUT
      ==========================================================*/}
      <section id="about" className="relative bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-5">
              <SectionTag id="02">Drawing № 03 · Studio</SectionTag>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
                Small operation.{' '}
                <span className="font-display-italic">Senior hands.</span>
              </h2>
              <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed text-lg">
                Blueprint IT is a boutique practice. You talk to the people
                doing the work. No layered account managers, no handoffs, no
                ticketing mazes — just direct work with practitioners who&apos;ve
                been inside businesses like yours.
              </p>

              <div className="mt-10 border-t border-[color:var(--ink)]">
                <dl className="divide-y divide-[color:var(--paper-line)]">
                  {[
                    ['Based', 'Wake Forest, NC'],
                    ['Engagement', 'Fractional + project'],
                    ['First step', 'Free discovery call'],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between py-4 font-mono text-sm"
                    >
                      <dt className="uppercase tracking-[0.14em] text-[color:var(--ink-mute)]">
                        {k}
                      </dt>
                      <dd className="text-[color:var(--ink)]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="md:col-span-7 md:col-start-6 space-y-5">
              {about.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="grid grid-cols-12 gap-4 md:gap-6 border-b border-[color:var(--paper-line)] pb-8 last:border-b-0"
                >
                  <div className="col-span-2">
                    <div className="label label-cyan">§{b.id}</div>
                  </div>
                  <div className="col-span-10">
                    <h3 className="font-display text-3xl md:text-4xl leading-[1.05] tracking-[-0.015em]">
                      {b.title}
                    </h3>
                    <p className="mt-3 text-[color:var(--ink-soft)] leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CASE — AI AUTOMATION WORKFLOW
      ==========================================================*/}
      <section id="workflow" className="relative">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-8 mb-14">
            <div className="md:col-span-7">
              <SectionTag id="03">Drawing № 04 · Case Study</SectionTag>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em]">
                A worked example:
                <br />
                <span className="font-display-italic text-[color:var(--cyan)]">
                  the lead that answers itself.
                </span>
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:pt-10">
              <p className="text-[color:var(--ink-soft)] leading-relaxed">
                What do we mean by <em>AI automation</em>? Here&apos;s a real
                workflow we built for a client — a system that turns a
                website inquiry into an approved, personalized reply in
                minutes, not hours.
              </p>
            </div>
          </div>

          {/* Workflow figure */}
          <figure className="relative mb-16 md:mb-20">
            <div className="plate plate-cyan p-5 md:p-8 bg-white/60">
              <RegMark position="top-left" />
              <RegMark position="top-right" />
              <RegMark position="bottom-left" />
              <RegMark position="bottom-right" />
              <img
                src={aiEmailWorkflowImage}
                alt="AI Email Lead Responder Workflow diagram"
                className="w-full h-auto rounded-[1px]"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-mute)]">
              <span className="h-px w-10 bg-[color:var(--ink-mute)]" />
              Fig. 01 — AI-powered email lead responder · client build
            </figcaption>
          </figure>

          {/* How it works — numbered steps, wide editorial layout */}
          <div className="grid md:grid-cols-12 gap-10 mb-20">
            <div className="md:col-span-4">
              <div className="label label-rust mb-3">How it works</div>
              <h3 className="font-display text-4xl md:text-5xl leading-[0.98] tracking-[-0.02em]">
                Respond in minutes, not hours.
              </h3>
              <p className="mt-5 text-[color:var(--ink-soft)] leading-relaxed">
                When a potential customer submits an inquiry, the system
                immediately springs into action — capturing, analyzing, and
                drafting a tailored response.
              </p>
            </div>

            <ol className="md:col-span-8 border-t border-[color:var(--ink)]">
              {steps.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="grid grid-cols-12 gap-4 md:gap-8 py-6 border-b border-[color:var(--paper-line)]"
                >
                  <div className="col-span-2 md:col-span-1">
                    <div className="font-display text-3xl md:text-4xl leading-none text-[color:var(--cyan)]">
                      {s.n}
                    </div>
                  </div>
                  <div className="col-span-10 md:col-span-11">
                    <h4 className="font-display text-xl md:text-2xl tracking-[-0.01em]">
                      {s.title}
                    </h4>
                    <p className="mt-2 text-[color:var(--ink-soft)] leading-relaxed max-w-2xl">
                      {s.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Outcomes */}
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <div className="label label-cyan mb-3">Outcomes</div>
              <h3 className="font-display text-4xl md:text-5xl leading-[0.98] tracking-[-0.02em]">
                What this means
                <br />
                <span className="font-display-italic">for your business.</span>
              </h3>
            </div>
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-4">
              {outcomes.map((o, i) => (
                <motion.div
                  key={o.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="border border-[color:var(--paper-line)] bg-[color:var(--card)] p-6 hover:border-[color:var(--ink)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Check
                      size={14}
                      className="text-[color:var(--cyan)]"
                      strokeWidth={3}
                    />
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">
                      {o.label}
                    </span>
                  </div>
                  <p className="text-[color:var(--ink)] leading-relaxed">
                    {o.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PARTNERS
      ==========================================================*/}
      <section className="bg-[color:var(--ink)] text-[color:var(--paper)] relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-24">
          <div className="grid md:grid-cols-12 gap-8 mb-14 items-end">
            <div className="md:col-span-7">
              <div className="flex items-center gap-4">
                <span className="label" style={{ color: '#5ea8d8' }}>
                  §04
                </span>
                <span
                  className="h-px w-12 opacity-60"
                  style={{ background: '#5ea8d8' }}
                />
                <span className="label" style={{ color: '#c9d4df' }}>
                  Toolchain
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mt-6 tracking-[-0.02em] text-[color:var(--paper)]">
                Built with the{' '}
                <span className="font-display-italic text-[color:var(--rust-soft)]">
                  sharpest tools
                </span>{' '}
                in the shop.
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <p className="text-[color:#c9d4df] leading-relaxed">
                We&apos;re picky about our toolchain so you don&apos;t have to
                be. Every platform we use earns its place by making your
                business faster, safer, or smarter.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:#223549]">
            {partners.map((p) => (
              <div
                key={p.name}
                className="bg-[color:var(--ink)] p-8 md:p-10 flex flex-col items-center text-center hover:bg-[color:#102842] transition-colors"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-10 w-auto mb-4 object-contain filter brightness-0 invert"
                />
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:#9cb0c5]">
                  {p.caption}
                </div>
                <div className="font-display text-xl mt-2 text-[color:var(--paper)]">
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT
      ==========================================================*/}
      <section id="contact" className="relative">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
            <div className="md:col-span-7">
              <SectionTag id="05">Drawing № 05 · Commission</SectionTag>
              <h2 className="font-display text-5xl md:text-7xl leading-[0.92] mt-6 tracking-[-0.025em]">
                Let&apos;s draft
                <br />
                <span className="font-display-italic text-[color:var(--rust)]">
                  something together.
                </span>
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:pt-10">
              <p className="text-[color:var(--ink-soft)] leading-relaxed">
                The first move is a free discovery call. 15–30 minutes, no
                obligation. You walk away with real insight whether we work
                together or not.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Form */}
            <div className="lg:col-span-7">
              <Plate accent="cyan">
                <div className="flex items-center justify-between mb-6">
                  <div className="label label-cyan">Discovery Intake</div>
                  <div className="font-mono text-[11px] text-[color:var(--ink-mute)]">
                    {'< 1 business hr reply'}
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  name="contact-form"
                  method="POST"
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Company name *" htmlFor="companyName">
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange('companyName', e.target.value)
                        }
                        className="bp-input"
                        placeholder="Your company"
                        required
                      />
                    </Field>
                    <Field label="Industry" htmlFor="industry">
                      <Select
                        onValueChange={(value) =>
                          handleInputChange('industry', value)
                        }
                      >
                        <SelectTrigger className="bp-input h-11">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional-services">
                            Professional Services
                          </SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="real-estate">
                            Real Estate
                          </SelectItem>
                          <SelectItem value="construction">
                            Construction
                          </SelectItem>
                          <SelectItem value="residential-cabinetry">
                            Residential Cabinetry
                          </SelectItem>
                          <SelectItem value="commercial-cabinetry">
                            Commercial Cabinetry
                          </SelectItem>
                          <SelectItem value="closets">Closets</SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="First name *" htmlFor="firstName">
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange('firstName', e.target.value)
                        }
                        className="bp-input"
                        placeholder="First"
                        required
                      />
                    </Field>
                    <Field label="Last name *" htmlFor="lastName">
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange('lastName', e.target.value)
                        }
                        className="bp-input"
                        placeholder="Last"
                        required
                      />
                    </Field>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Email *" htmlFor="email">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        className="bp-input"
                        placeholder="you@company.com"
                        required
                      />
                    </Field>
                    <Field label="Phone" htmlFor="phone">
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        className="bp-input"
                        placeholder="(555) 123-4567"
                      />
                    </Field>
                  </div>

                  <Field label="Current IT challenges" htmlFor="challenges">
                    <Textarea
                      id="challenges"
                      name="challenges"
                      value={formData.challenges}
                      onChange={(e) =>
                        handleInputChange('challenges', e.target.value)
                      }
                      className="bp-input"
                      placeholder="What's breaking? Where are the bottlenecks?"
                      rows={3}
                    />
                  </Field>

                  <Field label="Goals & objectives" htmlFor="goals">
                    <Textarea
                      id="goals"
                      name="goals"
                      value={formData.goals}
                      onChange={(e) =>
                        handleInputChange('goals', e.target.value)
                      }
                      className="bp-input"
                      placeholder="What would 'solved' look like?"
                      rows={3}
                    />
                  </Field>

                  <button
                    type="submit"
                    className="btn-ink w-full justify-center"
                    disabled={
                      formSubmissionState === 'submitting' ||
                      formSubmissionState === 'success'
                    }
                  >
                    {formSubmissionState === 'submitting'
                      ? 'Scheduling…'
                      : formSubmissionState === 'success'
                      ? 'Submission Received'
                      : 'Schedule Free Discovery Call'}
                    <ArrowRight size={14} strokeWidth={2.2} />
                  </button>
                </form>
              </Plate>

              {/* Inline thank-you — rendered beneath the form plate */}
              {formSubmissionState === 'success' && (
                <motion.div
                  ref={thankYouRef}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  className="mt-6 scroll-mt-24"
                  role="status"
                  aria-live="polite"
                >
                  <Plate accent="rust">
                    <div className="flex items-center justify-between mb-5">
                      <div className="label label-rust">Submission Received</div>
                      <div className="font-mono text-[11px] text-[color:var(--ink-mute)]">
                        Drawing № 05 · Logged
                      </div>
                    </div>
                    <h3 className="font-display text-4xl md:text-5xl leading-[0.95] tracking-[-0.02em]">
                      Thank you —{' '}
                      <span className="font-display-italic text-[color:var(--rust)]">
                        your drawing is on the table.
                      </span>
                    </h3>
                    <p className="mt-5 text-[color:var(--ink-soft)] leading-relaxed max-w-2xl">
                      We&apos;ve received your inquiry and a human will
                      respond within <strong>one business hour</strong>. Keep
                      an eye on your inbox for a short reply and a link to
                      schedule our discovery call.
                    </p>
                    <div className="mt-6 pt-5 border-t border-[color:var(--paper-line)] grid sm:grid-cols-2 gap-3 font-mono text-[12px] text-[color:var(--ink)]">
                      <div className="flex items-center gap-3">
                        <Check
                          size={14}
                          className="text-[color:var(--rust)]"
                          strokeWidth={3}
                        />
                        <span>Details saved to our system</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check
                          size={14}
                          className="text-[color:var(--rust)]"
                          strokeWidth={3}
                        />
                        <span>Calendar link inbound</span>
                      </div>
                    </div>
                  </Plate>
                </motion.div>
              )}
            </div>

            {/* Side info */}
            <div className="lg:col-span-5 space-y-6">
              <Plate accent="rust">
                <div className="label label-rust mb-5">Contact</div>
                <div className="space-y-4 font-mono text-[13px]">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={14}
                      className="mt-1 text-[color:var(--rust)]"
                      strokeWidth={2}
                    />
                    <span className="text-[color:var(--ink)]">
                      5101 Unicon Drive, Suite B
                      <br />
                      Wake Forest, NC
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock
                      size={14}
                      className="text-[color:var(--rust)]"
                      strokeWidth={2}
                    />
                    <span className="text-[color:var(--ink)]">
                      Response within 1 business hour
                    </span>
                  </div>
                </div>
              </Plate>

              <Plate accent="cyan">
                <div className="label label-cyan mb-5">What happens next</div>
                <ol className="divide-y divide-[color:var(--paper-line)]">
                  {[
                    [
                      '01',
                      'Schedule your call',
                      'Fill out the intake. A calendar link lands in your inbox.',
                    ],
                    [
                      '02',
                      'Discovery session',
                      '15–30 minute consultation. No cost, no obligation.',
                    ],
                    [
                      '03',
                      'Solutions',
                      'Walk away with prioritized next steps — whether we work together or not.',
                    ],
                  ].map(([n, h, b]) => (
                    <li key={n} className="py-4 grid grid-cols-12 gap-3">
                      <div className="col-span-2 font-display text-2xl leading-none text-[color:var(--cyan)]">
                        {n}
                      </div>
                      <div className="col-span-10">
                        <div className="font-display text-lg leading-snug">
                          {h}
                        </div>
                        <p className="text-sm text-[color:var(--ink-soft)] leading-relaxed mt-1">
                          {b}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Plate>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ==========================================================*/}
      <SiteFooter
        links={[
          { label: 'Services', href: '#services', onAnchor: () => scrollToSection('services') },
          { label: 'Studio', href: '#about', onAnchor: () => scrollToSection('about') },
          { label: 'Contact', href: '#contact', onAnchor: () => scrollToSection('contact') },
        ]}
      />
    </div>
  )
}

// ---- Form field wrapper -----------------------------------------------------
function Field({ label, htmlFor, children }) {
  return (
    <div>
      <Label
        htmlFor={htmlFor}
        className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)] mb-2 block"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}

export default Home
