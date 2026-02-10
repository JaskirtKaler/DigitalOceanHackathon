import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CommandCenter from './pages/CommandCenter';
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
      </Routes>
    </Router>
  );
}

export default App;
