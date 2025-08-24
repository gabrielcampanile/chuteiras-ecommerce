"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const { register, user, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const router = useRouter();

  // Limpar erros quando o componente montar
  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!email) {
      errors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "E-mail inválido";
    }

    if (!password) {
      errors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 dígitos";
    } else if (!/^\d{6,}$/.test(password)) {
      errors.password =
        "A senha deve conter apenas números e ter pelo menos 6 dígitos";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await register(email, password);
      setFormSuccess(
        "Conta criada com sucesso! Redirecionando para página inicial..."
      );
      // Redirecionar para página inicial após 2 segundos para mostrar a mensagem de sucesso
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setFormError("Erro ao criar conta. Tente novamente.");
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Criar nova conta</h2>
          <p className="text-gray-600 text-sm">
            Preencha os dados abaixo para criar sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {formError}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {formSuccess && (
            <div className="text-green-600 text-sm text-center">
              {formSuccess}
            </div>
          )}

          <div>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={
                validationErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
              autoFocus
            />
            {validationErrors.email && (
              <p className="text-red-600 text-xs mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Senha (6 dígitos numéricos)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={
                validationErrors.password
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
            {validationErrors.password && (
              <p className="text-red-600 text-xs mt-1">
                {validationErrors.password}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              A senha deve conter apenas números e ter pelo menos 6 dígitos
            </p>
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={
                validationErrors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
