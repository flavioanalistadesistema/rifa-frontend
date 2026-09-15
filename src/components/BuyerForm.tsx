import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createPayment } from "../services/payments";
import { uploadFile } from "../services/uploads";
import styles from "./BuyerForm.module.css";

const buyerFormSchema = z.object({
    name: z.string().min(3, "Informe seu nome completo."),
    whatsapp: z.string().min(8, "Informe um WhatsApp válido."),
    email: z
        .string()
        .email("Informe um e-mail válido.")
        .optional()
        .or(z.literal("")),
});

type BuyerFormData = z.infer<typeof buyerFormSchema>;

type BuyerFormProps = {
    raffleId: string;
    selectedNumbers: number[];
    ticketPrice: string;
    onSuccess: () => void;
};

export function BuyerForm({
    raffleId,
    selectedNumbers,
    ticketPrice,
    onSuccess,
}: BuyerFormProps) {
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    const total = Number(ticketPrice) * selectedNumbers.length;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BuyerFormData>({
        resolver: zodResolver(buyerFormSchema),
        defaultValues: {
            name: "",
            whatsapp: "",
            email: "",
        },
    });

    const reservationMutation = useMutation({
        mutationFn: async (data: BuyerFormData) => {
            let receiptUrl: string | undefined;

            if (receiptFile) {
                const upload = await uploadFile(receiptFile, "receipt");
                receiptUrl = upload.url;
            }

            return createPayment({
                raffleId,
                buyer: {
                    name: data.name,
                    whatsapp: data.whatsapp,
                    email: data.email || undefined,
                },
                numbers: selectedNumbers,
                receiptUrl,
            });
        },
        onSuccess,
    });

    function handleCreateReservation(data: BuyerFormData) {
        reservationMutation.mutate(data);
    }

    return (
        <section className={styles.panel}>
            <div>
                <h2 className={styles.title}>Dados para reserva</h2>
                <p className={styles.description}>
                    Informe seus dados para registrar a reserva dos números selecionados.
                </p>
            </div>

            <div className={styles.summary}>
                <span>Números: {selectedNumbers.join(", ")}</span>
                <strong>
                    Total:{" "}
                    {total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </strong>
            </div>

            <form
                className={styles.form}
                onSubmit={handleSubmit(handleCreateReservation)}
            >
                <label className={styles.field}>
                    Nome completo
                    <input type="text" placeholder="Seu nome" {...register("name")} />
                    {errors.name && (
                        <span className={styles.error}>{errors.name.message}</span>
                    )}
                </label>

                <label className={styles.field}>
                    WhatsApp
                    <input
                        type="tel"
                        placeholder="(00) 00000-0000"
                        {...register("whatsapp")}
                    />
                    {errors.whatsapp && (
                        <span className={styles.error}>{errors.whatsapp.message}</span>
                    )}
                </label>

                <label className={styles.field}>
                    E-mail
                    <input
                        type="email"
                        placeholder="voce@email.com"
                        {...register("email")}
                    />
                    {errors.email && (
                        <span className={styles.error}>{errors.email.message}</span>
                    )}
                </label>

                <label className={styles.field}>
                    Comprovante PIX
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => {
                            setReceiptFile(event.target.files?.[0] ?? null);
                        }}
                    />
                </label>

                {reservationMutation.isError && (
                    <p className={styles.error}>{reservationMutation.error.message}</p>
                )}

                {reservationMutation.isSuccess && (
                    <p className={styles.success}>
                        Reserva enviada com sucesso. Aguarde a confirmação do organizador.
                    </p>
                )}

                <button
                    className={styles.submitButton}
                    type="submit"
                    disabled={reservationMutation.isPending}
                >
                    {reservationMutation.isPending ? "Enviando..." : "Enviar reserva"}
                </button>
            </form>
        </section>
    );
}