import styles from "./RaffleSummary.module.css";

type RaffleSummaryProps = {
  available: number;
  sold: number;
  ticketPrice: string;
};

export function RaffleSummary({
  available,
  sold,
  ticketPrice,
}: RaffleSummaryProps) {
  return (
    <section className={styles.summary} aria-label="Resumo da rifa">
      <div className={styles.item}>
        <strong className={styles.value}>{available}</strong>
        <span className={styles.label}>Disponíveis</span>
      </div>

      <div className={styles.item}>
        <strong className={styles.value}>{sold}</strong>
        <span className={styles.label}>Vendidos</span>
      </div>

      <div className={styles.item}>
        <strong className={styles.value}>R$ {ticketPrice}</strong>
        <span className={styles.label}>Valor</span>
      </div>
    </section>
  );
}