import React from 'react';
import './Register.css';

function Register() {
  return (
    <div className='register-page'>
      <div className='register-container'>
        <div className='brand-header'>
          <h1>Learnagram</h1>
          <p className="sub-text">Sign up to collaborate with your peers and professors.</p>
        </div>

        <form className='register-form'>
          {/* Section 1: Credentials */}
          <h3 className="section-title">Account Credentials</h3>
          <label htmlFor="username">USERNAME</label>
          <input type="text" id="username" name="username" placeholder='e.g. learnagram_user' required />
          
          <label htmlFor="password">PASSWORD</label>
          <input type="password" id="password" name="password" placeholder='Use a strong password' required />

          <hr className="divider" />

          {/* Section 2: Personal & Academic Info */}
          <h3 className="section-title">Personal Information</h3>
          
          <label htmlFor="name">FULL NAME</label>
          <input id="name" name="name" type="text" placeholder="Enter your full name" required />

          <label htmlFor="email">EMAIL</label>
          <input type="email" id="email" name="email" placeholder='e.g. student@university.edu' required />

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">DATE OF BIRTH</label>
              <input type="date" id="dob" name="dob" required />
            </div>
            <div className="form-group">
              <label htmlFor="year">YEAR OF STUDY</label>
              <input type="number" id="year" name="year" placeholder="1-4" required />
            </div>
          </div>

          <label htmlFor="role">ROLE</label>
          <select id="role" name="role">
            <option value="user">STUDENT</option>
            <option value="prof">PROFESSOR</option>
            <option value="admin">ADMIN</option>
          </select>

          <label htmlFor="dept">DEPARTMENT</label>
          <select id="dept" name="dept">
            <option value="">Select Department</option>
            <option value="cs">Computer Science</option>
            <option value="eng">Engineering</option>
            <option value="arts">Arts & Humanities</option>
            <option value="sci">Pure Sciences</option>
          </select>

          <label htmlFor="bio">ADD BIO</label>
          <textarea id="bio" name="bio" rows="3" minLength="10" maxLength="60" placeholder='Tell us about your research or interests...'></textarea>

          <button className="submit-btn" type="submit">REGISTER ME</button>
        </form>
      </div>

      <div className='login-box'>
        <p>Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
}

export default Register;