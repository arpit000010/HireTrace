# HireTrace 🚀

HireTrace is a full-stack web application designed to help tech professionals share, explore, and learn from real interview experiences. Built with a modern dark-mode aesthetic, it provides a seamless and interactive platform for candidates to document their interview rounds, questions, and outcomes.

## 🌟 Features

### Robust Authentication
- Secure JWT-based authentication using HTTP-only cookies.
- Automatic Access & Refresh token rotation system.
- Full Email Verification flow powered by Nodemailer.
- Protected routes and persistent login state.

### Discover Experiences
- **Global Feed**: Browse recent interview experiences shared by the community.
- **Advanced Search & Filter**: Filter experiences by Company, Job Role, Difficulty, and Final Result.
- **Trending & Analytics**: Built-in algorithms highlight the most upvoted and useful interviews.

### Interactive Community
- **Rich Experience Details**: View comprehensive breakdowns of interview rounds, specific technical questions asked, and actionable tips.
- **Vote System**: Upvote the most helpful interview breakdowns (Reddit-style).
- **Commenting**: Ask questions on experiences with full Comment CRUD operations.
- **Bookmarking**: Save important posts to your private bookmarks page for offline review later.

## 🛠️ Tech Stack

**Frontend (Client)**
- React 19 (via Vite)
- Tailwind CSS v4 (Custom Dark Theme UX/UI)
- React Router DOM v7
- Lucide React (Iconography)
- React Hot Toast
- Axios (with JWT interceptors)

**Backend (Server)**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) + Cookie-parser
- Bcrypt.js (Password hashing)
- Nodemailer + Ethereal (Email handling)

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have Node.js and MongoDB installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/HireTrace.git
cd HireTrace
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```
Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5001/api
```
Run the frontend server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

---
*If you like this project, don't forget to star the repository!* ⭐
