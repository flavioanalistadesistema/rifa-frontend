import type { Prize } from "../../types/raffle";
import styles from "./PrizeCard.module.css";

type PrizeCardProps = {
  prize: Prize;
};

export function PrizeCard({ prize }: PrizeCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {prize.imageUrl ? (
          <img className={styles.image} src={prize.imageUrl} alt={prize.name} />
        ) : (
          <div className={styles.placeholder}>Foto em breve</div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{prize.name}</h3>

        {prize.description && (
          <p className={styles.description}>{prize.description}</p>
        )}
      </div>
    </article>
  );
}