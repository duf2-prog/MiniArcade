import type React from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Role } from "../entities/Entities";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user || user.rol !== Role.ADMIN) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>
};

export default AdminRoute;