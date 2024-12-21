import React from "react";
import { ProtectedRoute } from "../ProtectedRoute";

export const Error404Page: React.FC = () => {
    return (
        <ProtectedRoute>
            <div>404 Not Found</div>
        </ProtectedRoute>
    )
}