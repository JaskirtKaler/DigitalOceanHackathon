import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CommandCenter from './pages/CommandCenter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/command-center" element={<CommandCenter />} />
      </Routes>
    </Router>
  );
}

export default App;
