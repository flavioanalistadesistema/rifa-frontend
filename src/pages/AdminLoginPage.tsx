import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { login } from "../services/auth";
import { saveAuthToken } from "../services/auth-token";
import styles from "./AdminLoginPage.module.css";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "Informe sua senha."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveAuthToken(data.token);
      navigate("/admin");
    },
  });

  function handleLogin(data: LoginFormData) {
    loginMutation.mutate(data);
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.eyebrow}>Painel administrativo</span>
        <h1 className={styles.title}>Entrar</h1>
        <p className={styles.description}>
          Acesse para confirmar pagamentos, editar prêmios e realizar o sorteio.
        </p>

        <form className={styles.form} onSubmit={handleSubmit(handleLogin)}>
          <label className={styles.field}>
            E-mail
            <input type="email" {...register("email")} />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </label>

          <label className={styles.field}>
            Senha
            <input type="password" {...register("password")} />
            {errors.password && (
              <span className={styles.error}>{errors.password.message}</span>
            )}
          </label>

          {loginMutation.isError && (
            <p className={styles.error}>{loginMutation.error.message}</p>
          )}

          <button
            className={styles.button}
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}