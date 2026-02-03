import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './RoleIndicator.css';

function RoleIndicator() {
    const { currentUser, logout, getRoleColor } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    if (!currentUser) return null;

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    return (
        <div className="role-indicator-container">
            <div
                className="role-indicator"
                onClick={() => setShowMenu(!showMenu)}
                style={{ borderColor: getRoleColor() }}
            >
                <div className="role-avatar" style={{ backgroundColor: getRoleColor() }}>
                    {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="role-info">
                    <div className="username">{currentUser.username}</div>
                    <div className="employee-id-badge">{currentUser.employeeId}</div>
                    <div className="role-name" style={{ color: getRoleColor() }}>
                        {currentUser.roleDetails.name}
                    </div>
                </div>
                <div className="dropdown-arrow">▼</div>
            </div>

            {showMenu && (
                <div className="role-menu">
                    <div className="menu-header">
                        <strong>Role Permissions:</strong>
                    </div>
                    <div className="menu-permissions">
                        {currentUser.roleDetails.permissions.map((perm) => (
                            <div key={perm} className="permission-item">
                                <span className="check-icon">✓</span>
                                {perm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                        ))}
                    </div>
                    <div className="menu-divider"></div>
                    <button className="logout-button" onClick={handleLogout}>
                        <span>🚪</span> Logout
                    </button>
                </div>
            )}

            {/* Click outside to close */}
            {showMenu && (
                <div
                    className="menu-overlay"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}

export default RoleIndicator;
