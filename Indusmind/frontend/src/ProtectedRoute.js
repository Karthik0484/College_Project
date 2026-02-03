import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute - Route wrapper that checks user authentication and permissions
 * 
 * Props:
 * - children: Component to render if authorized
 * - requiredPermission: Permission needed to access route (optional)
 * - minRoleLevel: Minimum role level required (optional)
 * - fallbackPath: Where to redirect if unauthorized (default: '/')
 */
function ProtectedRoute({
    children,
    requiredPermission = null,
    minRoleLevel = null,
    fallbackPath = '/'
}) {
    const { isAuthenticated, hasPermission, hasRoleLevel, currentUser } = useAuth();

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check specific permission if required
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <AccessDenied userRole={currentUser?.roleDetails.name} />;
    }

    // Check minimum role level if required
    if (minRoleLevel && !hasRoleLevel(minRoleLevel)) {
        return <AccessDenied userRole={currentUser?.roleDetails.name} />;
    }

    // User is authorized, render the component
    return children;
}

// Access Denied Component
function AccessDenied({ userRole }) {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.icon}>🚫</div>
                <h1 style={styles.title}>Access Denied</h1>
                <p style={styles.message}>
                    Your role <strong>({userRole})</strong> does not have permission to access this page.
                </p>
                <p style={styles.submessage}>
                    Please contact your system administrator if you believe this is an error.
                </p>
                <a href="/" style={styles.button}>
                    ← Return to Dashboard
                </a>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    },
    content: {
        textAlign: 'center',
        background: 'white',
        padding: '50px 40px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '500px'
    },
    icon: {
        fontSize: '80px',
        marginBottom: '20px'
    },
    title: {
        fontSize: '32px',
        color: '#e74c3c',
        margin: '0 0 15px 0'
    },
    message: {
        fontSize: '16px',
        color: '#2c3e50',
        marginBottom: '10px',
        lineHeight: '1.6'
    },
    submessage: {
        fontSize: '14px',
        color: '#7f8c8d',
        marginBottom: '30px'
    },
    button: {
        display: 'inline-block',
        padding: '12px 30px',
        background: '#3498db',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        transition: 'all 0.3s ease'
    }
};

export default ProtectedRoute;
