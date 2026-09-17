import styles from "./SelectedNumbersPanel.module.css";

type SelectedNumbersPanelProps = {
    selectedNumbers: number[];
    ticketPrice: number;
    onContinue: () => void;
    onClear: () => void;
};

export function SelectedNumbersPanel({
    selectedNumbers,
    ticketPrice,
    onContinue,
    onClear,
}: SelectedNumbersPanelProps) {
    if (selectedNumbers.length === 0) {
        return null;
    }

    const total = ticketPrice * selectedNumbers.length;

    return (
        <section className={styles.panel}>
            <div className={styles.content}>
                <div>
                    <span className={styles.label}>Números selecionados</span>
                    <strong className={styles.numbers}>
                        {selectedNumbers.join(", ")}
                    </strong>
                </div>

                <div className={styles.meta}>
                    <span>
                        {selectedNumbers.length} número
                        {selectedNumbers.length > 1 ? "s" : ""}
                    </span>

                    <strong>
                        {total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </strong>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.clearButton} type="button" onClick={onClear}>
                    Limpar
                </button>

                <button className={styles.button} type="button" onClick={onContinue}>
                    Continuar
                </button>
            </div>
        </section>
    );
}