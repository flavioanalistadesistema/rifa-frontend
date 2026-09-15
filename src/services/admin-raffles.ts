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

export async function getAdminRaffles(): Promise<AdminRafflesResponse> {
    const token = getAuthToken();

    const response = await apiFetch<AdminRafflesResponse | AdminRaffle[]>("/raffles", {
        token: token ?? undefined,
    });

    return Array.isArray(response) ? { raffles: response } : response;
}
