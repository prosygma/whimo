# Whimo

A supply chain traceability platform that allows tracking product origins and history through the entire supply chain.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js** 20+ (Alpine recommended)
- **npm** (comes with Node.js)
- **Google OAuth Client ID** (optional, for OAuth authentication)

## Environment Setup

The project requires environment variables prefixed with `VITE_` to be accessible in the browser.

### Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
VITE_BASE_URL=http://localhost:3000
VITE_API_URL=https://your-api-url.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Variable Descriptions:**
- `VITE_BASE_URL` - Frontend application URL (used for OAuth redirects)
- `VITE_API_URL` - Backend API base URL used in production builds and as the proxy target in local development
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID from Google Cloud Console

You can use the provided `.env.local.example` file as a template:

```bash
cp .env.local.example .env.local
```

## Installation

Install project dependencies:

```bash
npm install
```

## Running the Project

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

**Note:** The dev server proxies `/api/*` requests to the configured backend API.

### Production Build

Build the application for production:

```bash
npm run build
```

The build output will be in the `/dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - TypeScript type check + Vite production build
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

## Project Structure

```
whimo/
├── src/
│   ├── views/              # Page-level components
│   │   ├── Analytics/      # Analytics dashboard page
│   │   ├── Balance/        # Balance overview page
│   │   ├── Transactions/   # Transaction management page
│   │   ├── Settings/       # User settings page
│   │   ├── Login/          # Login page
│   │   ├── Registration/   # Registration page
│   │   └── ForgotPassword/ # Password recovery page
│   ├── components/         # Reusable React components
│   │   ├── uikit/          # UI component library (Button, Input, Modal, etc.)
│   │   ├── Layouts/        # Layout wrappers (DashboardLayout, NoAuthLayout)
│   │   └── [feature]/      # Feature-specific components
│   ├── api/                # API integration layer
│   │   ├── axiosApi.ts     # Axios instance with interceptors
│   │   ├── schemas/        # Zod validation schemas
│   │   └── types/          # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React Context providers
│   ├── helpers/            # Utility functions
│   ├── assets/             # Static assets (images, icons)
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # React DOM entry point
│   ├── i18n.ts             # Internationalization configuration
│   └── index.css           # Global styles
├── public/ 
│   └── locales/            # Translation files (en, fr, es)
├── dist/                   # Build output (generated)
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
├── .prettierrc             # Prettier configuration
└── package.json            # Project dependencies
```

## Main Technologies & Libraries

### Core Framework
- **React** 19.1.1 - UI library
- **TypeScript** 5.9.3 - Type safety
- **Vite** 7.1.7 - Fast build tool and dev server

### Routing & State Management
- **React Router DOM** 7.9.4 - Client-side routing with nested routes
- **TanStack React Query** 5.90.5 - Server state management and caching
- **Axios** 1.12.2 - HTTP client with interceptors

### Forms & Validation
- **React Hook Form** 7.65.0 - Form state management
- **Zod** 4.1.12 - TypeScript-first schema validation
- **@hookform/resolvers** 5.2.2 - Schema validation integration

### UI & Styling
- **Tailwind CSS** 4.1.15 - Utility-first CSS framework
- **Radix UI** - Accessible component primitives (Popover, Tooltip)
- **@heroicons/react** 2.2.0 - Icon library
- **Class Variance Authority** 0.7.1 - Type-safe component variants

### Authentication
- **JWT Tokens** - Access and refresh token authentication
- **@react-oauth/google** 0.12.2 - Google OAuth integration

### Internationalization
- **i18next** 25.6.0 - Internationalization framework
- **react-i18next** 16.2.1 - React integration
- **Supported Languages:** English, French, Spanish

### Data Visualization
- **Chart.js** 4.5.1 - Charting library
- **react-chartjs-2** 5.3.1 - React wrapper for Chart.js

### UI Components
- **react-toastify** 11.0.5 - Toast notifications
- **react-day-picker** 9.11.1 - Date picker
- **react-phone-number-input** 3.4.13 - Phone number input
- **react-otp-input** 3.1.1 - OTP input

### Utilities
- **date-fns** 4.1.0 - Date manipulation
- **@uidotdev/usehooks** 2.4.1 - Useful React hooks

## Key Features

### Authentication System
- JWT token-based authentication (access + refresh tokens)
- Automatic token refresh on 401 responses
- Google OAuth integration
- Protected routes with authentication guards

### API Integration
- Centralized Axios instance with request/response interceptors
- Automatic Bearer token injection
- Language header injection based on user preference
- Organized API methods by feature (auth, user, transactions, balance, analytics)

### Internationalization
- Multi-language support (English, French, Spanish)
- Language preference persisted in localStorage
- Dynamic translation loading from JSON files

### Error Handling
- Centralized error handler with toast notifications
- Automatic error translation to user's language
- Custom error icons and styling

### Routing
- Protected routes for authenticated pages
- Public routes for login, registration, password recovery
- Layout-based routing (authenticated vs. public)

## Docker Deployment

The project includes Docker configuration for containerized deployment:

```bash
docker-compose up
```

**Build Arguments:**
- `VITE_API_URL` - Backend API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `VITE_BASE_URL` - Frontend base URL

The Docker setup uses a multi-stage build with Node 20 Alpine and exports the built application to an external volume.

## Additional Information

- **Dev Server Port:** 3000
- **API Proxy:** In development mode, `/api/*` requests are proxied to the URL specified in `VITE_API_URL`
- **Token Storage:** Authentication tokens stored in localStorage
- **Language Storage:** User language preference stored in localStorage under key `app_language`
- **Adding New Locales:** To add a new language, create a directory in `/public/locales/{language-code}/` with JSON files for each namespace (common, login, registration, forgot_password, balance, transactions, analytics, settings, notifications), then add the language code to the `availableLanguages` array in `src/i18n.ts`
