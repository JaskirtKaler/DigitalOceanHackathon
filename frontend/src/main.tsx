import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'YOUR_PUBLISHABLE_KEY') {
  const message = !PUBLISHABLE_KEY
    ? "Missing Clerk Publishable Key in .env.local"
    : "Clerk Publishable Key is still set to placeholder 'YOUR_PUBLISHABLE_KEY' in .env.local";

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ color: '#ef4444' }}>Configuration Error</h1>
        <p>{message}</p>
        <p>Please update your <code>.env.local</code> file with your actual Clerk Publishable Key and restart the server.</p>
      </div>
    </StrictMode>,
  )
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}


