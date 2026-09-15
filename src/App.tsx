import { useEffect, useState } from "react";
import { apiFetch } from "./services/api";

type HealthResponse = {
  ok: boolean;
  service: string;
};

function App() {
  const [message, setMessage] = useState("Testando API...");

  useEffect(() => {
    apiFetch<HealthResponse>("/health")
      .then((data) => {
        setMessage(`API conectada: ${data.service}`);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  }, []);

  return (
    <main>
      <h1>Rifa Dflugann</h1>
      <p>{message}</p>
    </main>
  );
}

export default App;