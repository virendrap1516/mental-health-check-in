import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Button from './components/UI/Button';
import Card from './components/UI/Card';

// ... rest of the code remains the same

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to MindCheck 🧠
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your personal mental health companion. Track your mood, manage stress, 
          and journal your thoughts in a secure, private environment.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">Sign In</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card hover={false}>
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your journal entries are encrypted and only accessible by you</p>
          </Card>
          <Card hover={false}>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Visualize your mood patterns and identify trends over time</p>
          </Card>
          <Card hover={false}>
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-lg font-semibold mb-2">Self-Care First</h3>
            <p className="text-gray-600">Daily check-ins help you stay mindful of your mental wellness</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;