import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { AdminPrizesPanel } from "../components/admin/AdminPrizesPanel";
import { getRaffleDetails } from "../services/raffles";
import styles from "./AdminPrizesPainelPage.module.css";

export function AdminPrizesPainelPage() {
    const { raffleId } = useParams<{ raffleId: string }>();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["admin", "raffle", raffleId],
        queryFn: () => getRaffleDetails(raffleId ?? ""),
        enabled: Boolean(raffleId),
    });

    if (!raffleId) {
        return <p>Rifa não informada.</p>;
    }

    if (isLoading) {
        return <p>Carregando prêmios...</p>;
    }

    if (isError) {
        return <p>{error.message}</p>;
    }

    if (!data) {
        return <p>Rifa não encontrada.</p>;
    }

    return (
        <div className={styles.page}>
            <Link className={styles.backLink} to={`/admin/raffles/${raffleId}`}>
                Voltar para detalhes
            </Link>

            <header className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Painel administrativo</span>
                    <h2>Prêmios</h2>
                    <p>{data.raffle.title}</p>
                </div>

                <span className={styles.status}>{data.raffle.status}</span>
            </header>

            <AdminPrizesPanel
                raffleId={data.raffle.id}
                prizes={data.prizes ?? data.raffle.prizes ?? []}
            />
        </div>
    );
}
