import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobs from './pages/Jobs';
import Internships from './pages/Internships';
import ConvertResume from './pages/ConvertResume';
import SavedJobs from './pages/SavedJobs';
import About from './pages/About';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#0f172a]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/convert-resume" element={<ConvertResume />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
