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
    <div className="signupPage">
      <form onSubmit={handleSubmit} noValidate>
        <h3>Sign Up</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" name="username" className="form-control" required value={formData.username} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" required value={formData.password} onChange={handleChange} />
        </div>

        <button className="btn btn-success" type="submit">Signup</button>
      </form>
    </div>
  );
}
