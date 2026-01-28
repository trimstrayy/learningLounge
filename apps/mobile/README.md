# Lexora Mobile App

This is a placeholder for the React Native mobile application.

## Setup Instructions

When ready to initialize the mobile app:

```bash
# Navigate to the apps/mobile directory
cd apps/mobile

# Initialize with Expo (recommended for React Native)
npx create-expo-app@latest . --template blank-typescript

# Or with React Native CLI
npx react-native init LexoraMobile --template react-native-template-typescript
```

## Shared Code

The mobile app uses shared types, utilities, and constants from `@lexora/core`:

```typescript
import { 
  TestType, 
  WritingEvaluation,
  calculateBandScore,
  APP_NAME 
} from '@lexora/core';
```

## Architecture

The monorepo structure:

```
lexora-monorepo/
├── apps/
│   ├── web/          # React + Vite web app
│   └── mobile/       # React Native mobile app (this folder)
├── packages/
│   └── core/         # Shared types, utils, constants
└── package.json      # Workspace root
```
