import type { RaffleResult } from "../../types/raffle";
import styles from "./DrawResult.module.css";

type DrawResultProps = {
  result: RaffleResult | null;
};

export function DrawResult({ result }: DrawResultProps) {
  if (!result) {
    return (
      <section className={styles.panel}>
        <h2 className={styles.title}>Sorteio</h2>
        <p className={styles.description}>
          O organizador pode realizar o sorteio manualmente a qualquer momento.
          Apenas números vendidos participam.
        </p>
        <p className={styles.pending}>
          O resultado ainda não está disponível.
        </p>
      </section>
    );
  }

  const buyerName = result.winningNumber.buyer?.name ?? "Ganhador não informado";

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Resultado</h2>

      <div className={styles.winnerBox}>
        <span className={styles.label}>Número vencedor</span>
        <strong className={styles.number}>
          {String(result.winningNumber.number).padStart(2, "0")}
        </strong>
        <span className={styles.buyer}>{buyerName}</span>
      </div>

      <p className={styles.description}>
        Sorteio realizado em{" "}
        {new Date(result.drawnAt).toLocaleDateString("pt-BR")}.
      </p>
    </section>
  );
}