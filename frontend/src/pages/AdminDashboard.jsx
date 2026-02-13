import { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');
    const [activeDeadline, setActiveDeadline] = useState('');
    const [editDeadline, setEditDeadline] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchSubmissions();
        fetchDeadline();
    }, [search, date]);

    const fetchSubmissions = async () => {
        try {
            const res = await API.get(`/submissions/all?search=${search}&date=${date}`);
            setSubmissions(res.data);
        } catch (err) {
            console.error('Failed to fetch submissions');
        }
    };

    const fetchDeadline = async () => {
        try {
            const res = await API.get('/settings/deadline');
            if (res.data) {
                const d = new Date(res.data.deadline);
                // Set active deadline for display
                setActiveDeadline(res.data.deadline);

                // Adjust to local ISO string for input
                const offset = d.getTimezoneOffset() * 60000;
                const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 16);
                setEditDeadline(localISOTime);
            }
        } catch (err) {
            console.error('Failed to fetch deadline');
        }
    };

    const handleUpdateDeadline = async () => {
        try {
            await API.post('/settings/deadline', { deadline: editDeadline });
            // Update active deadline after successful save
            setActiveDeadline(editDeadline);
            setMsg(`Deadline updated to ${formatDate(editDeadline)}`);
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error('Failed to update deadline');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    };

    const handleDownload = (path, filename) => {
        const url = `http://localhost:5000/${path.replace(/\\/g, '/')}`;
        window.open(url, '_blank');
    };

    return (
        <div className="container admin-container">
            <header className="admin-header">
                <h1>Admin Intelligence Portal</h1>
                <p className="text-muted">Manage system defaults, deadlines, and review user submissions.</p>
            </header>

            <div className="admin-stats-grid">
                <div className="stat-card">
                    <span>Total Submissions</span>
                    <h2>{submissions.length}</h2>
                </div>
                <div className="stat-card" style={{ borderColor: 'var(--success)' }}>
                    <span>Active Deadline</span>
                    <h2>{activeDeadline ? formatDate(activeDeadline) : 'None'}</h2>
                </div>
                <div className="stat-card" style={{ borderColor: '#f59e0b' }}>
                    <span>Recent Activity</span>
                    <h2>Today</h2>
                </div>
            </div>

            <div className="admin-section-card">
                <h3>⚙️ Submission Deadline Control</h3>
                <div className="deadline-panel">
                    <input
                        type="datetime-local"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                    />
                    <button onClick={handleUpdateDeadline}>Update Deadline</button>
                </div>
                {msg && <p className="success-msg">{msg}</p>}
            </div>

            <div className="admin-section-card">
                <h3>🔍 Submission Database</h3>
                <div className="filters" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', flex: 1 }}
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Email Address</th>
                                <th>File Name</th>
                                <th>Timestamp</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub) => (
                                <tr key={sub.id}>
                                    <td style={{ fontWeight: '600' }}>{sub.name}</td>
                                    <td>{sub.email}</td>
                                    <td>
                                        <code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                                            {sub.file_name}
                                        </code>
                                    </td>
                                    <td>{formatDate(sub.created_at)}</td>
                                    <td>
                                        <button className="btn-download" onClick={() => handleDownload(sub.file_path, sub.file_name)}>
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
