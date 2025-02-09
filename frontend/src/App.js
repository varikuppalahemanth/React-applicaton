import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import SuccessPage from './SuccessPage';

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields.');
      return;
    }
  
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
  
    // Clear error on successful validation
    setError('');
  
    // Send data to backend
    const url = isSignUp ? '/api/auth/register' : '/api/auth/login';
    try {
      const response = await fetch(`http://localhost:5000${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        if (isSignUp) {
          alert('Sign Up Successful!');
        } else {
          // Navigate to the success page after successful sign-in
          navigate('/success');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="App">
       <video autoPlay loop muted className="background-video">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="usernameOrEmail">Username or Email:</label>
          <input
            type="text"
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>

        <div className="password-container">
          <label htmlFor="password">Password:</label>
          <div className="password-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-hide-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <p>
        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
        <button className="toggle-button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;