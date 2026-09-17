import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { AdminDrawPanel } from "../components/admin/AdminDrawPanel";
import { getRaffleDetails } from "../services/raffles";
import styles from "./AdminDrawPainelPage.module.css";

export function AdminDrawPainelPage() {
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
        return <p>Carregando painel de sorteio...</p>;
    }

    if (isError) {
        return <p>{error.message}</p>;
    }

    if (!data) {
        return <p>Rifa não encontrada.</p>;
    }

    const soldNumbers = data.raffle.numbers
        .filter((raffleNumber) => raffleNumber.status === "SOLD")
        .map((raffleNumber) => raffleNumber.number);

    return (
        <div className={styles.page}>
            <Link className={styles.backLink} to={`/admin/raffles/${raffleId}`}>
                Voltar para detalhes
            </Link>

            <header className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Painel administrativo</span>
                    <h2>Sorteio</h2>
                    <p>{data.raffle.title}</p>
                </div>

                <span className={styles.status}>{data.raffle.status}</span>
            </header>

            <section className={styles.panel}>
                <AdminDrawPanel
                    raffleId={data.raffle.id}
                    result={data.result}
                    soldCount={data.summary.sold}
                    soldNumbers={soldNumbers}
                />
            </section>
        </div>
    );
}
