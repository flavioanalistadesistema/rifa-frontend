const apiUrl = import.meta.env.VITE_API_URL;

type UploadType = "prize" | "receipt";

type UploadResponse = {
    url: string;
    path: string;
};

export async function uploadFile(
    file: File,
    type: UploadType,
    token?: string
) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${apiUrl}/uploads?type=${type}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? "Erro ao enviar arquivo.");
    }

    return data as UploadResponse;
}