import { apiFetch } from "./api";

type LoginPayload = {
    email: string;
    password: string;
};

type LoginResponse = {
    token: string;
};

type MeResponse = {
    admin: {
        email: string;
        role: string;
    };
};

export function login(payload: LoginPayload) {
    return apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function getMe(token: string) {
    return apiFetch<MeResponse>("/auth/me", {
        token,
    });
}