# Product Marketing Context

*Last updated: 2026-05-26*
*Product: Shop OS Foundation*
*Vendor: Blueprint IT (founder/operator: Glenn Chua)*

## Product Overview

**One-liner:** A self-install AI operating system that gives small businesses a shared, queryable brain on top of their own files, powered by their existing Claude Code subscription.

**What it does:** Shop OS Foundation installs in one terminal command and gives an owner-operator business three things that compound: (1) a structured Obsidian vault that becomes the single source of truth for customer history, SOPs, brand voice, and decisions, (2) a read-only chat surface employees can walk up to and ask questions without breaking anything, and (3) 28 pre-wired AI skills that run scheduled routines, organize files, transcribe audio, and process inboxes. Every output is grounded in the customer's own business context, not generic LLM output.

**Product category:** AI operating system for small businesses. Adjacent shelves: AI assistant, second brain, knowledge management, business automation platform.

**Product type:** Self-install software bundle (npm-distributed installer, Cloudflare-licensed) with one-time pricing. Local-first. Customer-owned data.

**Business model:** $500 one-time for Founding 50 cohort. Lifetime grandfather pricing for that cohort. Price doubles after the 50 seats are sold. 30-day refund. No subscription, no per-seat fees, no API metering. Foundation is the front door to mid-tier Skill Packs (e.g., a future Cabinet Shop Pack) and back-end Blueprint IT consulting engagements ($25K-$100K+).

## Target Audience

