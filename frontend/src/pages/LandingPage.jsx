import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <h1 className="landing-logo">DOCKY</h1>
            <p className="landing-subtitle">Document Submission & Management System</p>

            <div className="role-selection">
                <div className="role-card" onClick={() => navigate('/login?role=user')}>
                    <div className="role-icon">👤</div>
                    <h3>User</h3>
                    <p>Submit and track your documents</p>
                    <button className="btn-role">Go to User Login</button>
                </div>

                <div className="role-card admin-card" onClick={() => navigate('/login?role=admin')}>
                    <div className="role-icon">🔐</div>
                    <h3>Admin</h3>
                    <p>Manage and review submissions</p>
                    <button className="btn-role">Go to Admin Login</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
