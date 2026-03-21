# Prism — Instagram Clone Frontend

A full-featured Instagram-like frontend built with **React (Vite)** + **Tailwind CSS**, designed to connect with a Node.js + Express + MongoDB backend.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
cd instagram-clone
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

> If your backend runs on a different port, update this. The Vite dev server also proxies `/api` → `localhost:5000` by default (see `vite.config.js`).

### 3. Start development server

```bash
npm run dev
```

App runs at **http://localhost:5173**

### 4. Build for production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── context/
│   └── AuthContext.jsx       # JWT auth state via Context API
├── services/
│   ├── api.js                # Axios instance with interceptors
│   ├── authService.js        # Login / register / me
│   ├── postService.js        # CRUD + like/unlike
│   └── userService.js        # Follow/unfollow, search, profile
├── hooks/
│   └── usePostActions.js     # useLike, useFollow, useAsync hooks
├── components/
│   ├── Layout.jsx            # Outlet wrapper
│   ├── Navbar.jsx            # Desktop sidebar + mobile header/bottom nav
│   ├── PostCard.jsx          # Full post card + skeleton
│   ├── UserCard.jsx          # User card + skeleton
│   └── ProtectedRoute.jsx    # Auth guard
└── pages/
    ├── Login.jsx
    ├── Register.jsx
    ├── Home.jsx              # Feed + stories + suggestions
    ├── Profile.jsx           # Profile page + post grid
    ├── CreatePost.jsx        # Multi-step post creation
    ├── PostDetail.jsx        # Single post view
    ├── Explore.jsx           # Search + explore grid
    └── NotFound.jsx
```

---

## 🔗 Backend API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/posts` | All posts (feed) |
| POST | `/api/posts` | Create post (multipart) |
| GET | `/api/posts/details/:postId` | Single post |
| GET | `/api/posts/user/:username` | User's posts |
| DELETE | `/api/posts/:postId` | Delete own post |
| POST | `/api/like/:postId` | Like a post |
| DELETE | `/api/unlike/:postId` | Unlike a post |
| POST | `/api/follow/:username` | Follow user |
| DELETE | `/api/unfollow/:username` | Unfollow user |
| GET | `/api/users/:username` | User profile |
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/users/suggested` | Suggested users |
| GET | `/api/users/:username/followers` | Followers list |
| GET | `/api/users/:username/following` | Following list |

---

## 🎨 Design System

**Theme:** Dark luxury aesthetic — deep zinc surfaces, gradient brand accents, Playfair Display + DM Sans typography.

**Colors:**
- Background: `#0a0a0b` (surface-0)
- Cards: `#18181b` (surface-2)
- Brand gradient: purple → violet → blue

**Components:**
- `.btn-primary` — gradient brand button
- `.btn-secondary` — outlined secondary
- `.card` — dark card with border
- `.input-field` — consistent dark input
- `.skeleton` — shimmer loading placeholder

---

## ✨ Features

- 🔐 JWT authentication with localStorage persistence
- 🛡️ Protected routes with loading state
- 📸 Multi-step post creation with drag & drop
- ❤️ Optimistic like/unlike (instant UI feedback)
- 👥 Optimistic follow/unfollow
- 🔍 Debounced user search
- 📱 Fully responsive (mobile bottom nav + desktop sidebar)
- 💀 Skeleton loaders everywhere
- 🔔 Toast notifications (react-hot-toast)
- 📄 Post detail modal-style layout
- 👤 Profile page with followers/following modals
- 🗂️ Explore page with grid + people tabs

---

## 🛠️ Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| React Router | 6 | Routing |
| Axios | 1.6 | HTTP client |
| react-hot-toast | 2.4 | Notifications |
| lucide-react | 0.294 | Icons |

---

## 💡 Tips

- **Backend response format:** The services handle both `{ data }` and `{ posts }` / `{ user }` wrapped responses.
- **Image upload:** Uses `multipart/form-data`. Make sure your backend parses it with `multer`.
- **Token:** Stored in `localStorage` as `prism_token`. Automatically attached to all requests.
- **Double tap to like:** Works on post images just like Instagram!
