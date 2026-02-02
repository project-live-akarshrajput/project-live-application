# LiveChat - Random Video Chat Application

A professional, scalable live video chat application similar to Chatroulette. Built with Next.js 14, MongoDB Atlas, Supabase, and Redis for high-performance real-time communication.

## 🚀 Features

- **Instant Video Matching** - Get connected with random users in seconds
- **Gender Filters** - Choose to match with specific genders
- **WebRTC Video Calls** - Peer-to-peer HD video with low latency
- **Secure Authentication** - NextAuth.js with JWT sessions
- **Profile Management** - Upload photos, update preferences
- **Report System** - Keep the community safe
- **Scalable Architecture** - Redis-powered matchmaking queue
- **Mobile Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Database**: MongoDB Atlas (user data)
- **File Storage**: Supabase Storage (profile images)
- **Queue/Cache**: Redis (Upstash for production)
- **Real-time**: Socket.io, WebRTC
- **Validation**: Zod

## 📁 Project Structure

```
livechat-connect/
├── server/                 # Socket.io signaling server
│   ├── index.ts           # Server entry point
│   └── signaling.ts       # WebRTC signaling & matchmaking
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── chat/         # Video chat room
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   ├── profile/      # User profile
│   │   └── ...           # Static pages
│   ├── components/        # React components
│   │   ├── layout/       # Header, Footer
│   │   ├── ui/           # Reusable UI components
│   │   └── video/        # Video chat components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities & configurations
│   │   ├── auth/         # NextAuth configuration
│   │   ├── db/           # Database connections
│   │   ├── models/       # Mongoose models
│   │   └── validations/  # Zod schemas
│   ├── store/            # Zustand state management
│   └── types/            # TypeScript type definitions
└── ...config files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Supabase account
- Redis (local or Upstash)

### 1. Clone & Install

```bash
git clone <repository-url>
cd livechat-connect
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/livechat

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-characters

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Redis
REDIS_URL=redis://localhost:6379

# Socket Server
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Create a storage bucket named `profile-images`
3. Set bucket to public or configure RLS policies
4. Copy the URL and keys to your `.env`

### 4. MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Create a database named `livechat`
3. Copy the connection string to your `.env`

### 5. Redis Setup

**Local Development:**

```bash
# macOS
brew install redis
redis-server

# Ubuntu
sudo apt install redis-server
sudo systemctl start redis
```

**Production (Upstash):**

1. Create an Upstash Redis instance
2. Copy the connection URL to your `.env`

### 6. Run Development Servers

```bash
# Run both Next.js and Socket.io server
npm run dev:all

# Or run separately:
npm run dev        # Next.js (port 3000)
npm run server     # Socket.io (port 3001)
```

Visit `http://localhost:3000`

## 📦 Building for Production

```bash
# Build Next.js
npm run build

# Start production server
npm run start
```

## 🚢 Deployment

### Vercel (Frontend)

1. Connect your GitHub repo to Vercel
2. Add environment variables
3. Deploy

### Railway/Render (Socket Server)

1. Create a new service from the repository
2. Set start command: `npm run server`
3. Add environment variables
4. Deploy

### Docker (Full Stack)

```dockerfile
# Dockerfile example coming soon
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Sessions**: Secure, httpOnly cookies
- **Input Validation**: Zod schemas on all endpoints
- **Rate Limiting**: Prevent spam and abuse
- **Report System**: User reports with auto-ban threshold
- **Age Verification**: 18+ requirement enforced

## 📊 Scalability

The application is designed to handle high traffic:

- **Redis Queue**: O(1) matchmaking operations
- **WebRTC P2P**: Video doesn't pass through servers
- **MongoDB Indexes**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Horizontal Scaling**: Stateless architecture

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This application is for educational purposes. Ensure compliance with local laws regarding video chat services. Implement appropriate moderation for production use.
# Force rebuild
