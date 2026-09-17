import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { RaffleResult } from "../../types/raffle";
import { createDraw } from "../../services/admin-draws";
import { getRaffleDetails } from "../../services/raffles";
import styles from "./AdminDrawPanel.module.css";

type AdminDrawPanelProps = {
    raffleId: string;
    result: RaffleResult | null;
    soldCount: number;
    soldNumbers: number[];
};

const WINNER_DISPLAY_DURATION_MS = 10000;

export function AdminDrawPanel({
    raffleId,
    result,
    soldCount,
    soldNumbers,
}: AdminDrawPanelProps) {
    const queryClient = useQueryClient();
    const [isDrawing, setIsDrawing] = useState(false);
    const [isSettled, setIsSettled] = useState(false);
    const [showWinnerCard, setShowWinnerCard] = useState(Boolean(result));
    const [rollingNumber, setRollingNumber] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null);

    const drawMutation = useMutation({
        mutationFn: createDraw,
        onError: () => {
            setIsSettled(false);
        },
    });

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                window.clearInterval(timerRef.current);
            }
        };
    }, []);

    function getRandomSoldNumber() {
        return soldNumbers[Math.floor(Math.random() * soldNumbers.length)];
    }

    async function handleDraw() {
        if (isDrawing || drawMutation.isPending || soldNumbers.length === 0) {
            return;
        }

        setIsSettled(false);
        setShowWinnerCard(false);
        setIsDrawing(true);

        try {
            const startedAt = performance.now();
            setRollingNumber(getRandomSoldNumber());

            timerRef.current = window.setInterval(() => {
                setRollingNumber(getRandomSoldNumber());
            }, 100);

            const drawRequest = drawMutation.mutateAsync(raffleId);
            const minimumAnimation = new Promise<void>((resolve) => {
                window.setTimeout(() => {
                    resolve();
                }, Math.max(0, 5000 - (performance.now() - startedAt)));
            });

            await Promise.all([drawRequest, minimumAnimation]);

            const details = await queryClient.fetchQuery({
                queryKey: ["admin", "raffle", raffleId],
                queryFn: () => getRaffleDetails(raffleId),
            });
            const winningNumber = details.result?.winningNumber.number;

            if (winningNumber === undefined) {
                throw new Error("O sorteio não retornou um número vencedor.");
            }

            if (timerRef.current !== null) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }

            setRollingNumber(winningNumber);
            setIsDrawing(false);
            setIsSettled(true);

            await new Promise<void>((resolve) => {
                window.setTimeout(resolve, WINNER_DISPLAY_DURATION_MS);
            });

                setShowWinnerCard(true);
            queryClient.setQueryData(["admin", "raffle", raffleId], details);
            queryClient.invalidateQueries({ queryKey: ["raffle", raffleId] });
        } catch {
            setIsDrawing(false);
            setIsSettled(false);
        }
    }

    if (result && showWinnerCard) {
        const winner = result.winningNumber.buyer;

        return (
            <div className={styles.result}>
                <span>Ganhador</span>
                <strong className={styles.winningNumber}>
                    {result.winningNumber.number}
                </strong>

                <div className={styles.winnerDetails}>
                    <div>
                        <span>Nome</span>
                        <strong>{winner?.name ?? "Não informado"}</strong>
                    </div>

                    <div>
                        <span>WhatsApp</span>
                        <strong>{winner?.whatsapp ?? "Não informado"}</strong>
                    </div>

                    <div>
                        <span>E-mail</span>
                        <strong>{winner?.email ?? "Não informado"}</strong>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.panel}>
            <p>
                O sorteio escolhe automaticamente um único vencedor entre os números
                vendidos.
            </p>

            <p className={styles.meta}>Números vendidos: {soldCount}</p>

            <div className={styles.numberRoller} aria-live="polite">
                <span>
                    {isDrawing
                        ? "Sorteando número"
                        : isSettled
                            ? "Número sorteado"
                            : "Prontos"}
                </span>
                <strong>{String(rollingNumber ?? "--").padStart(2, "0")}</strong>
            </div>

            {drawMutation.isError && (
                <p className={styles.error}>{drawMutation.error.message}</p>
            )}

            <button
                type="button"
                onClick={handleDraw}
                disabled={isDrawing || drawMutation.isPending || soldNumbers.length === 0}
            >
                {isDrawing
                    ? "Sorteando..."
                    : drawMutation.isPending
                        ? "Finalizando..."
                        : isSettled
                            ? "Confirmando número..."
                            : "Realizar sorteio"}
            </button>

            {soldCount === 0 && (
                <p className={styles.help}>
                    Ainda não há números vendidos para participar do sorteio.
                </p>
            )}
        </div>
    );
}