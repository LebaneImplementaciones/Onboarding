# Lebane Onboarding System

Email automation + round-robin OM/AM assignment panel for Lebane client onboarding.

## 🚀 Features

- **Email Automation**: 4 templated email flows (Bienvenida, Sesión, Calendario, FUP)
- **Round-Robin Assignment**: Fair distribution of Onboarding Managers
- **Dashboard**: Real-time tracking of email delivery and statistics
- **Configuration Panel**: Activate/deactivate OMs on the fly
- **Google Sheets Integration**: Persistent data storage and logging
- **Gmail API**: Automated email delivery with tracking

## 📋 Setup

### Prerequisites

- Next.js 14 deployed on Vercel
- Google Workspace account (OAuth configured)
- Google Sheets API enabled
- Gmail API enabled

### Environment Variables (Vercel)

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
NEXT_PUBLIC_SPREADSHEET_ID=your_sheet_id
FORMS_RESPONSE_SHEET_ID=your_forms_sheet_id
```

### 1. Create Google Sheet

1. Create a new Google Sheet
2. Note the SPREADSHEET_ID from the URL
3. Share with `implementacion@lebane.app`

### 2. Deploy to Vercel

```bash
git push origin main
```

Then configure environment variables in Vercel dashboard.

### 3. Setup Google Apps Script

1. Open your Google Sheet
2. Extensions → Apps Script
3. Copy the contents of `scripts/google-apps-script.gs`
4. Paste into the Apps Script editor
5. Save and authorize

### 4. Initialize Sheets

1. In Vercel, run the `/api/sheets/init` endpoint (or call `initializeSheets()` from backend)
2. This creates the required sheets: Email Tracking, Round-Robin Log, OM_Settings

## 📧 Email Templates

### 1. Bienvenida (Welcome)
- **Variables**: `NOMBRE_O_EMPRESA`
- **Trigger**: When new client is added
- **Description**: Initial welcome email

### 2. Sesión de Introducción (Introduction)
- **Variables**: `NOMBRE_O_EMPRESA`, `FECHA_REUNION`, `HORA_REUNION`, `LINK_REUNION`
- **Trigger**: After Discovery is completed
- **Description**: Confirms introduction session details

### 3. Calendario (Implementation) ⚠️ OM ONLY
- **Variables**: `NOMBRE_O_EMPRESA`, `IMPLEMENTADOR` (auto-filled), `CALENDARIO_URL` (auto-filled)
- **Trigger**: When stage = "Calendario"
- **Description**: Sends calendar link for implementation booking
- **CRITICAL**: Must show ONLY OM, NEVER show AM

### 4. FUP Discovery (Follow-up)
- **Variables**: `NOMBRE_O_EMPRESA`, `FORMULARIO_URL`
- **Trigger**: Daily check for incomplete Discovery (>5 days)
- **Description**: Reminder to complete Discovery form

## 🔄 Round-Robin Mechanism

The system maintains a fair rotation of OMs:

```
Client 1 → Agustín
Client 2 → Gabriela
Client 3 → Julieta
Client 4 → Brisa
Client 5 → Agustín (cycles back)
```

**Features:**
- ✅ Inactive OMs are skipped automatically
- ✅ Fair load distribution
- ✅ Configurable in `/om-config` panel
- ✅ All assignments logged

## 📊 Dashboard

### Main Dashboard
- Round-robin status and queue
- Active OMs and assignment counts
- Load distribution chart

### OM Configuration
- Toggle OMs active/inactive
- View Calendly links
- See assignment statistics

### Email Tracking
- Filter by template, status, or client
- View success rates and errors
- Distribution charts

## 🔌 API Endpoints

### Send Email
```bash
POST /api/emails/send
{
  "to": "client@example.com",
  "clientName": "Company X",
  "template": "bienvenida",
  "stage": "Bienvenida",
  "variables": {
    "NOMBRE_O_EMPRESA": "Company X"
  },
  "useRoundRobin": false,
  "omName": "Agustín Martínez" // optional, if not using round-robin
}
```

### Get Email Statistics
```bash
GET /api/stats/emails
```

### Get Round-Robin Stats
```bash
GET /api/round-robin/stats
```

### Toggle OM Status
```bash
POST /api/round-robin/om-toggle
{
  "omName": "Agustín Martínez",
  "active": false
}
```

## 📱 Google Sheets Schema

### Email Tracking
- Timestamp, Recipient, Client Name, Template, Stage, Subject, Status, Error, Variables

### Round-Robin Log
- Timestamp, Client Email, Client Name, Assigned OM, OM Email, OM Calendly, Success, Notes

### OM_Settings
- ID, Name, Email, Calendly URL, Active, Total Assigned, This Month, Last Assigned, Type

## 🧪 Testing

From Google Apps Script Editor:

```javascript
testSendWelcomeEmail(); // Send test welcome email
testSendCalendarRoundRobin(); // Test round-robin assignment
testSendCalendarToOM(); // Test sending to specific OM
```

## 🚨 Important Notes

1. **Calendario Email**: Must show ONLY OM name, NEVER include AM
2. **BCC**: All emails are BCC'd to `implementaciones@lebane.app`
3. **Refresh Token**: Must be valid and have Gmail/Sheets scopes
4. **Round-Robin State**: Stored in `RoundRobin_State` sheet using PropertiesService

## 📚 Integration Options

### Option A: From Google Forms
When a form submission creates a new row:
```javascript
function formSubmit(e) {
  sendWelcomeEmail(
    e.namedValues['Email'][0],
    e.namedValues['Company'][0],
    'https://forms.google.com/...'
  );
}
```

### Option B: From Your Backend
```bash
curl -X POST https://lebane-onboarding-implementaciones.vercel.app/api/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "client@example.com",
    "clientName": "Company X",
    "template": "bienvenida",
    "stage": "Bienvenida",
    "variables": {"NOMBRE_O_EMPRESA": "Company X"}
  }'
```

### Option C: Scheduled Triggers
Configure in Vercel or Google Cloud Scheduler to run daily:
```bash
curl -X POST https://lebane-onboarding-implementaciones.vercel.app/api/cron/daily-fup
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm build
```

## 📄 License

Copyright © 2026 Lebane. All rights reserved.
