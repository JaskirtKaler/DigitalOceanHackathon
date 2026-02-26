import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CommandCenter from './pages/CommandCenter';
import Analytics from './pages/Analytics';
import SafetyLogs from './pages/SafetyLogs';
import ActiveMission from './pages/ActiveMission';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <SignedIn>
              <Navigate to="/command-center" replace />
            </SignedIn>
            <SignedOut>
              <Login />
            </SignedOut>
          </>
        } />
        <Route path="/command-center" element={
          <SignedIn>
            <CommandCenter />
          </SignedIn>
        } />
        <Route path="/analytics" element={
          <SignedIn>
            <Analytics />
          </SignedIn>
        } />
        <Route path="/safety-logs" element={
          <SignedIn>
            <SafetyLogs />
          </SignedIn>
        } />
        <Route path="/active-mission" element={
          <SignedIn>
            <ActiveMission />
          </SignedIn>
        } />
      </Routes>
    </Router>
  );
}

export default App;
