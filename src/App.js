import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import Main from './Components/MainPage/Main';
import Home from './Components/Home/Home';
import Header from './Components/Header/Header';
import Watchlist from './Components/Watchlist/Watchlist';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginData = localStorage.getItem('loginData');
      if (loginData) {
        const { username, loginTime } = JSON.parse(loginData);
        const currentTime = new Date().getTime();
        const sessionDuration = 15 * 60 * 1000; // 15 minutes 
        if (currentTime - loginTime < sessionDuration) {
          setIsLoggedIn(true);
          setUsername(username);
        } else {
          // Clear localStorage and log the user out
          localStorage.removeItem('loginData');
          setIsLoggedIn(false);
          setUsername('');
        }
      }
    };

    checkLoginStatus();
  }, []); // only once on initial render

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    const loginTime = new Date().getTime();
    localStorage.setItem('loginData', JSON.stringify({ username, loginTime }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('loginData');
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Header handleLogout={handleLogout} username={username} />}
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Main username={username} /> : <LoginForm onLogin={handleLogin} />}
          />
          <Route path="/home/:movieId" element={<Home />} />
          <Route path="/watchlist" element={<Watchlist />} /> {/* Route for the Watchlist component */}
          {!isLoggedIn && <Route path="/login" element={<Navigate to="/" />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
