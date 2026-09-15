const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
    throw new Error("VITE_API_URL não configurada.");
}

type RequestOptions = RequestInit & {
    token?: string;
};

export async function apiFetch<TResponse>(
    path: string,
    options: RequestOptions = {}
): Promise<TResponse> {
    const { token, headers, ...fetchOptions } = options;

    const response = await fetch(`${apiUrl}${path}`, {
        ...fetchOptions,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message ?? "Erro ao chamar API.");
    }

    return data as TResponse;
}