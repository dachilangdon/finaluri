import React, { useState } from 'react';
import './LoginForm.css'; 
import { FaUserCircle } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa6';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting login form...');
    console.log('Username:', username);
    console.log('Password:', password);
    // dummy  logic 
    if (username === 'admin' && password === 'password') {
      console.log('Login successful!');
      onLogin(username);
    } else {
      console.log('Invalid username or password');
      setError('Invalid username or password');
    }
  };

  return (
    <div className="centered-container"> 
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {error && <div className="error">{error}</div>}
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUserCircle className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />Remember me
            </label>
            <a href="#">Reset Password </a>
          </div>

          <button type="submit">Login </button>

          <div className="register-link">
            <p>
              {' '}
              Don't have an account? <a href="#"> Register </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
