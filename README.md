# CuraLink MVP 🏥

**CuraLink** connects patients and researchers to discover clinical trials, publications, and health experts through a clean, responsive, and modern web application.

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
