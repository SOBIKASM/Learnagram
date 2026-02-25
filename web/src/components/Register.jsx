import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'user',
    department: '',
    year: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const { register, error } = useAuth();
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
      await register(formData);
      navigate('/navigation/home');
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='register-page'>
      <div className='register-container'>
        <div className='brand-header'>
          <h1>Learnagram</h1>
          <p className="sub-text">Sign up to collaborate with your peers and professors.</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className='register-form' onSubmit={handleSubmit}>
          {/* Section 1: Credentials */}
          <h3 className="section-title">Account Credentials</h3>
          
          <label htmlFor="username">USERNAME</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={formData.username}
            onChange={handleChange}
            placeholder='e.g. learnagram_user' 
            required 
          />      
          
          <label htmlFor="password">PASSWORD</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder='Use a strong password' 
            required 
          />
          
          <hr className="divider" />
          
          {/* Section 2: Personal & Academic Info */}
          <h3 className="section-title">Personal Information</h3>   
          
          <label htmlFor="name">FULL NAME</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name" 
            required 
          />
          
          <label htmlFor="email">EMAIL</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder='e.g. student@university.edu' 
            required 
          />
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">YEAR OF STUDY</label>
              <input 
                type="number" 
                id="year" 
                name="year" 
                value={formData.year}
                onChange={handleChange}
                placeholder="1-4" 
                required 
              />
            </div>
          </div>
          
          <label htmlFor="role">ROLE</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="user">STUDENT</option>
            <option value="prof">PROFESSOR</option>
            <option value="admin">ADMIN</option>
          </select>
          
          <label htmlFor="department">DEPARTMENT</label>
          <select id="department" name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Arts & Humanities">Arts & Humanities</option>
            <option value="Pure Sciences">Pure Sciences</option>
          </select>
          
          <label htmlFor="bio">ADD BIO</label>
          <textarea 
            id="bio" 
            name="bio" 
            rows="3" 
            value={formData.bio}
            onChange={handleChange}
            placeholder='Tell us about your research or interests...'
          ></textarea>
          
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'REGISTER ME'}
          </button>
        </form>
      </div>
      
      <div className='login-box'>
        <p>Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    </div>
  );
}

export default Register;