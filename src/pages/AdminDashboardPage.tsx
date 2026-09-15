import { removeAuthToken } from "../services/auth-token";

export function AdminDashboardPage() {
    function handleLogout() {
        removeAuthToken();
        window.location.href = "/admin/login";
    }

    return (
        <main>
            <h1>Dashboard admin</h1>
            <p>Área protegida do organizador.</p>

            <button type="button" onClick={handleLogout}>
                Sair
            </button>
        </main>
    );
}