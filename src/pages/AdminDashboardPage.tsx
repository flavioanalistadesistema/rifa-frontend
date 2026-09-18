import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRaffle,
  generateRaffleNumbers,
  getAdminRaffles,
} from "../services/admin-raffles";
import { getRaffleDetails } from "../services/raffles";
import styles from "./AdminDashboardPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

type CreateRaffleForm = {
  title: string;
  description: string;
  ticketPrice: string;
  pixKey: string;
  totalNumbers: string;
};

const emptyForm: CreateRaffleForm = {
  title: "",
  description: "",
  ticketPrice: "",
  pixKey: "",
  totalNumbers: "100",
};

export function AdminDashboardPage() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [form, setForm] = useState<CreateRaffleForm>(emptyForm);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "raffles"],
    queryFn: getAdminRaffles,
  });

  const raffleDetailsQueries = useQueries({
    queries: (data?.raffles ?? []).map((raffle) => ({
      queryKey: ["admin", "raffle", raffle.id],
      queryFn: () => getRaffleDetails(raffle.id),
      enabled: Boolean(data),
    })),
  });

  const createRaffleMutation = useMutation({
    mutationFn: async () => {
      const ticketPrice = Number(form.ticketPrice.replace(",", "."));
      const totalNumbers = Number(form.totalNumbers);
      const raffle = await createRaffle({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        ticketPrice,
        pixKey: form.pixKey.trim(),
        totalNumbers,
      });

      await generateRaffleNumbers(raffle.id);
      return raffle;
    },
    onSuccess: (raffle) => {
      setForm(emptyForm);
      setIsCreateFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "raffles"] });
      navigate(`/admin/raffles/${raffle.id}`);
    },
  });

  function handleCreateRaffle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ticketPrice = Number(form.ticketPrice.replace(",", "."));
    const totalNumbers = Number(form.totalNumbers);

    if (
      !form.title.trim() ||
      !Number.isFinite(ticketPrice) ||
      ticketPrice <= 0 ||
      !form.pixKey.trim() ||
      !Number.isInteger(totalNumbers) ||
      totalNumbers <= 0
    ) {
      return;
    }

    createRaffleMutation.mutate();
  }

  if (isLoading) {
    return <p>Carregando rifas...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>Painel administrativo</span>
            <h2>Rifas</h2>
            <p>Gerencie rifas, pagamentos e sorteios.</p>
          </div>
          <button
            className={styles.createButton}
            type="button"
            onClick={() => setIsCreateFormOpen((current) => !current)}
          >
            {isCreateFormOpen ? "Fechar" : "Criar rifa"}
          </button>
        </header>

        {isCreateFormOpen && (
          <form className={styles.createForm} onSubmit={handleCreateRaffle}>
            <h3>Nova rifa</h3>

            <div className={styles.formGrid}>
              <label>
                Título
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Ex: Rifa beneficente"
                />
              </label>

              <label>
                Chave PIX
                <input
                  required
                  value={form.pixKey}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, pixKey: event.target.value }))
                  }
                  placeholder="CPF, e-mail ou chave aleatória"
                />
              </label>

              <label>
                Valor por número
                <input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={form.ticketPrice}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, ticketPrice: event.target.value }))
                  }
                  placeholder="30,00"
                />
              </label>

              <label>
                Quantidade de números
                <input
                  required
                  min="1"
                  step="1"
                  type="number"
                  value={form.totalNumbers}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, totalNumbers: event.target.value }))
                  }
                />
              </label>
            </div>

            <label>
              Descrição
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Descreva a rifa"
              />
            </label>

            {createRaffleMutation.isError && (
              <p className={styles.formError}>
                {(createRaffleMutation.error as Error).message}
              </p>
            )}

            <button className={styles.submitButton} type="submit" disabled={createRaffleMutation.isPending}>
              {createRaffleMutation.isPending ? "Criando rifa..." : "Criar rifa"}
            </button>
          </form>
        )}

        <div className={styles.grid}>
          {data?.raffles.map((raffle, index) => {
            const summary = raffleDetailsQueries[index]?.data?.summary;

            return (
            <article key={raffle.id} className={styles.card}>
              <span className={styles.status}>{raffle.status}</span>
              <Link className={styles.link} to={`/admin/raffles/${raffle.id}`}>
                Abrir rifa
              </Link>
              <h3>{raffle.title}</h3>
              <p>{raffle.description}</p>

              <dl className={styles.meta}>
                <div>
                  <dt>Disponíveis</dt>
                  <dd>{summary?.available ?? "-"}</dd>
                </div>

                <div>
                  <dt>Reservados</dt>
                  <dd>{summary?.reserved ?? "-"}</dd>
                </div>

                <div>
                  <dt>Vendidos</dt>
                  <dd>{summary?.sold ?? "-"}</dd>
                </div>
              </dl>
            </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}