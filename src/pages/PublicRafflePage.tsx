import { getRaffleDetails } from "../services/raffles";
import styles from "./PublicRafflePage.module.css";
import { NumbersGrid } from "../components/numbers/NumbersGrid";
import { PrizeCard } from "../components/prize/PrizeCard";
import { RaffleSummary } from "../components/raffle/RaffleSummary";
import { ParticipationInfo } from "../components/participation/ParticipationInfo";
import { DrawResult } from "../components/draw/DrawResult";
import { SelectedNumbersPanel } from "../components/SelectedNumbersPanel";
import { BuyerForm } from "../components/byer/BuyerForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReservationSuccess } from "../components/reservation/ReservationSuccess";

import { useState } from "react";

const raffleId = import.meta.env.VITE_RAFFLE_ID;

export function PublicRafflePage() {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [isBuyerFormVisible, setIsBuyerFormVisible] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["raffle", raffleId],
        queryFn: () => getRaffleDetails(raffleId),
        enabled: Boolean(raffleId),
    });

    const [reservationSuccess, setReservationSuccess] = useState<{
        numbers: number[];
    } | null>(null);

    if (!raffleId) {
        return <p>VITE_RAFFLE_ID não configurado.</p>;
    }

    if (isLoading) {
        return <p className={styles.loading}>Carregando rifa...</p>;
    }

    if (isError) {
        return <p className={styles.error}>{error.message}</p>;
    }

    if (!data) {
        return <p className={styles.error}>Rifa não encontrada.</p>;
    }

    function handleToggleNumber(number: number) {
        setSelectedNumbers((current) => {
            if (current.includes(number)) {
                return current.filter((item) => item !== number);
            }

            return [...current, number].sort((a, b) => a - b);
        });
    }

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <p className={styles.eyebrow}>Rifa oficial</p>
                        <h1 className={styles.title}>{data.raffle.title}</h1>

                        {data.raffle.description && (
                            <p className={styles.description}>{data.raffle.description}</p>
                        )}
                    </div>

                    <aside className={styles.priceCard}>
                        <span>Valor por número</span>
                        <strong>R$ {data.raffle.ticketPrice}</strong>
                    </aside>
                </header>

                <RaffleSummary
                    available={data.summary.available}
                    sold={data.summary.sold}
                    ticketPrice={data.raffle.ticketPrice}
                />

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Prêmios</h2>

                    <div className={styles.prizesGrid}>
                        {data.raffle.prizes.map((prize) => (
                            <PrizeCard key={prize.id} prize={prize} />
                        ))}
                    </div>
                </section>

                <ParticipationInfo
                    pixKey={data.raffle.pixKey}
                    ticketPrice={data.raffle.ticketPrice}
                    sold={data.summary.sold}
                />

                <NumbersGrid
                    numbers={data.raffle.numbers}
                    winningNumberId={data.result?.winningNumberId}
                    selectedNumbers={selectedNumbers}
                    onToggleNumber={handleToggleNumber}
                />

                <SelectedNumbersPanel
                    selectedNumbers={selectedNumbers}
                    ticketPrice={data.raffle.ticketPrice}
                    onContinue={() => setIsBuyerFormVisible(true)}
                />

                {isBuyerFormVisible && (
                    <BuyerForm
                        raffleId={data.raffle.id}
                        selectedNumbers={selectedNumbers}
                        ticketPrice={data.raffle.ticketPrice}
                        onSuccess={() => {
                            setReservationSuccess({
                                numbers: selectedNumbers,
                            });

                            setSelectedNumbers([]);
                            setIsBuyerFormVisible(false);

                            queryClient.invalidateQueries({ queryKey: ["raffle", raffleId] });
                        }}
                    />
                )}

                {reservationSuccess && (
                    <ReservationSuccess
                        numbers={reservationSuccess.numbers}
                        onClose={() => setReservationSuccess(null)}
                    />
                )}

                <DrawResult result={data.result} />
            </div>
        </main>
    );
}