**Target companies:** Owner-operator small businesses, 1-25 people, where the owner is currently the bottleneck for institutional knowledge. Initial vertical seed: cabinet shops, custom millwork, closet installers (Glenn's warm trade-group network of 56k+ members). Horizontal Foundation copy intentionally avoids cabinet-specific language so it lands for trades, professional services, agencies, and any operator-led shop.

**Decision-makers:** The owner or founder. There is no procurement committee at this size. They self-install on a single shop computer.

**Primary use case:** "Stop being the answer to every question in my shop." Every employee question, every customer recall, every SOP lookup currently routes through the owner. Shop OS gives the team a brain they can query themselves.

**Jobs to be done:**
- Capture institutional knowledge that today only lives in the owner's head
- Give employees a safe, read-only way to look things up without bothering the owner
- Run repetitive AI work (inbox triage, daily briefs, file organizing, transcription) on a schedule, hands-off

**Use cases:**
- New employee walks up to the shop computer and asks the brain how a past job was quoted
- Owner dumps meeting recordings, emails, and PDFs into a `Raw/` inbox; `os-digest` routes each one to the right vault folder with a summary
- Owner schedules `os-operator` to run a weekly review of customer accounts and flag who needs a follow-up
- Owner pulls up the chat from their phone to recall what a customer agreed to last quarter

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Owner-Operator | Time freedom, business not collapsing if they take a week off, knowing the shop runs without constant questions | They are the institutional memory; every employee question routes through them | A shared brain employees can query directly. They stop being the help desk. |
| Shop Employee | Doing their job without interrupting the owner, looking competent in front of customers | They don't know past job details, customer preferences, or where the SOP lives | A read-only chat at the shop computer that answers questions in seconds, no logins, no risk of breaking anything |
| Technical Decision-maker (if owner has one) | Owning their data, no vendor lock-in, no surprise monthly bills | They've been burned by SaaS that locks data behind subscriptions or raises prices yearly | Plain markdown files in their own Dropbox/iCloud. Self-hosted. One-time purchase. |

## Problems & Pain Points

**Core problem:** The owner is the brain of the business. Everything important lives in their head, their inbox, their phone, scattered spreadsheets, Slack threads, and Trello boards. When they're busy, work blocks. When they take a day off, work blocks. When a key employee leaves, knowledge leaves with them.

**Why alternatives fall short:**
- Generic ChatGPT/Claude knows nothing about their business. Every prompt starts from zero.
- SaaS "AI assistants" lock data behind a subscription and bill per-seat forever.
- Notion and Airtable are storage, not intelligence. Searching them still requires knowing what to look for.
- Custom AI consulting projects start at $25K and take months to deliver.
- DIY GPT wrappers require technical skill the owner does not have.

**What it costs them:**
- Hours per week answering employee questions that should be self-serve
- Lost institutional memory when a key person leaves
- Slower onboarding for every new hire
- Owners trapped in the business, unable to take real time off

**Emotional tension:** "If I get hit by a bus tomorrow, the business stops." Quiet anxiety that the whole operation is held together by what they personally remember. Frustration that every AI tool they try is impressive in a demo and useless on Monday morning.

## Competitive Landscape

**Direct:** Other "AI for small business" platforms (Gumloop, Lindy, generic AI assistant SaaS). Fall short because they're cloud-locked, subscription-priced, and the customer never owns the data or the system. When the vendor pivots or shuts down, the customer is stranded.

**Secondary:** Notion + ChatGPT, Obsidian + plugins, custom GPTs. Fall short because they require the operator to wire everything together themselves. The customer ends up with parts, not a product. Most never make it past month one.

**Indirect:** Hiring an office manager, paying for AI consulting, or doing nothing and continuing to be the bottleneck. Fall short on cost, speed, or the obvious one (nothing changes).

## Differentiation

**Key differentiators:**
- One-time price. No subscription. Lifetime updates for the Founding 50.
- Runs on the customer's own Claude Code subscription. Zero API keys, zero metering, zero surprise bills.
- Data lives in plain markdown files in the customer's own cloud (Dropbox, iCloud, OneDrive). The customer owns it forever.
- Read-only employee chat means non-technical staff can use it without risk of breaking anything.
- 28 pre-wired skills bundled at install, not "build your own" prompts.
- Self-install in ~10 minutes via a single npx command and a drag-and-drop folder picker. No terminal expertise required.
- Founder is an admin of a 56k-member trade group, deeply embedded in his target market.

**How we do it differently:** Foundation ships as a productized bundle (installer + vault + skills + license + chat), not a project. The customer paste-installs, drags a folder, and the system is live. Every subsequent feature is a skill they can opt into, not a config they have to maintain.

**Why that's better:** Owners don't have to become integrators. They get the outcome (a working brain for their business) in an afternoon, not a quarter.

**Why customers choose us:** They want AI in their business but don't want a recurring bill, don't want to learn to code, don't want to wait for a $50K consulting engagement, and don't want their data held hostage by a SaaS vendor. Shop OS is the only option in that intersection.

## Objections

| Objection | Response |
|-----------|----------|
| "I'm not technical, I'll mess up the install." | One terminal command (we paste it in for you in the welcome email). Then drag your vault folder into the window. Eight to ten minutes. Most non-technical customers finish their first install during a coffee. |
| "What's the monthly bill?" | Zero from us. Shop OS uses your existing Claude Code subscription for all AI work. If you don't have one, that's $20/month from Anthropic directly. |
| "What happens to my data if Blueprint IT goes away?" | Your data is plain markdown files in your own Dropbox. Open them in any text editor. The vault, the skills, and the chat are all open source on GitHub. Nothing about your operation depends on us being alive. |
| "I tried AI tools, they were useless after the demo." | Generic AI knows nothing about your business. Shop OS works because the first thing it does is read your context. Every answer cites your own past work. |
| "Why $500?" | $500 is the Founding 50 cohort price, which doubles after the first 50 seats. It buys you the installer, 28 skills, license, lifetime grandfather pricing, and 30-day money-back. After that, the only ongoing cost is your existing Claude Code subscription. |
| "Do you do the install for me?" | No. The model breaks if Glenn is in the install. The product is built to install itself. If you genuinely cannot run a single terminal command, we'll refund you. |

**Anti-persona:** A company over 50 people with an IT department that wants vendor SOC-2, SLAs, and a dedicated CSM. A business that needs deep CRM/ERP integrations on day one (those are a consulting engagement, not Foundation). A solo creator with no team, no processes, and no recurring customers (the leverage isn't there).

## Switching Dynamics

**Push:** Owner is exhausted from being the answer to every question. Just lost a key employee and watched institutional knowledge walk out the door. Tried ChatGPT, found it useless for their actual business. Spent $200/month on a SaaS that does 10% of what they hoped.

**Pull:** A single $500 purchase that gives them a working brain on Monday morning. No monthly bill. They own everything. Their employees can use it without supervision.

**Habit:** Continuing to answer every question themselves. Telling themselves "I'll write the SOPs this weekend" and never doing it. Putting AI in the "I'll figure it out next year" bucket.

**Anxiety:** "What if I install it and it doesn't work?" (30-day refund, drag-and-drop install, free Claude Code tier covers initial use.) "What if my team won't use it?" (Read-only chat at the shop computer requires zero training; it's just a question box.) "What if Blueprint IT vanishes?" (Open source, data in customer's own cloud.)

## Customer Language

**How they describe the problem:**
- "I'm the answer to every question in my shop."
- "Everything is in my head."
- "If I get hit by a bus tomorrow, this place stops."
- "My team keeps asking me the same things over and over."
- "I've tried AI but it doesn't know anything about my business."

**How they describe us:**
- "It's like a brain for my shop."
- "My guys can just ask it instead of bothering me."
- "Finally, an AI that actually knows my customers."
- "It's mine. I own it."

**Words to use:** Shop, brain, install, own, foundation, working, ready, your business, your team, your context, on day one, queryable, owner-operator, self-install, lifetime, no subscription, no monthly bill, no API key.

**Words to avoid:** Platform, ecosystem, leverage AI, transform, revolutionary, cutting-edge, synergy, optimize, streamline, enterprise-grade, AI-powered (overused). Avoid "subscription" or "monthly" unless explicitly contrasting against them. Avoid framing the deliverable as "an app."

**Glossary:**
| Term | Meaning |
|------|---------|
| Shop OS Foundation | The $500 product. Installer + 28 skills + license + Shop OS Chat. |
| Working Shop Brain | The metaphor for the installed system. The brand-level name for what gets delivered. |
| Vault | The customer's Obsidian folder that holds all their context. Plain markdown. Lives in their own cloud. |
| Shop OS Chat | The read-only browser chat employees use at the shop computer. Transcripts auto-save to the vault. |
| Skill | A pre-wired AI workflow (e.g., `assistant`, `os-operator`, `os-digest`, `file-organizer`). |
| Founding 50 | The first 50 customer cohort. $500. Lifetime grandfather pricing. |
| Claude Code | Anthropic's coding-and-agent CLI. Every Shop OS AI call routes through the customer's own Claude Code subscription. |

## Brand Voice

**Tone:** Architect-craftsman. Confident, technical without jargon, slightly poetic. Sounds like the carpenter who also designs the house. Drafting-blueprint metaphors (Drawing № 01, Drawing № 02, "spec sheet," "anatomy").

**Style:** Direct. Short sentences with the occasional long one for cadence. Specific over abstract. Names the thing instead of hand-waving. Never marketing-buzzword voice.

**Personality:** Grounded, considered, plain-spoken, quietly opinionated, allergic to hype.

**Formatting rules (hard):**
- Never use em dashes. Use periods, commas, colons, or restructure.
- Never use exclamation points.
- Never use "innovative," "revolutionary," "cutting-edge," "leverage," "synergy."
- Avoid "AI-powered" as a descriptor (everything is AI; it's a tell).

## Proof Points

**Metrics (current, conservative):**
- Live and tested end-to-end on a Windows mini PC, 2026-05-25
- 28 pre-wired skills bundled in Foundation
- One terminal command from zero to installed in ~10 minutes
- 56k+ member trade group where the founder is admin (warm distribution)
- Zero monthly fees from Blueprint IT

**Customers:** No public Founding 50 customers yet. The page should reserve a Customers/Logos slot for after the first cohort lands and gives permission to be named.

**Testimonials:** None ready for public use yet. Reserve a Testimonials slot for once first cohort customers say something quotable.

**Value themes:**
| Theme | Proof |
|-------|-------|
| Own your system | Plain markdown files in your own cloud. Open source on GitHub. No vendor lock-in. |
| Install yourself | One npx command, drag-and-drop folder, ~10 minutes. Documented in customer-welcome PDF. |
| No monthly bill from us | One-time $500. Runs on your existing Claude Code subscription. |
| Your team can use it without breaking it | Shop OS Chat is read-only at the SDK level. Tool whitelist enforced. Transcripts auto-save to the vault. |
| Compounds with use | Every meeting, decision, customer interaction adds tiles to the brain. Day 1 → Yr 1 visualized in KnowledgeMosaic. |

## Goals

**Business goal:** Sell the first 50 Founding 50 seats at $500 each ($25K cash + 50 installed-base customers seeded for future Skill Pack and consulting upsells).

**Conversion action:** Click "Get Shop OS Foundation" / "Reserve a Founding 50 seat" → purchase via Stripe or PayPal/Venmo at blueprintit.ai/shop-ossi → receive welcome email with license key + install instructions + welcome PDF.

**Current metrics:** Page traffic source is TBD; first cohort will be driven by a warm Facebook post to Glenn's 56k-member trade group plus organic referrals. Conversion benchmark is unknown for cohort one; we'll measure against it for future iterations.

**Out of scope for this page:** Cabinet-vertical specific skills, Pro tier (`os-evolver`), Team tier (`vault-mcp`, `team-os`), Research & Multi-Model Pack, custom consulting. Those are all post-purchase upsell or consulting conversations.
