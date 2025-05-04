# Asana & WhatsApp Assistant (TaskFlowAI)

This is a modern full-stack application that integrates Asana task management with WhatsApp messaging capability, powered by an AI assistant.

## Features

- **Google Authentication**: Secure login with Google OAuth
- **Task Management**: Create, track, and complete tasks in Asana
- **WhatsApp Integration**: Send messages and task notifications directly through WhatsApp
- **AI Assistant**: Get help from an intelligent assistant to manage tasks and communications efficiently
- **Modern UI**: Sleek, responsive interface built with Next.js and Tailwind CSS

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL database
- Google OAuth credentials
- Asana API key
- Twilio account (for WhatsApp)
- OpenAI API key

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd frontend-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/asana_whatsapp_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# API integration
ASANA_ACCESS_TOKEN="your-asana-access-token"
ASANA_PROJECT_ID="your-asana-project-id"
ASANA_WORKSPACE_ID="your-asana-workspace-id"

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_WHATSAPP_FROM="your-twilio-whatsapp-number"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4o"
```

### 4. Set up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
7. Copy the Client ID and Client Secret to your `.env` file

### 5. Set up the database and generate Prisma client

```bash
# Create database tables
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Backend API Setup

The backend API is built with FastAPI and provides endpoints for Asana tasks, WhatsApp messaging, and AI chat.

1. Navigate to the backend directory:

```bash
cd ../
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Start the API server:

```bash
python -m uvicorn api:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000).

## Database Schema

The database schema includes the following models:

- **User**: User account information
- **Profile**: Extended user profile with role information
- **Account**: OAuth account connections
- **Session**: User session data
- **VerificationToken**: Email verification tokens

You can view and manage the database using Prisma Studio:

```bash
npx prisma studio
```

## Deployment

### Next.js Frontend

The frontend can be deployed to Vercel:

```bash
npm run build
vercel --prod
```

### FastAPI Backend

The backend can be deployed to various platforms like Heroku, Railway, or as a Docker container.

## License

MIT
