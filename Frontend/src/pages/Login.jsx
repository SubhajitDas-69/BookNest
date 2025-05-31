import { useState } from 'react';

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
      const response = await fetch('https://booknest-cnfb.onrender.com/login', {
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
    <div className="signupPage">
      <form onSubmit={handleSubmit} noValidate>
      <h3>Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" name="username" className="form-control" required value={formData.username} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" required value={formData.password} onChange={handleChange} />
        </div>

        <button className="btn btn-success" type="submit">Login</button>
      </form>
    </div>
  );
}
