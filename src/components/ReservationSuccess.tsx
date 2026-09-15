import styles from "./ReservationSuccess.module.css";

type ReservationSuccessProps = {
    numbers: number[];
    onClose: () => void;
};

export function ReservationSuccess({
    numbers,
    onClose,
}: ReservationSuccessProps) {
    return (
        <section className={styles.panel} role="status" aria-live="polite">
            <div>
                <span className={styles.eyebrow}>Reserva enviada</span>
                <h2 className={styles.title}>Aguardando confirmação</h2>
                <p className={styles.description}>
                    Seus números foram enviados para conferência do organizador. Após a
                    confirmação do PIX, eles serão marcados como vendidos.
                </p>
            </div>

            <div className={styles.numbersBox}>
                <span>Números reservados</span>
                <strong>{numbers.join(", ")}</strong>
            </div>

            <button className={styles.button} type="button" onClick={onClose}>
                Entendi
            </button>
        </section>
    );
}