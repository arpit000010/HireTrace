# HireTrace Application (Frontend)

The frontend for HireTrace is a sophisticated, high-performance Single Page Application (SPA) natively built using **React 19 (Vite) and Tailwind CSS**.

## 🎨 UI & UX Design Philosophy
HireTrace was designed with a heavy emphasis on a premium, modern "SaaS" aesthetic modeled after industry leaders like Linear and Vercel. 

### Core Design Elements:
- **Glassmorphism:** Navigation bars and authentication cards utilize deep translucent blur layers (`backdrop-blur-xl`) resting on top of floating radial background gradients.
- **Micro-Animations:** Fluid, interactive UX. Buttons transition smoothly, and dynamic components gently float over the Y-axis when hovered.
- **Deep Dark Mode Architecture:** The CSS foundation uses a proprietary palette (zinc/indigo) built into standard browser CSS Custom Variables (`var(--bg-primary)`), allowing infinite scalability across the app.
- **Typography:** Refined font smoothing and specific line heights for enhanced text legibility.

## 🏗 Directory Structure
```
src/
├── api/          # Pre-configured Axios instance matching BaseURLs and interceptors
├── components/   # Modular, reusable building blocks (Navbar, ExperienceCard, etc.)
├── context/      # Global state providers (Authentication Context)
├── hooks/        # Custom React logic hooks
├── pages/        # High-level layouts handling the React Router routing tree
└── index.css     # Global CSS resets, Tailwind imports, and core CSS variables
```

## 🔒 State & Authentication
The React app securely maps front-end permissions to the backend API:
- **Axios Interceptors**: The Axios instance completely automates token management. If a request throws a `401 Unauthorized`, the interceptor securely pings `/api/auth/refresh` behind the scenes, stores the fresh Access Token in `localStorage`, and perfectly replays the originally failed request—making it entirely invisible to the user.
- **React Context**: `<AuthProvider>` wraps the entire application, tracking whether the user is fully logged in, loading, or null.
- **Protected Routes**: Specific pages (like the Feed and Bookmarks) enforce authentication by bouncing unverified users back to the Registration page.

## 🚦 Routing (React Router)
The application utilizes `react-router-dom` to map URL endpoints without requiring full page renders:
- Public Routes: `/login`, `/register`.
- Private Routes: `/`, `/experience/:id`, `/create`, `/profile`.
- **Vercel Config**: Includes a `vercel.json` file securely mapping Vercel's cloud configuration to redirect wildcard routes back to `index.html`.

## 🛠 Running the Application Locally

```bash
# Install dependencies
npm install

# Start Vite's lightning-fast dev server
npm run dev
```

*Don't forget to configure your `.env` file!*
```env
# Change this to your deployed Render backend API URL when deploying to production
VITE_API_URL=http://localhost:5001/api
```
