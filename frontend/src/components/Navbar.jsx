import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Docky</Link>
            </div>
            <div className="nav-links">
                {token ? (
                    <>
                        <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link>
                        <span className="user-name">Welcome, {user?.name}</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

