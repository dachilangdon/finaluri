// Header.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; //useNavigate hook
import logoImage from './Movieweb_Logo.png';
import './Header.css';

const Header = ({ handleLogout, username }) => {
  const navigate = useNavigate(); // useNavigate hook

  const handleLogoutClick = () => {
    handleLogout(); //  logout  prop
    navigate('/'); // redirection login
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logoImage} alt="Logo" className="logo-img" />
      </div>
      <nav className="nav-links">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/watchlist">Watchlist</Link></li>
          
        </ul>
      </nav>
      <div className="user-info">
        {username && <span className="user-label">User: </span>}
        {username && <span className="username">{username}</span>}
        <button className="logout-btn" onClick={handleLogoutClick}>Log Out</button> {/* Call handleLogoutClick */}
      </div>
    </header>
  );
};

export default Header;
