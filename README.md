# AuthNest - Next.js Firebase Authentication Starter

This is a starter project built with Next.js, Firebase Authentication, ShadCN/ui, Tailwind CSS, and pre-configured for Genkit AI integration. It provides a simple login interface (Email/Password and Google Sign-In) and a protected dashboard page.

## Features

- **Authentication:** Secure user login using Firebase Authentication (Email/Password and Google).
- **Protected Routes:** Example of a dashboard page accessible only to authenticated users.
- **UI Components:** Built with [ShadCN/ui](https://ui.shadcn.com/) for reusable and accessible components.
- **Styling:** Styled with [Tailwind CSS](https://tailwindcss.com/) using CSS variables for easy theme customization.
- **TypeScript:** Type safety throughout the application.
- **Genkit Ready:** Pre-configured setup for integrating Google AI features using [Genkit](https://firebase.google.com/docs/genkit).
- **Error Handling:** Robust error handling for Firebase initialization and authentication flows.
- **Responsive Design:** Adapts to different screen sizes.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/) (Authentication)
- [ShadCN/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Icons)
- [Zod](https://zod.dev/) (Schema validation)
- [React Hook Form](https://react-hook-form.com/)
- [Genkit](https://firebase.google.com/docs/genkit) (for AI features)
- [Google AI](https://ai.google.dev/) (via Genkit)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Firebase Setup

1.  **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication:** In your Firebase project, go to the "Authentication" section and enable the "Email/Password" and "Google" sign-in methods.
3.  **Get Firebase Configuration:**
    - Go to your Project settings > General tab.
    - Scroll down to "Your apps".
    - Click on the "Web" icon (`</>`) to register a new web app (or use an existing one).
    - Copy the `firebaseConfig` object values.
4.  **Set up Environment Variables:**

    - Create a file named `.env.local` in the root of your project.
    - Add your Firebase configuration values to this file, prefixing each key with `NEXT_PUBLIC_`:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
    # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID # Optional

    # For Genkit (if using AI features)
    GOOGLE_GENAI_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```

    - Replace `YOUR_...` with your actual Firebase project values.
    - **Important:** Never commit your `.env.local` file to version control. The `.gitignore` file should already include it.

### Genkit AI Setup (Optional)

1.  **Get Google AI API Key:** Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Add to Environment Variables:** Add the key to your `.env.local` file as `GOOGLE_GENAI_API_KEY`.

### Running the Application

1.  **Start the development server:**

    ```bash
    npm run dev
    ```

    This will start the Next.js development server, typically on `http://localhost:9002`.

2.  **(Optional) Start the Genkit development server (if using AI features):**
    Open a separate terminal and run:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit flow server, allowing you to test and interact with your AI flows.

## Project Structure

```
.
├── public/             # Static assets
├── src/
│   ├── ai/             # Genkit AI configuration and flows
│   │   ├── flows/      # Genkit flow definitions
│   │   ├── ai-instance.ts # Genkit initialization
│   │   └── dev.ts      # Genkit development server entry point
│   ├── app/            # Next.js App Router pages and layouts
│   │   ├── (auth)/     # Routes related to authentication (example)
│   │   ├── dashboard/  # Protected dashboard route
│   │   ├── protected/  # Old protected route (redirects to dashboard)
│   │   ├── globals.css # Global styles and Tailwind directives
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Login page (root)
│   ├── components/     # Reusable React components
│   │   ├── auth/       # Authentication-specific components
│   │   └── ui/         # ShadCN UI components
│   ├── hooks/          # Custom React hooks (e.g., useAuth, useToast)
│   ├── lib/            # Utility functions and libraries
│   │   ├── firebase/   # Firebase configuration and utilities
│   │   └── utils.ts    # General utility functions (e.g., cn)
│   └── ...
├── .env.local          # Environment variables (!!! DO NOT COMMIT !!!)
├── components.json     # ShadCN UI configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Available Scripts

- `npm run dev`: Starts the Next.js development server (with Turbopack).
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code style issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
- `npm run genkit:dev`: Starts the Genkit flow server once.
- `npm run genkit:watch`: Starts the Genkit flow server in watch mode.

## Environment Variables

Make sure to create a `.env.local` file in the project root with the following variables:

```env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID # Optional

# Genkit Configuration (Optional - Required for AI features)
GOOGLE_GENAI_API_KEY=YOUR_GOOGLE_AI_API_KEY
```

## Deployment

You can deploy this application to platforms like [Vercel](https://vercel.com/) (recommended for Next.js) or [Firebase Hosting](https://firebase.google.com/docs/hosting).

### Vercel

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Connect your repository to Vercel.
3.  Configure the environment variables in the Vercel project settings (using the same names as in `.env.local`).
4.  Vercel will automatically build and deploy your application.

---

Happy Coding!
