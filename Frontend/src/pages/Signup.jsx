import React, { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('https://booknest-3ev5.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Signup failed.');
      } else {
        setSuccessMessage(data.message);
        setFormData({ username: '', email: '', password: '' });
        window.location.href = data.redirectTo;
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  };

  return (
   <div className="signupPage d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '420px' }}>
        <h3 className="text-center mb-4">Create Account</h3>

        {error && !error.toLowerCase().includes("password") && (
          <div className="alert alert-danger text-center">{error}</div>
        )}
        {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              name="username"
              className="form-control" 
              required 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className={`form-control ${error.toLowerCase().includes("password") ? "is-invalid" : ""}`} 
              required 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter a strong password"
            />
            {/* Show backend password error directly under the field */}
            {error && error.toLowerCase().includes("password") && (
              <div className="invalid-feedback">{error}</div>
            )}
          </div>

          <button className="btn btn-success w-100" type="submit">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Already have an account? <a href="/login">Login</a>
          </small>
        </div>
      </div>
    </div>
  );
}
