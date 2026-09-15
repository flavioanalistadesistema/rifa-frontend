import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getRaffleDetails } from "../services/raffles";
import styles from "./AdminRaffleDetailsPage.module.css";

export function AdminRaffleDetailsPage() {
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
        return <p>Carregando rifa...</p>;
    }

    if (isError) {
        return <p>{error.message}</p>;
    }

    if (!data) {
        return <p>Rifa não encontrada.</p>;
    }

    return (
        <div>
            <Link className={styles.backLink} to="/admin">
                Voltar para rifas
            </Link>

            <header className={styles.header}>
                <div>
                    <h2>{data.raffle.title}</h2>
                    <p>{data.raffle.description}</p>
                </div>

                <span className={styles.status}>{data.raffle.status}</span>
            </header>

            <section className={styles.summary}>
                <article className={styles.summaryCard}>
                    <span>Total</span>
                    <strong>{data.summary.total}</strong>
                </article>

                <article className={styles.summaryCard}>
                    <span>Vendidos</span>
                    <strong>{data.summary.sold}</strong>
                </article>

                <article className={styles.summaryCard}>
                    <span>Reservados</span>
                    <strong>{data.summary.reserved}</strong>
                </article>

                <article className={styles.summaryCard}>
                    <span>Disponíveis</span>
                    <strong>{data.summary.available}</strong>
                </article>
            </section>

            <section className={styles.sections}>
                <article className={styles.panel}>
                    <h3>Pagamentos</h3>
                    <p>Em breve: lista de pagamentos pendentes para confirmação.</p>
                </article>

                <article className={styles.panel}>
                    <h3>Prêmios</h3>
                    <p>Em breve: edição dos prêmios e fotos.</p>
                </article>

                <article className={styles.panel}>
                    <h3>Sorteio</h3>
                    <p>Em breve: controle de sorteio manual.</p>
                </article>
            </section>
        </div>
    );
}