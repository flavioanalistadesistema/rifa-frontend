import { apiFetch } from "./api";
import { getAuthToken } from "./auth-token";

type CreateDrawResponse = {
    message: string;
};

export function createDraw(raffleId: string) {
    const token = getAuthToken();

    return apiFetch<CreateDrawResponse>(`/raffles/${raffleId}/draw`, {
        method: "POST",
        token: token ?? undefined,
    });
}