import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import api from "../../../api/axiosConfig";
import { useAuth } from "../../../hooks/useAuth";

// Schema de validação com Zod
const signUpSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome não pode exceder 100 caracteres"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
      "CPF deve estar no formato XXX.XXX.XXX-XX ou conter 11 dígitos"
    ),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha não pode exceder 50 caracteres"),
  phoneNumber: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/,
      "Telefone deve estar no formato (XX) XXXXX-XXXX"
    ),
  userType: z.enum(["LANDLORD", "TENANT"], {
    required_error: "Selecione o tipo de usuário",
    invalid_type_error: "Tipo de usuário inválido",
  }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

// Funções auxiliares para formatação
const formatCPF = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const formatPhone = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length <= 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const SignUp: React.FC = () => {
  const { setUser } = useAuth();
  const navigate=useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      cpf: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    if (data.userType !== "LANDLORD" && data.userType !== "TENANT") {
      throw new Error("Tipo de usuário inválido");
    }

    const { fullName, cpf, phoneNumber, userType, ...formData } = data;
    const formattedData = {
      name: fullName.split(" ")[0],
      lastName: fullName.split(" ").slice(1).join(" "),
      cpf: cpf.replace(/\D/g, ""),
      phone: phoneNumber.replace(/\D/g, ""),
      type: userType,
      ...formData,
    };
    try {
      const response = await api.post(`/auth/signup`, {
        ...formattedData,
      });
      const data = response.data;
      setUser(data);
      navigate("/");
      
    } catch {
      console.error("Erro ao criar conta:");
    }
  };

  return (
    <div className="relative flex size-full h-screen max-h-screen flex-col bg-gray-50 overflow-x-hidden font-sans">
      <div className=" flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] px-10 py-1">
          <div className="flex items-center gap-4 text-[#101418]">
            <img
              src="/LocaMaisLogoIcone.png"
              alt="LocaMais Logo"
              className="w-12 h-12"
            />
            <h2 className="text-[#101418] text-lg font-bold leading-tight tracking-[-0.015em]">
              LocaMais
            </h2>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center ">
          <div className="flex flex-col py-1 max-w-3/4 flex-1">
            <h2 className="text-[#101418] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Criar conta
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full items-center"
            >
              <div className="flex w-1/2 flex-wrap items-end gap-4 px-4 py-1">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#101418] text-base font-medium leading-normal pb-2">
                    Nome completo
                  </p>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    {...register("fullName")}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101418] focus:outline-0 focus:ring-0 border-none bg-[#eaedf1] focus:border-none h-14 placeholder:text-[#5c728a] p-4 text-base font-normal leading-normal"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </label>
              </div>
              <div className="flex w-1/2 flex-wrap items-end gap-4 px-4 py-1">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#101418] text-base font-medium leading-normal pb-2">
                    CPF
                  </p>
                  <input
                    type="text"
                    placeholder="CPF"
                    maxLength={14}
                    {...register("cpf")}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      e.target.value = formatted;
                    }}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101418] focus:outline-0 focus:ring-0 border-none bg-[#eaedf1] focus:border-none h-14 placeholder:text-[#5c728a] p-4 text-base font-normal leading-normal"
                  />
                  {errors.cpf && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cpf.message}
                    </p>
                  )}
                </label>
              </div>
              <div className="flex w-1/2 flex-wrap items-end gap-2 px-4 py-1">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#101418] text-base font-medium leading-normal pb-2">
                    Email
                  </p>
                  <input
                    type="email"
                    placeholder="Email"
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
                    placeholder="Senha"
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

              <div className="flex w-1/2 flex-wrap items-end gap-4 px-4 py-1">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#101418] text-base font-medium leading-normal pb-2">
                    Telefone
                  </p>
                  <input
                    type="tel"
                    placeholder="(XX) XXXXX-XXXX"
                    maxLength={15}
                    {...register("phoneNumber")}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      e.target.value = formatted;
                    }}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101418] focus:outline-0 focus:ring-0 border-none bg-[#eaedf1] focus:border-none h-14 placeholder:text-[#5c728a] p-4 text-base font-normal leading-normal"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </label>
              </div>

              <div className="space-y-1 gap-3 p-4">
                <div className="flex items-center gap-3 w-fit">
                  <label className="text-sm font-medium leading-normal flex items-center justify-center rounded-xl border border-[#d4dbe2] px-4 h-11 text-[#101418] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#b2cbe5] relative cursor-pointer">
                    Sou proprietário
                    <input
                      type="radio"
                      value="LANDLORD"
                      {...register("userType")}
                      className="invisible absolute"
                    />
                  </label>
                  <label className="text-sm font-medium leading-normal flex items-center justify-center rounded-xl border border-[#d4dbe2] px-4 h-11 text-[#101418] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#b2cbe5] relative cursor-pointer">
                    Sou locatário
                    <input
                      type="radio"
                      value="TENANT"
                      {...register("userType")}
                      className="invisible absolute"
                    />
                  </label>
                </div>
                {errors.userType && (
                  <p className="text-red-500 text-sm mt-1 w-full text-center">
                    {errors.userType.message}
                  </p>
                )}
              </div>

              <div className="flex px-4 py-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-1/2 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#b2cbe5] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#9bb8d3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">
                    {isSubmitting ? "Carregando..." : "Continuar"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
