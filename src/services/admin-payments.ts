import type { Payment, PaymentStatus } from "../types/payment";
import { apiFetch } from "./api";
import { getAuthToken } from "./auth-token";

type GetAdminPaymentsParams = {
    raffleId?: string;
    status?: PaymentStatus;
};

type AdminPaymentsResponse = {
    payments: Payment[];
};

export function getAdminPayments(params: GetAdminPaymentsParams = {}) {
    const token = getAuthToken();

    const searchParams = new URLSearchParams();

    if (params.raffleId) {
        searchParams.set("raffleId", params.raffleId);
    }

    if (params.status) {
        searchParams.set("status", params.status);
    }

    const queryString = searchParams.toString();

    return apiFetch<AdminPaymentsResponse>(
        `/payments${queryString ? `?${queryString}` : ""}`,
        {
            token: token ?? undefined,
        }
    );
}

export function confirmPayment(paymentId: string) {
    const token = getAuthToken();

    return apiFetch<{ message: string }>(`/payments/${paymentId}/confirm`, {
        method: "PATCH",
        token: token ?? undefined,
    });
}

export function rejectPayment(paymentId: string) {
    const token = getAuthToken();

    return apiFetch<{ message: string }>(`/payments/${paymentId}/reject`, {
        method: "PATCH",
        token: token ?? undefined,
    });
}