import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";
import { getMe } from "../services/auth";
import { getAuthToken, removeAuthToken } from "../services/auth-token";

export function RequireAdmin() {
    const token = getAuthToken();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["auth", "me"],
        queryFn: () => getMe(token ?? ""),
        enabled: Boolean(token),
        retry: false,
    });

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (isLoading) {
        return <p>Validando acesso...</p>;
    }

    if (isError || !data) {
        removeAuthToken();
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}