import { useState, useEffect, useRef } from 'react';
import API from '../services/api';

const UserDashboard = () => {
    const [file, setFile] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [deadline, setDeadline] = useState(null);
    const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchMySubmissions();
        fetchDeadline();
    }, []);

    const fetchMySubmissions = async () => {
        try {
            const res = await API.get('/submissions/my');
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
                setDeadline(d);
                if (new Date() > d) {
                    setIsDeadlinePassed(true);
                }
            }
        } catch (err) {
            console.error('Failed to fetch deadline');
        }
    };

    const handleFileChange = (e) => {
        if (isDeadlinePassed) return;
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validate type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(pdf|doc|docx)$/i)) {
            setError('Only PDF, DOC, DOCX files are allowed');
            setFile(null);
            return;
        }

        // Validate size (5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            setFile(null);
            return;
        }

        setError('');
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await API.post('/submissions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage('Document submitted successfully!');
            setFile(null);
            fileInputRef.current.value = '';
            fetchMySubmissions();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    };

    const handleDownload = (path) => {
        const url = `http://localhost:5000/${path.replace(/\\/g, '/')}`;
        window.open(url, '_blank');
    };

    return (
        <div className="container dashboard-container">
            <h1>Welcome, {user?.name}</h1>

            <div className="upload-section">
                <h3>Upload Document</h3>
                {deadline && (
                    <div className={`deadline-info ${isDeadlinePassed ? 'passed' : ''}`}>
                        <p><strong>Deadline:</strong> {formatDate(deadline)}</p>
                        {isDeadlinePassed && <p className="error-msg">The submission deadline has passed.</p>}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isDeadlinePassed}
                        required
                    />
                    {file && <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>Selected: {file.name}</p>}
                    <button type="submit" disabled={!file || isDeadlinePassed}>
                        {isDeadlinePassed ? 'Deadline Passed' : 'Submit Document'}
                    </button>
                </form>
                {message && <p className="success-msg">{message}</p>}
                {error && <p className="error-msg">{error}</p>}
            </div>

            <div className="submissions-list">
                <h3>Your Submissions</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub) => (
                                <tr key={sub.id}>
                                    <td>{sub.file_name}</td>
                                    <td>{formatDate(sub.created_at)}</td>
                                    <td>
                                        <button onClick={() => handleDownload(sub.file_path)} className="btn-download">
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && <tr><td colSpan="3">No submissions yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
