import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Login.css';

function Login() {
    const { login, ROLES } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('MANAGER');
    const [username, setUsername] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Validate inputs
        if (!username.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!employeeId.trim()) {
            setError('Please enter your Employee ID');
            return;
        }

        if (!password.trim()) {
            setError('Please enter your password');
            return;
        }

        setIsLoading(true);

        // Simulate authentication delay
        setTimeout(() => {
            const result = login(selectedRole, username, employeeId.toUpperCase().trim(), password);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
                setPassword('');
            }

            setIsLoading(false);
        }, 600);
    };

    const roleCards = [
        {
            key: 'OPERATOR',
            icon: '👷',
            features: ['View machine status', 'Basic monitoring', 'Safety alerts']
        },
        {
            key: 'ENGINEER',
            icon: '🔧',
            features: ['Machine diagnostics', 'Health analytics', 'Maintenance alerts']
        },
        {
            key: 'MANAGER',
            icon: '👔',
            features: ['Complete overview', 'All analytics', 'System management']
        }
    ];

    const getEmployeeIdPlaceholder = () => {
        const prefixes = {
            'OPERATOR': 'OP-101',
            'ENGINEER': 'EN-201',
            'MANAGER': 'MG-301'
        };
        return prefixes[selectedRole] || 'Enter Employee ID';
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="heartbeat-animation">
                    <div className="pulse pulse-1"></div>
                    <div className="pulse pulse-2"></div>
                    <div className="pulse pulse-3"></div>
                </div>
            </div>

            <div className="login-card">
                <div className="login-header">
                    <div className="brand-logo">
                        <span className="factory-icon">🏭</span>
                        <h1 className="brand-name">IndusMind</h1>
                    </div>
                    <p className="brand-tagline">Smart Factory Monitoring System</p>
                    <div className="industry-badge">Industry 4.0 Platform</div>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {/* Name Input */}
                    <div className="form-group">
                        <label htmlFor="username">👤 Full Name</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your full name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                            autoFocus
                        />
                    </div>

                    {/* Employee ID Input */}
                    <div className="form-group">
                        <label htmlFor="employee-id">🆔 Employee ID</label>
                        <input
                            type="text"
                            id="employee-id"
                            placeholder={getEmployeeIdPlaceholder()}
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                            className="login-input employee-id-input"
                        />
                        <p className="security-hint">💡 Format: OP-XXX, EN-XXX, or MG-XXX</p>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">🔒 Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            autoComplete="off"
                        />
                        <button
                            type="button"
                            className="password-toggle-inline"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Demo Credentials Hint */}
                    <div className="demo-credentials-hint">
                        <div className="hint-header">📋 Demo Credentials:</div>
                        <div className="hint-content">
                            <div className="hint-item">
                                <strong>Operator:</strong> <code>OP-101</code> / <code>operator123</code>
                            </div>
                            <div className="hint-item">
                                <strong>Engineer:</strong> <code>EN-201</code> / <code>engineer123</code>
                            </div>
                            <div className="hint-item">
                                <strong>Manager:</strong> <code>MG-301</code> / <code>manager123</code>
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="form-group">
                        <label>Select Your Role</label>
                        <div className="role-cards">
                            {roleCards.map((roleCard) => {
                                const roleInfo = ROLES[roleCard.key];
                                const isSelected = selectedRole === roleCard.key;

                                return (
                                    <div
                                        key={roleCard.key}
                                        className={`role-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => setSelectedRole(roleCard.key)}
                                    >
                                        <div className="role-icon">{roleCard.icon}</div>
                                        <h3 className="role-name">{roleInfo.name}</h3>
                                        <p className="role-description">{roleInfo.description}</p>
                                        <ul className="role-features">
                                            {roleCard.features.map((feature, idx) => (
                                                <li key={idx}>
                                                    <span className="feature-check">✓</span> {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        {isSelected && (
                                            <div className="selected-badge">Selected</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner">⏳</span>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Login as {ROLES[selectedRole].name}</span>
                                <span className="arrow">→</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>🔒 Secure Role-Based Access Control</p>
                    <p className="demo-note">Simulated Industrial Authentication System</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
