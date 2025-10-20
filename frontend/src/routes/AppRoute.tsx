import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import { ModalProvider } from "../contexts/ModalContext";

interface AppRouteProps {
    children: React.ReactNode
}

const AppRoute = ({ children }: AppRouteProps) => {
    return <ProtectedRoute>
        <ModalProvider>
            {children}
        </ModalProvider>
    </ProtectedRoute>
}

export default AppRoute;