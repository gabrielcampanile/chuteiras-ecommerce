"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import {
  listAllUsers,
  updateUserRole,
  UserProfile,
} from "@/lib/services/userService";
import { Button } from "@/components/ui/button";

export default function AdminUsuariosPage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (
      !loading &&
      userProfile &&
      userProfile.role !== "admin" &&
      userProfile.role !== "seller"
    ) {
      router.replace("/");
    }
  }, [loading, userProfile, router]);

  useEffect(() => {
    if (userProfile && userProfile.role === "admin") {
      setLoadingUsers(true);
      listAllUsers()
        .then(setUsers)
        .catch(() => setError("Erro ao carregar usuários."))
        .finally(() => setLoadingUsers(false));
    }
  }, [userProfile]);

  const handleChangeRole = async (
    uid: string,
    newRole: "admin" | "seller" | "customer"
  ) => {
    setUpdating(uid);
    try {
      await updateUserRole(uid, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
      );
    } catch {
      setError("Erro ao atualizar papel do usuário.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading || !userProfile) {
    return <div className="p-8 text-center">Carregando...</div>;
  }
  if (userProfile.role !== "admin") {
    return <div className="p-8 text-center text-red-600">Acesso negado.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>
      {loadingUsers ? (
        <div>Carregando usuários...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">E-mail</th>
              <th className="p-2 text-left">Papel</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.uid} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2 capitalize">{u.role}</td>
                <td className="p-2 flex gap-2">
                  {["customer", "seller", "admin"].map((role) => (
                    <Button
                      key={role}
                      size="sm"
                      variant={u.role === role ? "default" : "outline"}
                      disabled={u.role === role || updating === u.uid}
                      onClick={() => handleChangeRole(u.uid, role as any)}
                    >
                      {role}
                    </Button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
