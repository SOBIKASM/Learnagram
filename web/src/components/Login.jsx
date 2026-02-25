import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      navigate('/navigation/home');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for demo
  const fillDemoCredentials = () => {
    setFormData({
      username: 'learnagram',
      password: 'learnagram'
    });
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='brand-header'>
          <h1>Learnagram</h1>
          <p className="demo-hint">✨ Demo Login: username: <strong>learnagram</strong> | password: <strong>learnagram</strong> ✨</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form className='login-form' onSubmit={handleSubmit}>
          <label htmlFor="username">USERNAME</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={formData.username}
            onChange={handleChange}
            placeholder='Enter username' 
            autoComplete="username"
            required 
          />
          
          <label htmlFor="password">PASSWORD</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder='Enter password' 
            autoComplete="current-password"
            required 
          />
          
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <button 
            type="button" 
            className="demo-fill-btn" 
            onClick={fillDemoCredentials}
          >
            🔑 Use Demo Credentials
          </button>
          
          <div className="separator">
            <div className="line"></div>
            <div className="or-text">OR</div>
            <div className="line"></div>
          </div>
          
          <button type="button" className="google-btn" disabled>
            <span className="google-icon">G</span> Log in with Google
          </button>
        </form>
      </div>
      
      <div className='signup-box'>
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
}

export default Login;