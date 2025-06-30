"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const { login, register, user, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email || !password) {
      setFormError("Preencha todos os campos.");
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setFormError("As senhas não coincidem.");
      return;
    }
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      router.push("/");
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);
  
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          {isLogin ? "Entrar na sua conta" : "Criar nova conta"}
        </h2>
        {formError && (
          <div className="text-red-600 text-sm text-center">{formError}</div>
        )}
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <Input
              type="password"
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
        </Button>
        <div className="text-center">
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setIsLogin((v) => !v)}
          >
            {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
