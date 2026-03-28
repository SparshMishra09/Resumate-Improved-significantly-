# 🚀 Resumate - AI-Powered Resume Optimizer

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange.svg)](https://firebase.google.com/)

**Resumate** is an AI-powered resume optimization platform that helps job seekers create ATS-friendly resumes and find their dream jobs.

---

## ✨ Features

### 🎯 Core Features

- **ATS Resume Scoring** - Get accurate ATS (Applicant Tracking System) scores for your resume
- **AI Resume Improvement** - Receive professional suggestions to optimize your resume
- **Job-Tailored Resumes** - Convert your resume to match specific job postings
- **Job Discovery** - Browse jobs and internships from multiple sources
- **Saved Jobs** - Bookmark and track job opportunities
- **Credit System** - Each user gets 1 free credit to try all features

### 🔐 Authentication

- Secure email/password authentication via Firebase
- User credit management (1 free credit on signup)
- Profile management

### 💼 Job Search

- Integration with multiple job APIs (Arbeitnow, Adzuna)
- Advanced filtering (keyword, location, job type, remote)
- Save jobs to your personal collection
- Tailor your resume for specific job postings

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router 6** - Routing
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend & Services
- **Firebase** - Authentication & Database
- **Firebase Firestore** - NoSQL database
- **OpenRouter API** - AI model access (Gemini, Groq, Grok, Claude)
- **Arbeitnow API** - Job listings
- **Adzuna API** - Job listings

### Build Tools
- **Vite** - Build tool
- **Axios** - HTTP client
- **Zod** - Schema validation
- **PDF.js** - PDF parsing
- **jsPDF** - PDF generation

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- API keys for:
  - Firebase
  - OpenRouter (or individual AI providers: Gemini, Groq, Grok, Claude)
  - Adzuna (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resumate.git
   cd resumate
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # AI API Keys (at least one required)
   VITE_GROQ_API_KEY=your_groq_key  # Recommended (FREE + FAST)
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_CLAUDE_API_KEY=your_claude_key
   VITE_GROK_API_KEY=your_grok_key
   VITE_OPENROUTER_API_KEY=your_openrouter_key
   
   # Job APIs (optional)
   VITE_ADZUNA_APP_ID=your_adzuna_app_id
   VITE_ADZUNA_API_KEY=your_adzuna_api_key
   ```

4. **Set up Firebase**
   
   a. Go to [Firebase Console](https://console.firebase.google.com/)
   b. Create a new project
   c. Enable Authentication (Email/Password)
   d. Create Firestore Database
   e. Deploy Firestore rules from `firestore.rules`
   f. Copy your config to `.env`

5. **Start the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

---

## 📖 Usage

### For Job Seekers

1. **Sign Up** - Create a free account and get 1 credit
2. **Upload Resume** - Upload your current resume (PDF or TXT)
3. **Get ATS Score** - Receive instant analysis and suggestions
4. **Improve Resume** - Use AI to optimize your resume
5. **Find Jobs** - Browse job listings
6. **Tailor Resume** - Convert your resume for specific jobs
7. **Save Jobs** - Bookmark interesting opportunities

### Credit System

- Each user gets **1 free credit** on signup
- **1 credit = 1 feature use** (ATS score, improvement, or tailoring)
- Credits are deducted automatically when using features
- Contact support for additional credits

---

## 📁 Project Structure

```
resumate/
├── src/                      # Frontend source code
│   ├── components/           # React components
│   ├── pages/                # Page components
│   ├── services/             # API services
│   ├── context/              # React context
│   ├── config/               # Configuration files
│   └── utils/                # Utility functions
├── server/                   # Backend server
│   ├── server.js             # Express server
│   └── package.json          # Backend dependencies
├── public/                   # Static assets
├── firestore.rules           # Firebase security rules
├── firebase.json             # Firebase configuration
└── package.json              # Frontend dependencies
```

---

## 🔒 Security

### Firestore Rules

The project includes comprehensive Firestore rules that:
- Allow public read access to active job listings
- Require authentication for write operations
- Isolate user-specific data (profiles, saved jobs, resumes)
- Implement soft deletes for job listings

Deploy rules with:
```bash
firebase deploy --only firestore:rules
```

### API Key Security

- **Never commit** `.env` file to version control
- All API calls go through backend proxy
- Frontend never exposes API keys directly

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI model access
- [Groq](https://groq.com/) for fast AI inference
- [Arbeitnow](https://www.arbeitnow.com/) for job API
- [Adzuna](https://www.adzuna.com/) for job listings
- [Firebase](https://firebase.google.com/) for backend services

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@resumate.ai (placeholder)

---

## 🎯 Roadmap

- [ ] Premium credit packages
- [ ] Resume templates
- [ ] Cover letter generation
- [ ] Application tracking
- [ ] Interview preparation
- [ ] Resume version history
- [ ] LinkedIn profile optimization

---

**Built with ❤️ for job seekers everywhere**
