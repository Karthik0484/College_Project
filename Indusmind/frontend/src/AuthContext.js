import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Authentication Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Role definitions with permissions and Employee ID validation
export const ROLES = {
    OPERATOR: {
        name: 'Operator',
        level: 1,
        description: 'Can view machine status only',
        permissions: ['view_dashboard'],
        color: '#3B82F6', // Professional Blue
        employeeIdPrefix: 'OP-',
        demoPassword: 'operator123'
    },
    ENGINEER: {
        name: 'Maintenance Engineer',
        level: 2,
        description: 'Can view details, alerts, and recommendations',
        permissions: ['view_dashboard', 'view_machine_details', 'view_alerts', 'view_health'],
        color: '#2563EB', // Primary Blue
        employeeIdPrefix: 'EN-',
        demoPassword: 'engineer123'
    },
    MANAGER: {
        name: 'Manager / Supervisor',
        level: 3,
        description: 'Full access to all features',
        permissions: ['view_dashboard', 'view_machine_details', 'view_alerts', 'view_health', 'view_analytics', 'manage_system'],
        color: '#1D4ED8', // Deep Blue
        employeeIdPrefix: 'MG-',
        demoPassword: 'manager123'
    }
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('indusmind_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to load user from storage:', error);
                localStorage.removeItem('indusmind_user');
            }
        }
    }, []);

    // Login function - Validate Employee ID and Password
    const login = (roleKey, username = 'Demo User', employeeId = '', password = '') => {
        const role = ROLES[roleKey];
        if (!role) {
            return { success: false, message: 'Invalid role selected' };
        }

        // Validate Employee ID format (must start with role prefix)
        if (!employeeId.startsWith(role.employeeIdPrefix)) {
            return {
                success: false,
                message: `Invalid Employee ID format. ${role.name} ID must start with ${role.employeeIdPrefix}`
            };
        }

        // Validate Employee ID structure (PREFIX-XXX)
        const idPattern = new RegExp(`^${role.employeeIdPrefix}\\d{3}$`);
        if (!idPattern.test(employeeId)) {
            return {
                success: false,
                message: `Invalid Employee ID format. Use format: ${role.employeeIdPrefix}XXX (e.g., ${role.employeeIdPrefix}101)`
            };
        }

        // Validate password
        if (password !== role.demoPassword) {
            return { success: false, message: 'Invalid Employee ID or Password' };
        }

        const user = {
            username,
            employeeId,
            role: roleKey,
            roleDetails: role,
            loginTime: new Date().toISOString()
        };

        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('indusmind_user', JSON.stringify(user));

        return { success: true, message: 'Login successful' };
    };

    // Logout function - Clear state and localStorage
    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('indusmind_user');
    };

    // Check if user has specific permission
    const hasPermission = (permission) => {
        if (!currentUser) return false;
        return currentUser.roleDetails.permissions.includes(permission);
    };

    // Check if user has minimum role level
    const hasRoleLevel = (minLevel) => {
        if (!currentUser) return false;
        return currentUser.roleDetails.level >= minLevel;
    };

    // Get role color
    const getRoleColor = () => {
        return currentUser?.roleDetails.color || '#95a5a6';
    };

    const value = {
        currentUser,
        isAuthenticated,
        login,
        logout,
        hasPermission,
        hasRoleLevel,
        getRoleColor,
        ROLES
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
