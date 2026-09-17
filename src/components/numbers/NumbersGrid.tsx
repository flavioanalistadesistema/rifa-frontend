import type { RaffleNumber } from "../../types/raffle";
import styles from "./NumbersGrid.module.css";

type NumbersGridProps = {
    numbers: RaffleNumber[];
    winningNumberId?: string;
    selectedNumbers?: number[];
    onToggleNumber?: (number: number) => void;
};

const statusClassName: Record<RaffleNumber["status"], string> = {
    AVAILABLE: styles.available,
    RESERVED: styles.reserved,
    SOLD: styles.sold,
};

const statusLabel: Record<RaffleNumber["status"], string> = {
    AVAILABLE: "Disponível",
    RESERVED: "Reservado",
    SOLD: "Vendido",
};

export function NumbersGrid({
    numbers,
    winningNumberId,
    selectedNumbers = [],
    onToggleNumber,
}: NumbersGridProps) {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Os 100 números</h2>

                <div className={styles.legend} aria-label="Legenda dos números">
                    <span className={styles.legendItem}>
                        <i className={`${styles.dot} ${styles.dotAvailable}`} />
                        Disponível
                    </span>

                    <span className={styles.legendItem}>
                        <i className={`${styles.dot} ${styles.dotReserved}`} />
                        Reservado
                    </span>

                    <span className={styles.legendItem}>
                        <i className={`${styles.dot} ${styles.dotSold}`} />
                        Vendido
                    </span>

                    <span className={styles.legendItem}>
                        <i className={`${styles.dot} ${styles.dotWinner}`} />
                        Ganhador
                    </span>

                    <span className={styles.legendItem}>
                        <i className={`${styles.dot} ${styles.dotSelected}`} />
                        Selecionado
                    </span>
                </div>
            </div>

            <div className={styles.grid}>
                {numbers.map((raffleNumber) => {
                    const isWinner = raffleNumber.id === winningNumberId;
                    const isAvailable = raffleNumber.status === "AVAILABLE";
                    const isSelected = selectedNumbers.includes(raffleNumber.number);

                    return (
                        <button
                            key={raffleNumber.id}
                            type="button"
                            disabled={!isAvailable || isWinner}
                            onClick={() => onToggleNumber?.(raffleNumber.number)}
                            className={`${styles.number} ${isWinner
                                    ? styles.winner
                                    : isSelected
                                        ? styles.selected
                                        : statusClassName[raffleNumber.status]
                                }`}
                            aria-pressed={isSelected}
                            aria-label={`Número ${raffleNumber.number}, ${isWinner
                                    ? "Ganhador"
                                    : isSelected
                                        ? "Selecionado"
                                        : statusLabel[raffleNumber.status]
                                }`}
                        >
                            {raffleNumber.number}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}