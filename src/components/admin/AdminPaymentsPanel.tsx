import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Payment } from "../../types/payment";
import { confirmPayment, rejectPayment } from "../../services/admin-payments";
import styles from "./AdminPaymentsPanel.module.css";

type AdminPaymentsPanelProps = {
    raffleId: string;
    payments: Payment[];
};

export function AdminPaymentsPanel({
    raffleId,
    payments,
}: AdminPaymentsPanelProps) {
    const queryClient = useQueryClient();

    const confirmMutation = useMutation({
        mutationFn: confirmPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "payments", raffleId] });
            queryClient.invalidateQueries({ queryKey: ["admin", "raffle", raffleId] });
            queryClient.invalidateQueries({ queryKey: ["raffle", raffleId] });
        },
    });

    const rejectMutation = useMutation({
        mutationFn: rejectPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "payments", raffleId] });
            queryClient.invalidateQueries({ queryKey: ["admin", "raffle", raffleId] });
            queryClient.invalidateQueries({ queryKey: ["raffle", raffleId] });
        },
    });

    if (payments.length === 0) {
        return <p className={styles.empty}>Nenhum pagamento encontrado.</p>;
    }

    return (
        <div className={styles.list}>
            {payments.map((payment) => {
                const numbers = payment.paymentNumbers
                    .map((item) => item.raffleNumber.number)
                    .join(", ");

                const isPending = payment.status === "PENDING";

                return (
                    <article key={payment.id} className={styles.card}>
                        <div>
                            <span className={styles.status}>{payment.status}</span>
                            <h4>{payment.buyer.name}</h4>
                            <p>{payment.buyer.whatsapp}</p>
                            <p>Números: {numbers}</p>
                            <p>Valor: R$ {payment.amount}</p>
                        </div>

                        <div className={styles.actions}>
                            {payment.receiptUrl && (
                                <a href={payment.receiptUrl} target="_blank" rel="noreferrer">
                                    Ver comprovante
                                </a>
                            )}

                            {isPending && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => confirmMutation.mutate(payment.id)}
                                        disabled={confirmMutation.isPending}
                                    >
                                        Confirmar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => rejectMutation.mutate(payment.id)}
                                        disabled={rejectMutation.isPending}
                                    >
                                        Rejeitar
                                    </button>
                                </>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}