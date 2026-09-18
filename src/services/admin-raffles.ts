import type { Raffle } from "../types/raffle";
import { apiFetch } from "./api";
import { getAuthToken } from "./auth-token";


type AdminRafflesResponse = {
    raffles: Array<
        Raffle & {
            _count: {
                numbers: number
                payments: number
                draws: number
            };
        }
    >;
};

type AdminRaffle = AdminRafflesResponse["raffles"][number];

export type CreateRafflePayload = {
    title: string;
    description?: string;
    ticketPrice: number;
    pixKey: string;
    totalNumbers: number;
};

export async function createRaffle(payload: CreateRafflePayload): Promise<Raffle> {
    const token = getAuthToken();

    return apiFetch<Raffle>("/raffles", {
        method: "POST",
        body: JSON.stringify(payload),
        token: token ?? undefined,
    });
}

export async function generateRaffleNumbers(raffleId: string) {
    const token = getAuthToken();

    return apiFetch<{ message: string; total: number }>(
        `/raffles/${raffleId}/numbers/generate`,
        {
            method: "POST",
            token: token ?? undefined,
        }
    );
}

export async function getAdminRaffles(): Promise<AdminRafflesResponse> {
    const token = getAuthToken();

    const response = await apiFetch<AdminRafflesResponse | AdminRaffle[]>("/raffles", {
        token: token ?? undefined,
    });

    return Array.isArray(response) ? { raffles: response } : response;
}
