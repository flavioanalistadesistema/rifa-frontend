import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createPayment } from "../../services/payments";
import { getRaffleDetails } from "../../services/raffles";
import { uploadFile } from "../../services/uploads";
import styles from "./BuyerForm.module.css";

function onlyNumbers(value: string) {
    return value.replace(/\D/g, "");
}

function formatWhatsApp(value: string) {
    const digits = onlyNumbers(value).slice(0, 11);

    if (digits.length <= 2) {
        return digits;
    }

    if (digits.length <= 6) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const acceptedReceiptTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const maxReceiptSizeInBytes = 5 * 1024 * 1024;

const buyerFormSchema = z.object({
    name: z.string().min(3, "Informe seu nome completo."),
    whatsapp: z.string().refine(
        (value) => {
            const digits = onlyNumbers(value);
            return digits.length === 10 || digits.length === 11;
        },
        {
            message: "Informe um WhatsApp válido com DDD.",
        }
    ),
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
    const [receiptError, setReceiptError] = useState<string | null>(null);
    const queryClient = useQueryClient();

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

    const whatsappField = register("whatsapp");

    const reservationMutation = useMutation({
        mutationFn: async (data: BuyerFormData) => {
            const latestRaffle = await queryClient.fetchQuery({
                queryKey: ["raffle", raffleId],
                queryFn: () => getRaffleDetails(raffleId),
                staleTime: 0,
            });

            const unavailableNumbers = selectedNumbers.filter((number) => {
                const raffleNumber = latestRaffle.raffle.numbers.find(
                    (item) => item.number === number
                );

                return raffleNumber?.status !== "AVAILABLE";
            });

            if (unavailableNumbers.length > 0) {
                throw new Error(
                    `Os números ${unavailableNumbers.join(", ")} não estão mais disponíveis. Atualize a página e selecione outros números.`
                );
            }

            let receiptUrl: string | undefined;

            if (receiptFile) {
                const upload = await uploadFile(receiptFile, "receipt");
                receiptUrl = upload.url;
            }

            return createPayment({
                raffleId,
                buyer: {
                    name: data.name,
                    whatsapp: onlyNumbers(data.whatsapp),
                    email: data.email || undefined,
                },
                numbers: selectedNumbers,
                receiptUrl,
            });
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["raffle", raffleId] });
        },
        onSuccess,
    });

    function handleCreateReservation(data: BuyerFormData) {
        reservationMutation.mutate(data);
    }

    function handleReceiptChange(file: File | null) {
        setReceiptError(null);

        if (!file) {
            setReceiptFile(null);
            return;
        }

        if (!acceptedReceiptTypes.includes(file.type)) {
            setReceiptFile(null);
            setReceiptError("Envie um comprovante em JPG, PNG, WEBP ou PDF.");
            return;
        }

        if (file.size > maxReceiptSizeInBytes) {
            setReceiptFile(null);
            setReceiptError("O comprovante deve ter no máximo 5 MB.");
            return;
        }

        setReceiptFile(file);
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

            <form className={styles.form} onSubmit={handleSubmit(handleCreateReservation)}>
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
                        maxLength={15}
                        {...whatsappField}
                        onChange={(event) => {
                            event.target.value = formatWhatsApp(event.target.value);
                            whatsappField.onChange(event);
                        }}
                    />
                    {errors.whatsapp && (
                        <span className={styles.error}>{errors.whatsapp.message}</span>
                    )}
                </label>

                <label className={styles.field}>
                    E-mail
                    <input type="email" placeholder="voce@email.com" {...register("email")} />
                    {errors.email && (
                        <span className={styles.error}>{errors.email.message}</span>
                    )}
                </label>

                <label className={styles.field}>
                    Comprovante PIX
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={(event) => {
                            handleReceiptChange(event.target.files?.[0] ?? null);
                        }}
                    />
                    {receiptFile && (
                        <span className={styles.fileName}>
                            Arquivo selecionado: {receiptFile.name}
                        </span>
                    )}

                    {receiptError && <span className={styles.error}>{receiptError}</span>}
                </label>

                {reservationMutation.isError && (
                    <p className={styles.error}>
                        {(reservationMutation.error as Error).message}
                    </p>
                )}

                {reservationMutation.isSuccess && (
                    <p className={styles.success}>
                        Reserva enviada com sucesso. Aguarde a confirmação do organizador.
                    </p>
                )}

                <button
                    className={styles.submitButton}
                    type="submit"
                    disabled={
                        reservationMutation.isPending ||
                        selectedNumbers.length === 0 ||
                        Boolean(receiptError)
                    }
                >
                    {reservationMutation.isPending ? "Enviando..." : "Enviar reserva"}
                </button>
            </form>
        </section>
    );
}