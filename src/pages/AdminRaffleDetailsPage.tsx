import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getRaffleDetails } from "../services/raffles";

export function AdminRaffleDetailsPage() {
    const { raffleId } = useParams<{ raffleId: string }>();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["admin", "raffle", raffleId],
        queryFn: () => getRaffleDetails(raffleId ?? ""),
        enabled: Boolean(raffleId),
    });

    if (!raffleId) {
        return <p>Rifa não informada.</p>;
    }

    if (isLoading) {
        return <p>Carregando rifa...</p>;
    }

    if (isError) {
        return <p>{error.message}</p>;
    }

    if (!data) {
        return <p>Rifa não encontrada.</p>;
    }

    return (
        <div>
            <Link to="/admin">Voltar</Link>

            <h2>{data.raffle.title}</h2>
            <p>{data.raffle.description}</p>

            <section>
                <h3>Resumo</h3>
                <ul>
                    <li>Total: {data.summary.total}</li>
                    <li>Vendidos: {data.summary.sold}</li>
                    <li>Reservados: {data.summary.reserved}</li>
                    <li>Disponíveis: {data.summary.available}</li>
                </ul>
            </section>
        </div>
    );
}