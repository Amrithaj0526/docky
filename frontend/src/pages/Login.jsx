import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const role = params.get('role'); // user or admin

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <h2>{role === 'admin' ? 'Admin Access' : 'User Access'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error-msg">{error}</p>}
            <p>Don't have an account? <Link to="/signup">Signup</Link></p>
        </div>
    );
};

export default Login;
