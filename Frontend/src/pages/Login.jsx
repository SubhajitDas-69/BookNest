import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
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
      const response = await fetch('https://booknest-3ev5.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed.');
      } else {
        setSuccessMessage(data.message);
        setFormData({ username: '', password: '' });
         window.location.href = data.redirectTo;
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="loginPage d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>

        {error && <div className="alert alert-danger text-center">{error}</div>}
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
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-control" 
              required 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter your password"
            />
          </div>

          <button className="btn btn-success w-100" type="submit">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
