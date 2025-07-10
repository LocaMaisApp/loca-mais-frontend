import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import api from "../../../api/axiosConfig";
import type { User } from "../../../context/AuthContext";
import { useAuth } from "../../../hooks/useAuth";
import { handleApiError } from "../../../utils/errorHandler";

// Schema de validação com Zod para login
const signInSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    try {
      const response = await api.post("/auth/signIn", data);
      const responseData = response.data as { accessToken: string; user: User };
      signIn(responseData.user, responseData.accessToken);
      navigate("/");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error, "Erro ao fazer login");
      setError(errorMessage);
    }
  };

  return (
    <div className="relative flex size-full h-screen max-h-screen flex-col bg-gray-50 overflow-x-hidden font-sans">
      <div className="flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] px-10 py-1">
          <Link to={"/"} className="cursor-pointer flex items-center gap-2">
            <img
              src="/LocaMaisLogoIcone.png"
              alt="LocaMais Logo"
              className="w-12 h-12"
            />
            <h2 className="text-[#101418] text-lg font-bold leading-tight tracking-[-0.015em]">
              LocaMais
            </h2>
          </Link>
        </header>
        <div className="px-40 flex flex-1 justify-center">
          <div className="flex flex-col py-1 max-w-3/4 flex-1">
            <h2 className="text-[#101418] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Entrar na sua conta
            </h2>
            <p className="text-[#5c728a] text-base text-center pb-5">
              Entre com suas credenciais para acessar sua conta
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full items-center gap-6"
            >
              <div className="flex w-1/2 flex-wrap items-end gap-4 px-4 py-1">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#101418] text-base font-medium leading-normal pb-2">
                    Email
                  </p>
                  <input
                    type="email"
                    placeholder="Digite seu email"
                    {...register("email")}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101418] focus:outline-0 focus:ring-0 border-none bg-[#eaedf1] focus:border-none h-14 placeholder:text-[#5c728a] p-4 text-base font-normal leading-normal"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </label>
              </div>

              <div className="flex w-1/2 flex-wrap items-end gap-4 px-4 py-1">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#101418] text-base font-medium leading-normal pb-2">
                    Senha
                  </p>
                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    {...register("password")}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101418] focus:outline-0 focus:ring-0 border-none bg-[#eaedf1] focus:border-none h-14 placeholder:text-[#5c728a] p-4 text-base font-normal leading-normal"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </label>
              </div>
              {error && (
                <p className="text-sm font-medium text-red-500">{error}</p>
              )}

              <div className="flex flex-col items-center gap-4 px-4 py-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[#b2cbe5] text-[#101418] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#9bb8d3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  <span className="truncate">
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </span>
                </button>

                <div className="text-center">
                  <p className="text-[#5c728a] text-sm">
                    Não tem uma conta?{" "}
                    <Link
                      to="/auth/sign-up"
                      className="text-[#7b9cbd] hover:text-[#9bb8d3] font-medium underline"
                    >
                      Cadastre-se aqui
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
