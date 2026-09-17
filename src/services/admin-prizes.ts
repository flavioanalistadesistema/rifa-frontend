import { apiFetch } from "./api";
import type { Prize } from "../types/raffle";

type PrizePayload = {
    name: string;
    description: string;
    imageUrl?: string;
};

export async function createPrize(
    raffleId: string,
    data: PrizePayload,
    token: string
) {
    return apiFetch<Prize>(`/raffles/${raffleId}/prizes`, {
        method: "POST",
        token,
        body: JSON.stringify(data),
    });
}

export async function updatePrize(
    prizeId: string,
    data: PrizePayload,
    token: string
) {
    return apiFetch<Prize>(`/prizes/${prizeId}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(data),
    });
}

export async function deletePrize(prizeId: string, token: string) {
    return apiFetch<{ message: string }>(`/prizes/${prizeId}`, {
        method: "DELETE",
        token,
    });
}