const AUTH_TOKEN_KEY = "rifa_admin_token";

export function saveAuthToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function removeAuthToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}