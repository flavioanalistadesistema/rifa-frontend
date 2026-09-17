import styles from "./ParticipationInfo.module.css";

type ParticipationInfoProps = {
  pixKey: string;
  ticketPrice: string;
  sold: number;
};

export function ParticipationInfo({
  pixKey,
  ticketPrice,
  sold,
}: ParticipationInfoProps) {
  const totalRaised = Number(ticketPrice) * sold;

  async function handleCopyPixKey() {
    await navigator.clipboard.writeText(pixKey);
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Como participar</h2>

      <ol className={styles.steps}>
        <li>Escolha um ou mais números que ainda estejam livres.</li>
        <li>Pague R$ {ticketPrice} por número via PIX usando a chave abaixo.</li>
        <li>
          Envie o comprovante para o organizador. Seus números serão marcados
          como vendidos após a confirmação.
        </li>
      </ol>

      <div className={styles.pixBox}>
        <div>
          <span className={styles.pixLabel}>Chave PIX</span>
          <strong className={styles.pixKey}>{pixKey}</strong>
          <small className={styles.pixHint}>Pagamento manual via PIX</small>
        </div>

        <button className={styles.copyButton} type="button" onClick={handleCopyPixKey}>
          Copiar chave
        </button>
      </div>

      <p className={styles.totalRaised}>
        Total arrecadado até agora:{" "}
        <strong>
          {totalRaised.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </strong>
      </p>
    </section>
  );
}