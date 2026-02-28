# ClassNote

**Where learning meets conversation.** A discussion platform built for college students. Ask questions, share resources, and connect with classmates – all in one place.

## Features

- **Course discussions** – Ask questions and get answers from classmates and TAs
- **Anonymous posting** – Post anonymously when you need to
- **Real-time chat** – Quick messages with classmates for instant collaboration
- **Course enrollment** – Browse and enroll in courses, access discussions and resources
- **Authentication** – Sign up, log in, password reset
- **Dark/light theme** – System-aware theme toggle

## Tech Stack

- **Frontend**: Vite, React, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **Backend**: Supabase (auth, database)
- **Data**: TanStack Query (React Query), React Router
- **Forms**: React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd classnoteco

# Install dependencies
npm i

# Set up environment variables
# Create a .env file with your Supabase credentials:
#   VITE_SUPABASE_URL=your_supabase_url
#   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Start the development server
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Vitest |

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (e.g. AuthContext)
├── data/           # Mock data
├── hooks/          # Custom hooks (usePosts, useEnrollments)
├── integrations/   # Supabase client and types
├── pages/          # Route pages (Dashboard, Course, Login, etc.)
└── App.tsx
```

## License

© 2026 ClassNote. Made for students, by students.
