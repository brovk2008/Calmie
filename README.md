<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="220" />
</p>

<h1 align="center">Calmie · Phone Companion for Elderly Care</h1>

<p align="center">
  <strong>"The world forgot to call. We didn't."</strong><br>
  <em>AI-powered warm companion phone calls for senior citizens in Indian old age homes.</em>
</p>

<p align="center">
  <a href="#license"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="Apache 2.0 License"></a>
  <a href="https://calmie-lol.vercel.app"><img src="https://img.shields.io/badge/Live_Deployment-calmie--lol.vercel.app-22C55E?style=flat&logo=vercel&logoColor=white" alt="Live Deployment"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js" alt="Next.js"></a>
  <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi" alt="FastAPI"></a>
  <a href="https://www.python.org"><img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python" alt="Python 3.11"></a>
  <a href="https://www.twilio.com"><img src="https://img.shields.io/badge/Twilio-Voice_PSTN-F22F46?logo=twilio" alt="Twilio"></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" alt="Supabase"></a>
  <a href="https://www.anthropic.com"><img src="https://img.shields.io/badge/Anthropic-Claude_3_Haiku-D97706?logo=anthropic" alt="Claude"></a>
  <a href="https://elevenlabs.io"><img src="https://img.shields.io/badge/ElevenLabs-Multilingual_TTS-000000" alt="ElevenLabs"></a>
  <a href="https://calmie-lol.vercel.app"><img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" alt="Vercel"></a>
</p>

<p align="center">
  <a href="https://calmie-lol.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀_VISIT_LIVE_APP-calmie--lol.vercel.app-22C55E?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  🌐 <strong>Live Production URL:</strong> <a href="https://calmie-lol.vercel.app" target="_blank"><strong>https://calmie-lol.vercel.app</strong></a>
</p>

---

## 🌐 Live Deployment

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="100" />
</p>

Calmie is deployed on Vercel with automated full-stack routing:

