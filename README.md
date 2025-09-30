# Job Application Tracker

A comprehensive MERN stack application to track job applications with Google authentication, built with Next.js frontend and Nest.js backend.

## Features

- 🔐 **Google Authentication** - Sign in with Google only
- 📊 **Job Application Tracking** - Track applications, interviews, and responses
- 💼 **Resume Management** - Track which resume was used for each application
- ❓ **Interview Questions** - Record interview questions and answers, including LeetCode links
- 📱 **Mobile Responsive** - Works seamlessly on mobile devices
- 🎯 **Column Configuration** - Customize which columns to display globally
- 📄 **Pagination** - 25 latest applications per page
- 📈 **Dashboard Statistics** - Overview of application status

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Nest.js, Node.js, TypeScript
- **Database**: MongoDB
- **Authentication**: NextAuth.js with Google Provider
- **UI Components**: Headless UI, Heroicons
- **Form Handling**: React Hook Form
- **Date Handling**: React DatePicker, date-fns

## Project Structure

```
job-application-tracker/
├── client/                 # Next.js frontend
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Next.js pages
│   ├── styles/           # CSS styles
│   └── types/            # TypeScript types
├── server/                # Nest.js backend
│   └── src/
│       ├── job-application/  # Job application module
│       └── main.ts          # Application entry point
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- MongoDB
- Google OAuth credentials

### 1. Clone the repository

```bash
git clone <repository-url>
cd job-application-tracker
```

### 2. Setup Backend

```bash
cd server
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your MongoDB URI and other settings
```

### 3. Setup Frontend

```bash
cd ../client
npm install

# Copy environment variables  
cp .env.local.example .env.local

# Edit .env.local with your Google OAuth credentials and API URLs
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 5. Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/job-tracker
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=mongodb://localhost:27017/job-tracker
API_BASE_URL=http://localhost:3001
```

### 6. Start the Application

#### Start Backend
```bash
cd server
npm run start:dev
```

#### Start Frontend  
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## Application Features

### Job Application Fields

- **Basic Info**: Company name, job title, application date, status
- **Job Details**: Description, URL, salary, location, work type, job type
- **Contact Info**: Contact person, email
- **Resume**: Track which resume version was used
- **Interview**: Date, type, questions and answers
- **LeetCode**: Links to coding problems discussed
- **Follow-up**: Response dates, rejection reasons, follow-up dates
- **Notes**: Additional notes

### Application Statuses

- Applied
- Under Review
- Interview Scheduled
- Interviewed
- Offer Received
- Rejected
- Withdrawn
- Accepted

### Interview Question Categories

- Technical
- Behavioral
- System Design
- Coding
- Experience

### Column Configuration

Users can customize which columns are displayed in the table:
- Required columns (Company, Job Title, Status, Applied Date) cannot be hidden
- Optional columns can be toggled on/off
- Settings persist globally using localStorage

## API Endpoints

### Job Applications
- `GET /api/job-applications` - Get paginated applications
- `POST /api/job-applications` - Create new application
- `GET /api/job-applications/:id` - Get single application
- `PATCH /api/job-applications/:id` - Update application
- `DELETE /api/job-applications/:id` - Delete application
- `GET /api/job-applications/stats` - Get application statistics

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.