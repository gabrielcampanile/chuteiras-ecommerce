"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { updateUserProfile, getUserProfile } from "@/lib/services/userService";

export default function MinhaContaPage() {
  const { user, userProfile, loading } = useAuth();
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setNome(profile.name || "");
          setEmail(profile.email || "");
          setNumero(profile.numero || "");
          setEndereco(profile.endereco || "");
        }
      }
    }
    fetchProfile();
  }, [user]);

  if (!user) {
    router.replace("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!nome || !numero || !endereco) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await updateUserProfile(user.uid, { name: nome, numero, endereco });
      setFormSuccess("Dados atualizados com sucesso!");
      // Redirecionar para página inicial após 2 segundos para mostrar a mensagem de sucesso
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setFormError("Erro ao salvar dados. Tente novamente.");
    }
  };

  const handleTrocarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!novaSenha || novaSenha !== confirmarSenha) {
      setFormError("As senhas não coincidem.");
      return;
    }
    // Aqui você pode chamar a função de troca de senha do Firebase
    setFormSuccess("Senha alterada com sucesso!");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Minha Conta</h2>
        {formError && (
          <div className="text-red-600 text-sm text-center">{formError}</div>
        )}
        {formSuccess && (
          <div className="text-green-600 text-sm text-center">
            {formSuccess}
            <p className="text-gray-500 text-xs mt-1">
              Redirecionando para página inicial...
            </p>
          </div>
        )}
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Número de telefone"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Endereço completo"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
          <Input type="email" placeholder="E-mail" value={email} disabled />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Dados"}
        </Button>
        {/* <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-2 text-center">Trocar Senha</h3>
          <Input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <Button
            type="button"
            className="w-full mt-2"
            onClick={handleTrocarSenha}
          >
            Trocar Senha
          </Button>
        </div> */}
      </form>
    </div>
  );
}
