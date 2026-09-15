import styles from "./SelectedNumbersPanel.module.css";

type SelectedNumbersPanelProps = {
    selectedNumbers: number[];
    ticketPrice: string;
    onContinue: () => void;
};

export function SelectedNumbersPanel({
    selectedNumbers,
    ticketPrice,
    onContinue,
}: SelectedNumbersPanelProps) {
    if (selectedNumbers.length === 0) {
        return null;
    }

    const total = Number(ticketPrice) * selectedNumbers.length;

    return (
        <section className={styles.panel}>
            <div>
                <span className={styles.label}>Números selecionados</span>
                <strong className={styles.numbers}>{selectedNumbers.join(", ")}</strong>
            </div>

            <div className={styles.meta}>
                <span>{selectedNumbers.length} número(s)</span>
                <strong>
                    {total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </strong>
            </div>

            <button className={styles.button} type="button" onClick={onContinue}>
                Continuar
            </button>
        </section>
    );
}