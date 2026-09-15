import { apiFetch } from "./api";
import type { RaffleDetailsResponse } from "../types/raffle";

export function getRaffleDetails(raffleId: string) {
    return apiFetch<RaffleDetailsResponse>(`/raffles/${raffleId}`);
}