- 🚀 **Live Web Application:** [**https://calmie-lol.vercel.app**](https://calmie-lol.vercel.app)
- ⚡ **Backend API Endpoints:** [**https://calmie-lol.vercel.app/api**](https://calmie-lol.vercel.app/api)
- 📖 **Interactive API Documentation (Swagger):** [**https://calmie-lol.vercel.app/api/docs**](https://calmie-lol.vercel.app/api/docs)
- 🩺 **Health Check:** [**https://calmie-lol.vercel.app/api/health**](https://calmie-lol.vercel.app/api/health)

---

## 📖 Table of Contents

- [🌐 Live Deployment](#-live-deployment)
- [The Mission](#-the-mission)
- [System Architecture](#-system-architecture)
- [Complete Tech Stack](#-complete-tech-stack)
- [Services & Integrations Deep-Dive](#-services--integrations-deep-dive)
  - [1. Twilio Voice (PSTN Telephony)](#1-twilio-programmable-voice--pstn-telephony)
  - [2. Supabase (PostgreSQL & State)](#2-supabase-relational-database--state-management)
  - [3. Anthropic Claude (Conversational & Clinical AI)](#3-anthropic-claude-conversational--clinical-ai)
  - [4. ElevenLabs (Neural Multilingual TTS)](#4-elevenlabs-neural-multilingual-tts)
  - [5. Amazon Polly (Native TwiML Voice)](#5-amazon-polly-low-latency-twiml-voice)
  - [6. Vakh Community Social Feed](#6-vakh-community-social-feed)
  - [7. Vercel Serverless Platform](#7-vercel-serverless-monorepo-platform)
- [Core Features](#-core-features)
- [Interactive Telephony Flow](#-interactive-telephony-flow)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Local Development Setup](#-local-development-setup)
- [Deployment on Vercel](#-deployment-on-vercel)
- [License (Apache 2.0)](#-license)

---

## 🌟 The Mission

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="100" />
</p>

Over **15 million elderly people in India** live in severe isolation or old-age homes. Most of them do not own smartphones, cannot navigate modern apps, and struggle with touchscreens due to tremors, arthritis, or failing eyesight. What they have is a simple basic feature phone or a landline — and a deep longing for someone to ask, *"Aapne khana khaya?"* (*Did you eat?*).

**Calmie** brings companion care directly to their existing phones through automated, scheduled PSTN calls. No apps to install. No internet needed on the senior's end. Just pick up the ringing phone and talk to an empathetic, respectful voice that listens in Hindi or English, remembers their stories, tracks their emotional well-being, and keeps their families informed.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Frontend["Frontend · Next.js 14"]
        UI["Web Portal (Families / Caregivers)"]
        Widget["Live Demo Widget · Quick Dial"]
        Dash["Clinical Mood Dashboard"]
    end

    subgraph Backend["Backend · FastAPI (Python 3.11)"]
        API["REST API Router"]
        Scheduler["Call Scheduler & Dispatcher"]
        TwiMLHandler["TwiML Webhook Engine"]
        SentimentEngine["Post-Call Clinical Analyzer"]
    end

    subgraph ExternalServices["External Cloud & AI Services"]
        Twilio["Twilio Voice API (PSTN)"]
        Supabase["Supabase (PostgreSQL DB)"]
        Claude["Anthropic Claude 3 Haiku"]
        ElevenLabs["ElevenLabs Neural TTS"]
        Polly["Amazon Polly (Aditi / Matthew)"]
        Vakh["Vakh Community Feed API"]
    end

    subgraph Elder["Senior Citizen"]
        Phone["Basic Mobile / Landline Phone"]
    end

    UI -->|Book Call / Manage Seniors| API
    Widget -->|Trigger Instant Call| API
    API <-->|Store & Read Records| Supabase
    Scheduler -->|Dispatch Scheduled Call| Twilio
    Twilio -->|PSTN Ring & Voice Stream| Phone
    Phone -->|Voice Input (Hindi/English)| Twilio
    Twilio -->|Speech-to-Text Webhook| TwiMLHandler
    TwiMLHandler <-->|Dialogue Generation| Claude
    TwiMLHandler -->|Speech Synthesis| Polly
    TwiMLHandler -->|HD Neural TTS (Optional)| ElevenLabs
    Twilio -->|Call Complete Webhook| SentimentEngine
    SentimentEngine -->|Transcript Analysis & Mood Scoring| Claude
    SentimentEngine -->|Store Mood & Loneliness Metrics| Supabase
    SentimentEngine -->|Publish Care Update| Vakh
    Dash -->|Real-Time Emotional Analytics| API
```

---

## 💻 Complete Tech Stack

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="80" />
</p>

| Layer | Technology | Version | Key Purpose |
|---|---|---|---|
| **Frontend Framework** | **Next.js** (App Router) | `14.2.35` | Server-rendered UI, dynamic routes, optimized assets |
| **Frontend Runtime** | **React** / **TypeScript** | `18.3.1` / `5.x` | Strongly-typed component architecture |
| **Styling** | **Tailwind CSS** | `3.4.1` | Accessible, high-contrast Neo-Brutalist UI theme |
| **Typography** | **Outfit**, **Plus Jakarta Sans**, **Space Mono** | Google Fonts | Ultra-readable type scale for accessibility |
| **Icons & FX** | **Lucide React** & **Canvas Confetti** | `^0.460` | Interactive tactile controls and feedback celebrations |
| **Backend Framework** | **FastAPI** | `0.115.11` | High-throughput asynchronous ASGI microservice |
| **Backend Server** | **Uvicorn** | `0.34.0` | Production ASGI web server implementation |
| **Language Runtime** | **Python** | `3.11.x` | Modern asynchronous Python runtime |
| **Data Validation** | **Pydantic v2** & **pydantic-settings** | `2.8.2` | Robust request/response schema parsing and env validation |
| **HTTP Client** | **HTTPX** | `0.28.1` | Non-blocking async REST requests to Supabase, Claude, Vakh |
| **Scheduler** | **APScheduler** | `3.10.4` | Background cron scheduler (local mode) for automated calls |
| **Telephony** | **Twilio Voice SDK** | `9.4.6` | Outbound PSTN calling, TwiML generation, gathering speech |
| **Database** | **Supabase PostgreSQL** | Cloud REST | Multi-table persistent storage with in-memory zero-config fallback |
| **LLM Reasoning** | **Anthropic Claude 3 Haiku** | `20240307` | Context-aware dialogue, sentiment scoring, loneliness alerts |
| **Voice Synthesis** | **ElevenLabs Multilingual v2** | REST API | Ultra-realistic, warm multilingual voice synthesis |
| **Native Voice** | **Amazon Polly (via Twilio)** | Neural | Sub-second latency Indian Hindi (`Aditi`) & English (`Matthew`) |
| **Community Feed** | **Vakh Social Feed** | MCP / REST | Family updates, community milestones, elder care moments |
| **Hosting & Deploy**| **Vercel** | v2 Builds | Serverless monorepo hosting both Next.js and FastAPI |

---

## 🔌 Services & Integrations Deep-Dive

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="120" />
</p>

### 1. Twilio Programmable Voice · PSTN Telephony
- **File Implementation**: [`backend/services/twilio_service.py`](./backend/services/twilio_service.py) & [`backend/routers/twiml.py`](./backend/routers/twiml.py)
- **Role**: Bridges the digital cloud infrastructure to the Public Switched Telephone Network (PSTN), dialing mobile numbers in India (`+91`) without requiring the elder to possess a smartphone or internet.
- **How It's Used**:
  - **Outbound Calling**: Uses Twilio REST Client `client.calls.create()` specifying the senior's phone number, verified caller ID, and the initial webhook URL (`/api/twiml/welcome`).
  - **TwiML Conversation Loop**:
    1. Returns structured XML with `<Gather input="speech" language="hi-IN en-IN">` to capture the senior's spoken voice.
    2. Sends the speech transcription result via POST to `/api/twiml/gather`.
    3. Feeds transcription into Claude 3 Haiku, generates an empathetic response, and speaks it back using `<Say voice="Polly.Aditi">` or ElevenLabs audio stream.
    4. Loops seamlessly until either party hangs up.
  - **Status Callbacks**: Twilio notifies `/api/calls/{call_id}/complete` with call duration, recording metadata, and termination reason.

### 2. Supabase · Relational Database & State Management
- **File Implementation**: [`backend/supabase_client.py`](./backend/supabase_client.py)
- **Role**: Secure, persistent PostgreSQL storage for residents, elder care homes, bookings, call logs, and mood trajectories.
- **How It's Used**:
  - **Direct Async REST Client**: Built using `httpx.AsyncClient` with bearer token auth to query Supabase PostgREST endpoints (`/rest/v1/*`), ensuring zero blocking operations in serverless execution.
  - **Zero-Failure In-Memory Fallback**: If Supabase credentials are missing or the database is paused, Calmie automatically switches to an in-memory database with pre-seeded demo residents (Ramesh Tiwari, Kamla Devi, Col. Harbhajan Singh) so the system never crashes.
  - **Automated Schema**: Tracks primary keys, foreign relations, JSON tags (diet, hobbies, medical alerts), and call transcripts.

### 3. Anthropic Claude · Conversational & Clinical AI
- **File Implementation**: [`backend/services/claude_service.py`](./backend/services/claude_service.py)
- **Role**: Provides the brain of Calmie, delivering human-level conversational warmth and post-call clinical intelligence.
- **How It's Used**:
  - **Interactive Dialogue (`Claude 3 Haiku / Claude Haiku 4.5`)**:
    - System prompt injects the elder's name, age, home city, favorite memories, health constraints, and language preference.
    - Instructed to speak in warm, respectful tones (using respectful Indian honorifics like *Ji*, *Aadab*, *Sat Sri Akal*).
    - Keeps turns brief (1-3 sentences) optimized for natural phone listening without overwhelming the senior.
  - **Post-Call Clinical Extraction**:
    - Analyzes full call transcripts to output structured JSON:
      - `mood_score` (1 to 10 scale)
      - `loneliness_flag` (boolean detection of deep isolation or abandonment feelings)
      - `urgent_flag` (emergency detection: chest pain, fall, severe confusion, suicidal ideation)
      - `summary` (concise 2-sentence summary for family)
      - `favorite_moment` (highlighted memory or joke shared during the call)

### 4. ElevenLabs · Neural Multilingual TTS
- **File Implementation**: [`backend/services/elevenlabs_service.py`](./backend/services/elevenlabs_service.py)
- **Role**: High-definition, emotionally expressive speech generation with natural human pauses and warmth.
- **How It's Used**:
  - Leverages the `eleven_multilingual_v2` model with tailored voice profiles (`Aria`, `Rachel`, `Priya`, `Lily`, `Brian`, `George`).
  - Converts Claude's generated responses into crystal-clear MP3 audio chunks via `/api/twiml/tts`.
  - Injected directly into Twilio TwiML via `<Play>/api/twiml/tts?text=...</Play>`.

### 5. Amazon Polly · Low-Latency TwiML Voice
- **File Implementation**: [`backend/routers/twiml.py`](./backend/routers/twiml.py)
- **Role**: Twilio-native ultra-fast neural speech synthesis.
- **How It's Used**:
  - Serves as the high-speed primary or fallback voice synthesizer embedded inside TwiML `<Say>` tags.
  - Utilizes `Polly.Aditi` (Indian Hindi female) for Hindi conversations and `Polly.Matthew` (Indian English male) for English calls, providing natural Indian accents with zero additional latency.

### 6. Vakh · Community Social Feed
- **File Implementation**: [`backend/services/vakh_service.py`](./backend/services/vakh_service.py)
- **Role**: Shared community and family bulletin feed connecting old age home residents with sponsors, volunteers, and dispersed families.
- **How It's Used**:
  - Connected via Vakh REST/MCP endpoint (`https://xo.vakh.com/mcp`).
  - Upon call completion and sentiment extraction, Calmie formats an uplifting, privacy-safe community card:
    > *"Col. Harbhajan Singh (82) just finished a lovely 6-minute chat about his vintage motorcycle days in Ludhiana. Mood: 9/10! 🛵"*
  - Keeps families connected across continents and reassures them that their loved ones are happy and engaged.

### 7. Vercel · Serverless Monorepo Platform
- **File Implementation**: [`vercel.json`](./vercel.json)
- **Role**: Unified deployment platform hosting both the Next.js frontend and Python FastAPI backend on high-performance edge infrastructure.
- **How It's Used**:
  - Next.js built via `@vercel/next`.
  - FastAPI built via `@vercel/python` targeting `backend/index.py`.
  - Stable route rewrites redirecting `/api/(.*)` to the FastAPI backend service while routing all page requests to Next.js.
  - Automatic environment variable propagation across preview and production environments.

---

## 🚀 Core Features

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="100" />
</p>

### 1. 📞 Live AI Outbound Telephony
Enter any Indian phone number on the web dashboard to immediately initiate an AI companion phone call. The senior receives a regular incoming phone call with caller ID, picks up, and begins speaking naturally.

### 2. 👵 Elder Profiles & Personal History
Each resident profile includes:
- Personal backstory, hobbies, and hometown memories
- Native language preferences (Hindi, English, Hinglish, Punjabi, etc.)
- Health and dietary sensitivities (diabetes, hearing difficulties, mobility limits)
- Preferred calling windows and emergency caregiver contact details

### 3. 🧠 Clinical Mood & Loneliness Tracking
Every conversation is audited by AI for mental wellness indicators:
- **Mood Score (1-10)**: Visualized over weekly and monthly trendlines
- **Loneliness Index**: Flags seniors who express deep withdrawal or grief
- **Urgent Medical Alerts**: Immediate escalation flag when physical distress is voiced

### 4. 📅 Smart Booking & Auto-Scheduler
Family members and volunteers can schedule recurring daily, weekly, or special occasion phone calls (e.g., birthdays, anniversaries). The system queues the calls and triggers them automatically at the designated time.

### 5. 🎨 Neo-Brutalist High-Contrast UI
Custom-engineered interface emphasizing:
- High contrast and oversized click targets for aging eyes
- Warm nostalgic color palette (`#FFE500` yellow, `#2563EB` blue, `#22C55E` green)
- Tactile brutalist borders (`3px solid #000`) and hard drop shadows (`5px 5px 0px #000`)

---

## 🔄 Interactive Telephony Flow

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="80" />
</p>

```
[Trigger Call] ──► Twilio dials Senior's Phone Number (+91)
                       │
                       ▼
             Senior picks up receiver
                       │
                       ▼
    Twilio requests /api/twiml/welcome?booking_id=...
                       │
                       ▼
    TwiML responds: <Gather language="hi-IN en-IN">
                    <Say voice="Polly.Aditi">
                      "Namaste Ramesh ji! Kaise hain aap aaj?"
                    </Say>
                    </Gather>
                       │
                       ▼
          Senior speaks: "Haan beta, theek hoon. Aaj guthno mein thoda dard tha."
                       │
                       ▼
    Twilio captures audio ──► STT ──► POST /api/twiml/gather
                                               │
                       ┌───────────────────────┘
                       ▼
     Claude 3 Haiku receives context:
     - Elder: Ramesh Tiwari (79, Allahabad, loves cricket & tea)
     - Utterance: "Aaj guthno mein thoda dard tha."
                       │
                       ▼
     Claude generates warm response:
     "Arre Ramesh ji, mausam badal raha hai na, isliye dard ho sakta hai.
      Aapne subah garam haldi wala doodh piya kya?"
                       │
                       ▼
     TwiML outputs <Gather> with response audio ──► Senior hears response
                       │
         (Cycle continues for 5 - 15 minutes)
                       │
                       ▼
             Call ends / Hangs up
                       │
                       ▼
    POST /api/calls/{call_id}/complete
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
Claude sentiment audit       Vakh Community Feed post
- Mood Score: 7/10           "Ramesh ji had a pleasant chat
- Loneliness: False           about morning tea and cricket."
- Urgent Flag: False
        │
        ▼
Saved to Supabase DB & Dashboard updated
```

---

## 🗄️ Database Schema

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="80" />
</p>

The database is structured in PostgreSQL (hosted on Supabase) across 5 core entities:

```sql
-- 1. Old Age Homes
CREATE TABLE homes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    total_residents INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Residents (Senior Citizens)
CREATE TABLE residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID REFERENCES homes(id),
    name TEXT NOT NULL,
    age INT NOT NULL,
    gender TEXT,
    room_number TEXT,
    phone_number TEXT NOT NULL,
    language TEXT DEFAULT 'Hindi',
    hobbies TEXT[] DEFAULT '{}',
    background_story TEXT,
    medical_notes TEXT,
    family_contact TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Bookings (Scheduled Call Appointments)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID REFERENCES residents(id),
    caller_name TEXT NOT NULL,
    caller_phone TEXT NOT NULL,
    caller_relationship TEXT,
    scheduled_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'confirmed', -- confirmed, in_progress, completed, cancelled
    special_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Calls (Telemetry & Transcripts)
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    resident_id UUID REFERENCES residents(id),
    twilio_call_sid TEXT,
    duration_seconds INT DEFAULT 0,
    transcript TEXT,
    mood_score INT, -- 1 to 10
    loneliness_flag BOOLEAN DEFAULT false,
    urgent_flag BOOLEAN DEFAULT false,
    summary TEXT,
    favorite_moment TEXT,
    status TEXT DEFAULT 'initiated', -- initiated, ringing, in_progress, completed, failed
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Availability (Time Slots)
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID REFERENCES residents(id),
    day_of_week INT, -- 0 (Sunday) to 6 (Saturday)
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true
);
```

---

## 📡 API Reference

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="80" />
</p>

### Telephony & Calls (`/api/calls`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/calls/trigger/{booking_id}` | Triggers an immediate outbound Twilio phone call |
| `POST` | `/api/calls/{call_id}/complete` | Webhook triggered on hang-up; runs Claude sentiment analyzer |
| `GET` | `/api/calls` | Lists recent call records with mood scores |
| `GET` | `/api/calls/{call_id}` | Retrieves detailed call transcript, summary, and metrics |
| `GET` | `/api/calls/stats/overview` | Aggregated analytics (total calls, avg mood, flagged calls) |

### TwiML Webhooks (`/api/twiml`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` / `GET` | `/api/twiml/welcome` | Entry-point TwiML webhook delivering greeting & `<Gather>` |
| `POST` | `/api/twiml/gather` | Handles speech recognition input and generates Claude dialogue |
| `GET` | `/api/twiml/tts` | ElevenLabs streaming audio proxy for high-fidelity synthesis |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bookings` | Returns all call bookings with filters |
| `POST` | `/api/bookings` | Creates a new scheduled or immediate call booking |
| `GET` | `/api/bookings/{booking_id}` | Fetches booking metadata |
| `PATCH`| `/api/bookings/{booking_id}/status` | Updates booking lifecycle status |

### Residents & Homes (`/api/residents`, `/api/homes`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/residents` | Returns directory of seniors with photo & home details |
| `GET` | `/api/residents/{id}` | Returns comprehensive senior dossier and past call trends |
| `POST` | `/api/residents` | Enrolls a new senior into an old age home |
| `GET` | `/api/homes` | Lists registered old age home facilities |

---

## 🔑 Environment Variables

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="80" />
</p>

Copy `.env.example` to `.env` and configure your service credentials:

```bash
cp .env.example .env
```

| Variable Name | Required | Service | Purpose / Description |
|---|---|---|---|
| `TWILIO_ACCOUNT_SID` | **Yes** | Twilio | Twilio Account SID (`AC...`) |
| `TWILIO_AUTH_TOKEN` | **Yes** | Twilio | Twilio Account Secret Auth Token |
| `TWILIO_PHONE_NUMBER` | **Yes** | Twilio | Twilio purchased phone number (`+1...` or `+91...`) |
| `TWILIO_VERIFIED_CALLER_ID`| Optional | Twilio | Verified phone number for trial accounts (e.g. `+919821400274`) |
| `SUPABASE_URL` | **Yes** | Supabase | Supabase Project REST API URL (`https://xyz.supabase.co`) |
| `SUPABASE_ANON_KEY` | **Yes** | Supabase | Supabase anonymous public API key |
| `SUPABASE_ACCESS_TOKEN` | Optional | Supabase | Supabase management personal access token |
| `SUPABASE_PROJECT_ID` | Optional | Supabase | Project ID string |
| `ANTHROPIC_API_KEY` | **Yes** | Anthropic | Claude 3 API key (`sk-ant-...`) for conversation & analysis |
| `ELEVENLABS_API_KEY` | Optional | ElevenLabs | ElevenLabs API key for HD neural voice streaming |
| `ELEVENLABS_VOICE_ID` | Optional | ElevenLabs | Voice ID identifier (default: `21m00Tcm4TlvDq8ikWAM`) |
| `VAKH_MCP_URL` | Optional | Vakh | Vakh community feed endpoint (`https://xo.vakh.com/mcp`) |
| `VAKH_API_TOKEN` | Optional | Vakh | Authorization token for Vakh posting |
| `BASE_URL` | Optional | Server | Public URL (e.g. `https://calmie.vercel.app` or ngrok tunnel) |
| `NEXT_PUBLIC_API_URL` | Optional | Frontend | Backend base URL (default: `http://localhost:8000`) |

---

## 🛠️ Local Development Setup

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="80" />
</p>

### Prerequisites
- **Node.js** `>= 18.17.0`
- **Python** `>= 3.11`
- **npm** or **pnpm**
- **ngrok** (required only for receiving local Twilio webhook callbacks)

### 1. Clone the Repository
```bash
git clone https://github.com/brovk2008/Calmie.git
cd Calmie
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your Twilio, Anthropic, Supabase, and ElevenLabs API keys
```

### 3. Backend Setup (FastAPI)
```bash
# Create and activate Python 3.11 virtual environment
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI backend server
uvicorn backend.main:app --reload --port 8000
```
*The interactive API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).*

### 4. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

### 5. Expose Webhooks for Live Twilio Calls (Local Dev)
Because Twilio requires a public URL to deliver voice webhooks:
```bash
ngrok http 8000
```
Copy the generated ngrok URL (e.g., `https://abc-123.ngrok-free.app`) and update `BASE_URL` in your `.env`.

---

## 🚀 Deployment on Vercel

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="80" />
</p>

Calmie is engineered as a zero-config serverless monorepo on Vercel.

> 🌐 **Production Deployment Live at:** [**https://calmie-lol.vercel.app**](https://calmie-lol.vercel.app)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```
2. **Import Project on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and select the `Calmie` repository.
   - Leave the root directory as `./` (the root `vercel.json` manages both builds automatically).
3. **Set Environment Variables**:
   - Add all required variables from your `.env` in the Vercel Project Settings.
4. **Deploy**:
   - Click **Deploy**. Vercel will automatically build the Next.js static and server components while compiling the FastAPI Python lambda runtime under `@vercel/python`.

---

## 📄 License

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="100" />
</p>

```
Copyright 2026 Calmie Team (brovk2008)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

Calmie is free, open-source software licensed under the **Apache License, Version 2.0**. You are free to use, modify, distribute, and build upon this software for commercial and non-commercial purposes subject to the conditions in the [LICENSE](./LICENSE) file.

---

<p align="center">
  <img src="./Logo.png" alt="Calmie Logo" width="60" />
  <br>
  <strong>Calmie</strong> · Dedicated to the golden generation of India.
</p>
