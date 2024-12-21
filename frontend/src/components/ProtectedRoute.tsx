import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const mustLogin = localStorage.getItem('token') == null || localStorage.getItem('user') == null;
    if (mustLogin) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};