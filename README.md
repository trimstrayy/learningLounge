# Lexora IELTS - Monorepo

A modern, AI-powered IELTS preparation platform with web and mobile apps.

## 📁 Monorepo Structure

```
lexora-monorepo/
├── apps/
│   ├── web/              # React + Vite web application
│   └── mobile/           # React Native mobile app (coming soon)
├── packages/
│   └── core/             # Shared types, utilities, and constants
├── supabase/             # Supabase Edge Functions and migrations
├── scripts/              # Build and utility scripts
└── package.json          # Workspace root configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/trimstrayy/learningLounge.git
cd learningLounge

# Install all dependencies (root + all workspaces)
npm install
```

### Development

```bash
# Start the web app
npm run dev

# Or explicitly
npm run dev:web
```

The web app will be available at `http://localhost:5173`

### Build

```bash
# Build the web app
npm run build

# Preview production build
npm run preview
```

## 📦 Packages

### @lexora/core

Shared code used by both web and mobile apps:

- **Types**: Question schemas, user types, evaluation types
- **Utils**: Band score calculations, formatting helpers, validation
- **Constants**: App-wide constants, API endpoints, storage keys

```typescript
// Usage in apps
import { 
  TestType, 
  WritingEvaluation,
  calculateBandScore,
  formatTime,
  APP_NAME 
} from '@lexora/core';
```

### @lexora/web

The React web application built with:

- React 18 + TypeScript
- Vite for development and building
- Tailwind CSS + shadcn/ui for styling
- Supabase for backend (auth, database, storage)
- Framer Motion for animations

### @lexora/mobile (Coming Soon)

React Native mobile application sharing the same core logic.

## 🧪 Features

### Mock IELTS Tests

- **Listening Test**: Audio-based questions with Cambridge materials
- **Reading Test**: Passage-based questions with timer
- **Writing Test**: AI-powered evaluation with Task 1 & Task 2
- **Speaking Test**: Full speaking simulation with AI evaluation

### AI Evaluation

- Powered by OpenAI and Groq APIs
- Detailed band score breakdown
- Criteria-specific feedback
- Improvement suggestions

## 🛠️ Development

### Adding to Core Package

When adding shared code:

1. Add files to `packages/core/src/`
2. Export from the appropriate index file
3. Both web and mobile apps will have access

### Workspace Commands

```bash
# Run command in specific workspace
npm run dev --workspace=@lexora/web
npm run build --workspace=@lexora/web

# Run lint across all workspaces
npm run lint

# Clean all build artifacts and node_modules
npm run clean
```

## 📝 Environment Variables

Create a `.env` file in `apps/web/`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for IELTS learners by Lexora Team
