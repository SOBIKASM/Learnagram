import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='brand-header'>
          <h1>Learnagram</h1>
        </div>
        
        <form className='login-form'>
          <label htmlFor="username">USERNAME</label>
          <input type="text" id="username" name="username" placeholder='e.g. learnagram_user' required />
          
          <label htmlFor="password">PASSWORD</label>
          <input type="password" id="password" name="password" placeholder='Use a strong password' required />
          <button className="submit-btn" type="submit">Log In</button>
          
          <div className="separator">
            <div className="line"></div>
            <div className="or-text">OR</div>
            <div className="line"></div>
          </div>

          <button type="button" className="google-btn">
            <span className="google-icon">G</span> Log in with Google
          </button>
        </form>
      </div>

      <div className='signup-box'>
        <p>Don't have an account? <a href="/register">Sign up</a></p>
      </div>
    </div>
  );
}

export default Login;