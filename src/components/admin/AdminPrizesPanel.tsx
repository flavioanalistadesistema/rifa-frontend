import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Prize } from "../../types/raffle";
import { createPrize, deletePrize, updatePrize } from "../../services/admin-prizes";
import { getAuthToken } from "../../services/auth-token";
import styles from "./AdminPrizesPanel.module.css";
import { uploadFile } from "../../services/uploads";

type AdminPrizesPanelProps = {
    raffleId: string;
    prizes: Prize[];
};

type PrizeFormState = {
    name: string;
    description: string;
    imageUrl: string;
};

const emptyForm: PrizeFormState = {
    name: "",
    description: "",
    imageUrl: "",
};

export function AdminPrizesPanel({ raffleId, prizes = [] }: AdminPrizesPanelProps) {
    const queryClient = useQueryClient();

    const [form, setForm] = useState<PrizeFormState>(emptyForm);
    const [editingPrizeId, setEditingPrizeId] = useState<string | null>(null);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const token = getAuthToken();

    const savePrizeMutation = useMutation({

        mutationFn: async () => {
            if (!token) {
                throw new Error("Token administrativo não encontrado.");
            }

            let imageUrl = form.imageUrl || undefined;

            if (selectedImage) {
                const uploadResult = await uploadFile(selectedImage, "prize", token);
                imageUrl = uploadResult.url;
            }

            const payload = {
                name: form.name,
                description: form.description,
                imageUrl,
            };

            if (editingPrizeId) {
                return updatePrize(editingPrizeId, payload, token);
            }

            return createPrize(raffleId, payload, token);
        },
        onSuccess: () => {
            setForm(emptyForm);
            setSelectedImage(null);
            setEditingPrizeId(null);
            queryClient.invalidateQueries({ queryKey: ["admin", "raffle", raffleId] });
            queryClient.invalidateQueries({ queryKey: ["raffle", raffleId] });
        },


    });

    const deletePrizeMutation = useMutation({
        mutationFn: async (prizeId: string) => {
            if (!token) {
                throw new Error("Token administrativo não encontrado.");
            }

            return deletePrize(prizeId, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "raffle", raffleId] });
            queryClient.invalidateQueries({ queryKey: ["raffle", raffleId] });
        },
    });

    function handleEdit(prize: Prize) {
        setEditingPrizeId(prize.id);
        setForm({
            name: prize.name ?? "",
            description: prize.description ?? "",
            imageUrl: prize.imageUrl ?? "",
        });
    }

    function handleCancelEdit() {
        setEditingPrizeId(null);
        setSelectedImage(null);
        setForm(emptyForm);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.name.trim() || !form.description.trim()) {
            return;
        }

        savePrizeMutation.mutate();
    }

    return (
        <section className={styles.panel}>
            <div className={styles.header}>
                <div>
                    <h2>Prêmios</h2>
                    <p>Cadastre e edite os prêmios exibidos na página pública da rifa.</p>
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                    Nome do prêmio
                    <input
                        value={form.name}
                        onChange={(event) =>
                            setForm((current) => ({ ...current, name: event.target.value }))
                        }
                        placeholder="Ex: Guitarra elétrica"
                    />
                </label>

                <label>
                    Descrição
                    <textarea
                        value={form.description}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                description: event.target.value,
                            }))
                        }
                        placeholder="Descreva o prêmio"
                        rows={4}
                    />
                </label>
                <label>
                    Enviar imagem
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            setSelectedImage(file);
                        }}
                    />
                </label>
                {selectedImage && (
                    <p className={styles.fileName}>Arquivo selecionado: {selectedImage.name}</p>
                )}
                {savePrizeMutation.isError && (
                    <p className={styles.error}>
                        {(savePrizeMutation.error as Error).message}
                    </p>
                )}

                <div className={styles.actions}>
                    {editingPrizeId && (
                        <button type="button" onClick={handleCancelEdit}>
                            Cancelar edição
                        </button>
                    )}

                    <button type="submit" disabled={savePrizeMutation.isPending}>
                        {savePrizeMutation.isPending
                            ? "Salvando..."
                            : editingPrizeId
                                ? "Salvar alterações"
                                : "Cadastrar prêmio"}
                    </button>
                </div>
            </form>

            <div className={styles.list}>
                {prizes.length === 0 ? (
                    <p className={styles.empty}>Nenhum prêmio cadastrado ainda.</p>
                ) : (
                    prizes.map((prize) => (
                        <article key={prize.id} className={styles.card}>
                            {prize.imageUrl ? (
                                <img src={prize.imageUrl} alt={prize.name} />
                            ) : (
                                <div className={styles.placeholder}>Sem imagem</div>
                            )}

                            <div className={styles.cardContent}>
                                <h3>{prize.name}</h3>
                                <p>{prize.description}</p>

                                <div className={styles.cardActions}>
                                    <button type="button" onClick={() => handleEdit(prize)}>
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        disabled={deletePrizeMutation.isPending}
                                        onClick={() => deletePrizeMutation.mutate(prize.id)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}