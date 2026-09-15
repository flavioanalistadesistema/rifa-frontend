import { useQuery } from "@tanstack/react-query";
import { getAdminRaffles } from "../services/admin-raffles";
import styles from "./AdminDashboardPage.module.css";
import { Link } from "react-router-dom";

export function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "raffles"],
    queryFn: getAdminRaffles,
  });

  if (isLoading) {
    return <p>Carregando rifas...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>Painel administrativo</span>
            <h2>Rifas</h2>
            <p>Gerencie rifas, pagamentos e sorteios.</p>
          </div>
        </header>

        <div className={styles.grid}>
        {data?.raffles.map((raffle) => (
          <article key={raffle.id} className={styles.card}>
            <span className={styles.status}>{raffle.status}</span>
            <Link className={styles.link} to={`/admin/raffles/${raffle.id}`}>
              Abrir rifa
            </Link>
            <h3>{raffle.title}</h3>
            <p>{raffle.description}</p>

            <dl className={styles.meta}>
              <div>
                <dt>Números</dt>
                <dd>{raffle._count.numbers}</dd>
              </div>

              <div>
                <dt>Pagamentos</dt>
                <dd>{raffle._count.payments}</dd>
              </div>

              <div>
                <dt>Sorteios</dt>
                <dd>{raffle._count.draws}</dd>
              </div>
            </dl>
          </article>
          ))}
        </div>
      </div>
    </main>
  );
}