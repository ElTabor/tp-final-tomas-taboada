import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckCircle, Circle, LogOut } from 'lucide-react';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Simple auth state
    const [authMode, setAuthMode] = useState('login'); // login or register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // For simplicity in this "basic" frontend, we'll assume valid if exists
            // In a real app, we'd verify the token with the backend
            setUser({ token });
            fetchTasks(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchTasks = async (token) => {
        try {
            const res = await axios.get('/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const res = await axios.post(endpoint, { email, password });

            // The backend returns accessToken in login and register depending on implementation
            // Some backends set cookies. Based on src/app.js, it uses cookies for refreshToken
            // and likely returns accessToken in body for login.
            const token = res.data.accessToken;
            if (token) {
                localStorage.setItem('token', token);
                setUser({ token });
                fetchTasks(token);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Auth failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setTasks([]);
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        try {
            const res = await axios.post('/api/tasks',
                { title: newTitle },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setTasks([...tasks, res.data]);
            setNewTitle('');
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTask = async (task) => {
        try {
            const res = await axios.patch(`/api/tasks/${task._id}`,
                { completed: !task.completed },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setTasks(tasks.map(t => t._id === task._id ? res.data : t));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    if (!user) {
        return (
            <div className="container">
                <div className="glass-card">
                    <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>
                    <form onSubmit={handleAuth} style={{ marginTop: '1.5rem' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <span
                            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
                        >
                            {authMode === 'login' ? 'Register' : 'Login'}
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>My Tasks</h1>
                    <button onClick={handleLogout} className="btn btn-ghost" title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>

                <form onSubmit={addTask} style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                        <Plus size={20} />
                    </button>
                </form>

                <ul className="task-list">
                    {tasks.map(task => (
                        <li key={task._id} className="task-item">
                            <div className="task-content">
                                <div onClick={() => toggleTask(task)} style={{ cursor: 'pointer' }}>
                                    {task.completed ?
                                        <CheckCircle className="success" style={{ color: 'var(--success)' }} /> :
                                        <Circle />
                                    }
                                </div>
                                <span className={task.completed ? 'completed' : ''}>
                                    {task.title}
                                </span>
                            </div>
                            <button onClick={() => deleteTask(task._id)} className="btn btn-ghost" style={{ border: 'none', padding: '0.5rem' }}>
                                <Trash2 size={18} color="var(--danger)" />
                            </button>
                        </li>
                    ))}
                </ul>

                {tasks.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        No tasks yet. Add one above!
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;
