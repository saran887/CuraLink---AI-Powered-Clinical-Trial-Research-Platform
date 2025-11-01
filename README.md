<div align="center">

# 🏥 CuraLink

### AI-Powered Clinical Trial & Research Platform

**Connecting patients with clinical trials and advancing medical research through intelligent matching**

[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge)](https://cura-link-ai-powered-clinical-trial-iota.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Live-blue?style=for-the-badge)](https://curalink-ai-powered-clinical-trial.onrender.com/docs)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 🌟 Overview

**CuraLink** is a modern, AI-powered platform that bridges the gap between patients seeking clinical trials and researchers conducting medical studies. Using Google Gemini AI, the platform provides intelligent condition detection, expert matching, and personalized trial recommendations.

### 🎯 Key Highlights

- 🤖 **AI-Powered Matching** - Google Gemini integration for smart condition detection and expert recommendations
- 🔍 **Real-Time Data** - Integration with PubMed, ClinicalTrials.gov, and ORCID APIs
- 🌐 **Global Reach** - Location-based search with interactive maps
- 📱 **Responsive Design** - Seamless experience across all devices
- ⚡ **Fast & Modern** - Built with React 18, FastAPI, and Vite

---

## ✨ Features

### For Patients 👤

| Feature | Description |
|---------|-------------|
| **� Smart Onboarding** | AI-powered condition detection from symptom descriptions |
| **🔬 Trial Discovery** | Find relevant clinical trials based on your condition and location |
| **�🏥 Expert Matching** | Get AI recommendations for health experts in your area |
| **📚 Research Access** | Browse latest medical publications and research papers |
| **💬 Community Forum** | Connect with other patients and share experiences |
| **⭐ Save Favorites** | Bookmark trials and publications for easy access |

### For Researchers 🔬

| Feature | Description |
|---------|-------------|
| **📊 Trial Management** | Create and manage clinical trials with detailed information |
| **📝 Publish Research** | Share publications and findings with the community |
| **🤝 Networking** | Connect with other researchers and health experts |
| **🔗 ORCID Integration** | Link your ORCID profile and ResearchGate |
| **📅 Meeting Scheduler** | Coordinate meetings with patients and collaborators |
| **📈 Analytics** | Track views and engagement on your trials |

### AI-Powered Features 🤖

- **Condition Detection** - Extract medical conditions from natural language descriptions
- **Expert Matching** - AI recommendations based on specialties and location
- **Eligibility Analysis** - Determine trial suitability for patients
- **Content Summarization** - Get concise summaries of trials and publications

---

## 🛠️ Tech Stack

### Backend
```
🐍 FastAPI 0.104.1        - Modern Python web framework
📊 SQLAlchemy 2.0.44      - ORM with Python 3.13 support
🤖 Google Gemini AI       - AI-powered features
🔗 REST APIs              - PubMed, ClinicalTrials.gov, ORCID
🔐 Pydantic               - Data validation
```

### Frontend
```
⚛️  React 18              - UI library with hooks
⚡ Vite 5                 - Lightning-fast build tool
🎨 Tailwind CSS          - Utility-first styling
🔀 React Router v6        - Client-side routing
📡 Axios                  - HTTP client
🗺️  Leaflet               - Interactive maps
```

### Deployment
```
🚀 Vercel                 - Frontend hosting
☁️  Render                 - Backend hosting
🐙 GitHub                 - Version control
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 16+
- Git

### 🔧 Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/saran887/CuraLink---AI-Powered-Clinical-Trial-Research-Platform.git
   cd CuraLink---AI-Powered-Clinical-Trial-Research-Platform/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file
   GOOGLE_API_KEY=your_gemini_api_key
   DATABASE_URL=sqlite:///./curalink.db
   DEBUG=True
   ```

5. **Run the server**
   ```bash
   uvicorn main:app --reload
   ```

   Backend running at: `http://localhost:8000`
   
   API Docs: `http://localhost:8000/docs`

### 💻 Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Frontend running at: `http://localhost:5173`

---

## 📚 API Documentation

### Base URL
- **Production**: `https://curalink-ai-powered-clinical-trial.onrender.com/api`
- **Local**: `http://localhost:8000/api`

### Core Endpoints

#### 👤 Users
```http
POST   /api/users/signup          # Create account
POST   /api/users/login           # Login
GET    /api/users/{id}            # Get user profile
PUT    /api/users/{id}            # Update profile
```

#### 🔬 Clinical Trials
```http
GET    /api/trials/               # List all trials
POST   /api/trials/               # Create trial
GET    /api/trials/{id}           # Get trial details
PUT    /api/trials/{id}           # Update trial
DELETE /api/trials/{id}           # Delete trial
```

#### 🤖 AI Features
```http
POST   /api/ai/extract-conditions # Extract conditions from symptoms
POST   /api/ai/match-experts      # Get expert recommendations
POST   /api/ai/summarize          # Summarize content
POST   /api/ai/analyze-eligibility # Check trial eligibility
```

#### 🌐 External APIs
```http
GET    /api/external/trials       # Search ClinicalTrials.gov
GET    /api/external/publications # Search PubMed
GET    /api/external/orcid/{id}   # Get ORCID profile
```

**Full API Documentation**: [Swagger UI](https://curalink-ai-powered-clinical-trial.onrender.com/docs)

---

## 📁 Project Structure

```
curalink/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── database.py                # Database configuration
│   ├── models.py                  # SQLAlchemy models
│   ├── schemas.py                 # Pydantic schemas
│   ├── requirements.txt           # Python dependencies
│   └── routers/
│       ├── users.py              # User authentication & profiles
│       ├── trials.py             # Clinical trials CRUD
│       ├── publications.py       # Publications management
│       ├── forum.py              # Community forum
│       ├── ai.py                 # Google Gemini AI integration
│       ├── connections.py        # User networking
│       ├── meetings.py           # Meeting scheduler
│       └── external_apis.py      # External API integrations
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx       # Landing page
    │   │   ├── PatientOnboard.jsx # Patient registration
    │   │   ├── ResearcherOnboard.jsx # Researcher registration
    │   │   ├── PatientDashboard.jsx # Patient dashboard
    │   │   ├── ResearcherDashboard.jsx # Researcher dashboard
    │   │   ├── HealthExperts.jsx  # Expert directory
    │   │   ├── Collaborators.jsx  # Networking
    │   │   └── Forum.jsx          # Community forum
    │   │
    │   ├── components/
    │   │   ├── Navbar.jsx         # Navigation bar
    │   │   ├── Footer.jsx         # Footer
    │   │   └── QuickActions.jsx   # Action buttons
    │   │
    │   └── services/
    │       └── api.js             # API client
    │
    ├── package.json
    └── vite.config.js
```

---

## 🚢 Deployment

### Live Deployment

- **Frontend**: [https://cura-link-ai-powered-clinical-trial-iota.vercel.app](https://cura-link-ai-powered-clinical-trial-iota.vercel.app)
- **Backend**: [https://curalink-ai-powered-clinical-trial.onrender.com](https://curalink-ai-powered-clinical-trial.onrender.com)

### Deploy Your Own

#### Backend (Render)
1. Fork this repository
2. Create a new Web Service on [Render](https://render.com)
3. Connect your GitHub repository
4. Set Root Directory: `backend`
5. Add environment variables (GOOGLE_API_KEY, etc.)
6. Deploy!

#### Frontend (Vercel)
1. Import project on [Vercel](https://vercel.com)
2. Set Root Directory: `frontend`
3. Add environment variable: `VITE_API_URL`
4. Deploy!

---

## 🎨 Screenshots

<div align="center">

### 🏠 Landing Page
*Modern, responsive design with clear call-to-actions*

### 👤 Patient Dashboard
*Personalized trial recommendations and saved favorites*

### 🔬 Researcher Dashboard
*Manage trials, publications, and collaborations*

### 🤖 AI Features
*Intelligent condition detection and expert matching*

</div>

---

## 🔐 Security & Privacy

- ✅ Input validation with Pydantic
- ✅ CORS protection
- ✅ Environment variables for sensitive data
- ✅ SQL injection prevention with SQLAlchemy
- ⚠️ Note: This is a demo project. For production, implement:
  - JWT authentication
  - Password hashing (bcrypt)
  - Rate limiting
  - HTTPS only
  - GDPR compliance

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] User authentication (Patient & Researcher)
- [x] Clinical trial CRUD operations
- [x] Publication management
- [x] Community forum
- [x] Google Gemini AI integration
- [x] External API integrations (PubMed, ClinicalTrials.gov, ORCID)

### Phase 2: Enhanced Features 🚧
- [ ] Email notifications
- [ ] Real-time chat
- [ ] Advanced search filters
- [ ] Data analytics dashboard
- [ ] Mobile app (React Native)

### Phase 3: Enterprise 📋
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Regulatory compliance tools
- [ ] Advanced AI features
- [ ] White-label solutions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Saran**
- GitHub: [@saran887](https://github.com/saran887)
- Project Link: [CuraLink Platform](https://github.com/saran887/CuraLink---AI-Powered-Clinical-Trial-Research-Platform)

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [Google Gemini AI](https://ai.google.dev/) - AI integration
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [PubMed API](https://www.ncbi.nlm.nih.gov/home/develop/api/) - Medical literature
- [ClinicalTrials.gov API](https://clinicaltrials.gov/data-api/about-api) - Trial data
- [ORCID API](https://orcid.org/) - Researcher profiles

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for advancing medical research and patient care**

[Report Bug](https://github.com/saran887/CuraLink---AI-Powered-Clinical-Trial-Research-Platform/issues) • [Request Feature](https://github.com/saran887/CuraLink---AI-Powered-Clinical-Trial-Research-Platform/issues)

</div>

---

## 🚀 Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy ORM** - Database management
- **SQLite** - Lightweight database (for MVP)
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client

---

## 📁 Project Structure

```
curalink/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── requirements.txt     # Python dependencies
│   └── routers/
│       ├── users.py         # User authentication
│       ├── trials.py        # Clinical trials CRUD
│       ├── publications.py  # Publications CRUD
│       ├── forum.py         # Forum posts
│       └── ai.py            # AI summarization
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── pages/
        │   ├── Landing.jsx
        │   ├── PatientOnboard.jsx
        │   ├── PatientDashboard.jsx
        │   ├── ResearcherDashboard.jsx
        │   ├── Forum.jsx
        │   └── Favorites.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Card.jsx
        │   ├── Loader.jsx
        │   └── Toast.jsx
        └── services/
            └── api.js       # Axios API service
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Python 3.8+**
- **Node.js 16+** and **npm**

### Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Create virtual environment:**
   ```powershell
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate
   ```

4. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

5. **Run the backend server:**
   ```powershell
   uvicorn main:app --reload
   ```

   The backend API will be available at: **http://localhost:8000**

   API Documentation: **http://localhost:8000/docs**

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Run the development server:**
   ```powershell
   npm run dev
   ```

   The frontend will be available at: **http://localhost:5173**

---

## 🎯 Features

### For Patients 👤
- **Personalized Onboarding** - Enter your condition and location
- **Recommended Trials** - Find clinical trials matching your profile
- **Research Access** - Browse latest publications
- **AI Summaries** - Get quick summaries of trials and publications
- **Save Favorites** - Bookmark trials and publications
- **Community Forum** - Connect with others

### For Researchers 🔬
- **Trial Management** - Create and manage clinical trials
- **Publish Research** - Share publications with the community
- **Collaboration** - Connect with other researchers
- **Dashboard Analytics** - View your trials and publications

### AI Features ✨
- **Smart Summarization** - AI-powered summaries of trials and publications
- **Quick Insights** - Get key information at a glance

---

## 📊 Database Models

### User
- `id` - Primary key
- `name` - User's full name
- `role` - "patient" or "researcher"
- `condition` - Medical condition (for patients)
- `location` - Geographic location

### Trial
- `id` - Primary key
- `title` - Trial name
- `condition` - Target condition
- `phase` - Phase I, II, III, or IV
- `location` - Trial location
- `description` - Detailed description
- `researcher_id` - Foreign key to User

### Publication
- `id` - Primary key
- `title` - Publication title
- `summary` - Abstract/summary
- `researcher_id` - Foreign key to User

### ForumPost
- `id` - Primary key
- `author_id` - Foreign key to User
- `content` - Post content

### Favorite
- `id` - Primary key
- `user_id` - Foreign key to User
- `item_type` - "trial" or "publication"
- `item_id` - ID of the saved item

---

## 🌐 API Endpoints

### Users
- `POST /api/users/signup` - Create new user
- `POST /api/users/login` - Login user
- `GET /api/users/{user_id}` - Get user by ID
- `GET /api/users/` - Get all users

### Trials
- `POST /api/trials/` - Create trial
- `GET /api/trials/` - Get all trials (with filters)
- `GET /api/trials/{trial_id}` - Get trial by ID
- `PUT /api/trials/{trial_id}` - Update trial
- `DELETE /api/trials/{trial_id}` - Delete trial

### Publications
- `POST /api/publications/` - Create publication
- `GET /api/publications/` - Get all publications
- `GET /api/publications/{publication_id}` - Get publication by ID
- `PUT /api/publications/{publication_id}` - Update publication
- `DELETE /api/publications/{publication_id}` - Delete publication

### Forum
- `POST /api/forum/` - Create post
- `GET /api/forum/` - Get all posts
- `GET /api/forum/{post_id}` - Get post by ID
- `DELETE /api/forum/{post_id}` - Delete post

### AI
- `POST /api/ai/summarize` - Generate summary
- `GET /api/ai/health` - Check AI service status

---

## 🎨 Design System

### Colors
- **Primary Blue**: `#2563EB`
- **Secondary Blue**: `#1E40AF`
- **Background**: `#F9FAFB` (gray-50)
- **White**: `#FFFFFF`

### Typography
- **Font**: System fonts (San Francisco, Segoe UI, Roboto)
- **Headings**: Bold, 2xl to 5xl
- **Body**: Regular, base to lg

### Components
- **Rounded corners**: `rounded-2xl`, `rounded-3xl`
- **Shadows**: `shadow-md`, `shadow-xl`, `shadow-2xl`
- **Hover effects**: Smooth transitions with `hover:shadow-xl`
- **Cards**: White background with padding and shadow

---

## 🧪 Testing

### Backend Testing
```powershell
cd backend
# Visit http://localhost:8000/docs for interactive API testing
```

### Frontend Testing
```powershell
cd frontend
npm run dev
# Open http://localhost:5173 in your browser
```

---

## 📱 Responsive Design

CuraLink is fully responsive and works seamlessly on:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)

---

## 🚢 Production Deployment

### Backend
1. Update database to PostgreSQL or MySQL
2. Add environment variables for secrets
3. Enable HTTPS
4. Deploy to:
   - **Railway**
   - **Heroku**
   - **AWS EC2**
   - **Google Cloud Run**

### Frontend
1. Build for production:
   ```powershell
   npm run build
   ```

2. Deploy `dist/` folder to:
   - **Vercel**
   - **Netlify**
   - **AWS S3 + CloudFront**

---

## 🔐 Security Notes (Production)

⚠️ **This is an MVP. For production:**
- Add proper authentication (JWT tokens)
- Implement password hashing
- Add rate limiting
- Enable HTTPS
- Validate all inputs
- Add CSRF protection
- Implement proper error handling

---

## 📝 License

MIT License - Feel free to use for personal or commercial projects

---

## 👨‍💻 Developer

Built by a senior full-stack engineer for the CuraLink MVP project.

---

## 🤝 Contributing

This is an MVP project. Future enhancements:
- Real AI integration (GPT-4, Claude)
- User authentication with JWT
- Email notifications
- Advanced search filters
- Messaging system
- Mobile app (React Native)

---

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**Happy Coding! 🚀**
