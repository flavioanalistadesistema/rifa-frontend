import { Link, Outlet, useNavigate } from "react-router-dom";
import { removeAuthToken } from "../services/auth-token";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
    const navigate = useNavigate();

    function handleLogout() {
        removeAuthToken();
        navigate("/admin/login");
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Painel administrativo</span>
                    <h1 className={styles.title}>Rifa Dflugann</h1>
                </div>

                <nav className={styles.nav}>
                    <Link to="/">Ver página pública</Link>
                    <button type="button" onClick={handleLogout}>
                        Sair
                    </button>
                </nav>
            </header>

            <section className={styles.content}>
                <Outlet />
            </section>
        </main>
    );
}