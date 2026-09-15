const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
    throw new Error("VITE_API_URL não configurada.");
}

type UploadFileResponse = {
    message: string;
    path: string;
    url: string;
};

export async function uploadFile(file: File, type: "prize" | "receipt") {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${apiUrl}/uploads?type=${type}`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message ?? "Erro ao enviar arquivo.");
    }

    return data as UploadFileResponse;
}