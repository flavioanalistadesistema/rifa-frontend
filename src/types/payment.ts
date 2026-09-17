import type { Buyer, Raffle, RaffleNumber } from "./raffle";

export type PaymentStatus = "PENDING" | "CONFIRMED" | "REJECTED";

export type Payment = {
    id: string;
    raffleId: string;
    buyerId: string;
    amount: string;
    status: PaymentStatus;
    pixKey: string;
    receiptUrl?: string | null;
    notes?: string | null;
    confirmedAt?: string | null;
    createdAt: string;
    buyer: Buyer;
    raffle: Raffle;
    paymentNumbers: Array<{
        paymentId: string;
        raffleNumberId: string;
        raffleNumber: RaffleNumber;
    }>;
};