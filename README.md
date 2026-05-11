# GymApp

GymApp is a high-performance mobile application designed for **gym workout tracking, routine management, and training analytics**.

Built with an **offline-first architecture**, the app is optimized to provide a fast, interruption-free experience during active training sessions, ensuring that users can log workouts, track progress, and manage routines without relying on an internet connection.

The entire project has been architected and accelerated with the support of **AI-assisted software development workflows**, focusing on maintainability, scalability, and production-grade frontend patterns.

---

## Core Features

### Dashboard & Progress Tracking

- Quick access to daily training metrics
- Current streak tracking
- Session summary widgets
- Personalized progress overview

### Routine Builder

- Create fully custom workout routines
- Configure rest timers per exercise
- Superset and grouped exercise support
- Structured training blocks

### Active Training Mode

- Integrated workout timer
- Rest countdown system
- Previous-session weight recommendation
- Automatic personal record (PR) detection
- Fast set logging optimized for in-gym usage

### Training History

- Full session history
- Exercise-level performance tracking
- Historical load and repetition analysis

### Advanced Analytics

- Weekly training volume charts
- Muscle group balance analysis
- Progressive overload tracking
- Strength evolution metrics

---

## Tech Stack

### Frontend

- **React Native**
- **Expo**
- **TypeScript (strict mode)**
- **Expo Router**

### UI / Design System

- **Tamagui**
- Custom design token system
- Reusable typography scale
- Theme-based semantic colors

### Performance

- **FlashList** for high-performance long lists
- **React Native Reanimated** for smooth transitions and microinteractions
- Optimized rendering flows
- Minimal unnecessary re-renders

### State Management

- **Zustand**

### Architecture

- **MVVM**
- **Clean Architecture**
- Service Layer abstraction
- Feature-oriented modular structure

This stack aligns well with current React Native + Expo production best practices.

---

## Architecture Overview

The project follows a **strict separation of concerns**.

### Presentation Layer

Responsible only for:

- rendering UI
- handling user interactions
- visual state transitions

This layer contains:

- screens
- reusable components
- hooks
- view models

### Domain Layer

Contains:

- business rules
- workout logic
- progress calculations
- record detection algorithms

### Data / Service Layer

Responsible for:

- local persistence
- state synchronization
- routine/session data access
- domain adapters

The UI layer contains **zero business logic**, ensuring scalability and maintainability.

---

## Project Philosophy

GymApp is designed around three technical priorities:

### 1. Performance First

The application must remain fluid during active workout sessions.

### 2. Offline First

Core functionality must work without internet access.

### 3. Scalable Architecture

The codebase is structured to support long-term feature growth and professional team workflows.

---

## Local Development

### Prerequisites

Make sure you have installed:

- **Node.js**
- **npm / pnpm**
- **Expo CLI**
- Android Studio / Xcode emulator environment
- Physical device with Expo Go (optional)

---

## Installation

```bash
git clone <repository-url>
cd GymApp
npm install
```

---

## Run Development Server

```bash
npx expo start
```

Then open the app in:

- Android Emulator
- iOS Simulator
- Expo Go
- Development Build

---

## Development Standards

- Strict TypeScript typing
- Feature isolation
- Reusable UI primitives
- Domain-driven services
- Clean folder boundaries
- Performance-aware rendering

---

## Roadmap

Planned future improvements:

- cloud sync
- user authentication
- social workout sharing
- advanced PR insights
- AI-assisted routine generation
- recovery and fatigue analytics

---

## License

Private project — all rights reserved.
