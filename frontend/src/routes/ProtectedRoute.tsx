import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

interface ProtectedRouteProps {
    children: React.JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const userId = useUserStore((state) => state.userId);

    if (userId > 0) {
        return children;
    } else {
        return <Navigate to="/" replace />;
    }

};

export default ProtectedRoute;