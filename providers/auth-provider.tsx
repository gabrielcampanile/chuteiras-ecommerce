"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  createUserProfile,
  getUserProfile,
  UserProfile,
} from "@/lib/services/userService";

interface AuthContextProps {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Função para traduzir erros do Firebase para português
const translateFirebaseError = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/user-not-found': 'Usuário não encontrado. Verifique se o e-mail está correto.',
    'auth/wrong-password': 'Senha incorreta. Verifique sua senha.',
    'auth/invalid-email': 'E-mail inválido. Digite um e-mail válido.',
    'auth/user-disabled': 'Conta desabilitada. Entre em contato com o suporte.',
    'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente em alguns minutos.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/email-already-in-use': 'Este e-mail já está sendo usado por outra conta.',
    'auth/weak-password': 'A senha é muito fraca. Use uma senha mais forte.',
    'auth/operation-not-allowed': 'Operação não permitida. Entre em contato com o suporte.',
    'auth/invalid-credential': 'Credenciais inválidas. Verifique seu e-mail e senha.',
    'auth/account-exists-with-different-credential': 'Já existe uma conta com este e-mail usando outro método de login.',
    'auth/requires-recent-login': 'Esta operação requer um login recente. Faça login novamente.',
    'auth/credential-already-in-use': 'Esta credencial já está sendo usada por outra conta.',
    'auth/invalid-verification-code': 'Código de verificação inválido.',
    'auth/invalid-verification-id': 'ID de verificação inválido.',
    'auth/quota-exceeded': 'Limite de tentativas excedido. Tente novamente mais tarde.',
    'auth/unauthorized-domain': 'Este domínio não está autorizado para esta operação.',
    'auth/unsupported-persistence-type': 'Tipo de persistência não suportado.',
    'auth/cancelled-popup-request': 'Solicitação de popup cancelada.',
    'auth/popup-blocked': 'Popup bloqueado pelo navegador. Permita popups para este site.',
    'auth/popup-closed-by-user': 'Popup fechado pelo usuário.',
    'auth/timeout': 'Tempo limite excedido. Tente novamente.',
    'auth/operation-cancelled': 'Operação cancelada.',
    'auth/operation-failed': 'Operação falhou. Tente novamente.',
    'auth/operation-timeout': 'Tempo limite da operação excedido.',
    'auth/operation-unavailable': 'Operação não disponível no momento.',
    'auth/operation-unsupported': 'Operação não suportada.',
    'auth/operation-aborted': 'Operação abortada.',
    'auth/operation-deadline-exceeded': 'Prazo da operação excedido.',
    'auth/operation-failed-precondition': 'Operação falhou devido a uma condição prévia não atendida.',
    'auth/operation-out-of-range': 'Operação fora do intervalo permitido.',
    'auth/operation-permission-denied': 'Permissão negada para esta operação.',
    'auth/operation-resource-exhausted': 'Recursos esgotados para esta operação.',
    'auth/operation-unauthenticated': 'Operação requer autenticação.',
    'auth/operation-unknown': 'Erro desconhecido. Tente novamente.',
  };

  return errorMessages[errorCode] || 'Ocorreu um erro inesperado. Tente novamente.';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error('Erro ao buscar perfil do usuário:', err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(cred.user.uid);
      setUserProfile(profile);
    } catch (err: any) {
      const translatedError = translateFirebaseError(err.code);
      setError(translatedError);
      throw err; // Re-throw para que a página possa tratar o erro específico
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile({
        uid: cred.user.uid,
        email: cred.user.email || "",
        role: "customer",
      });
      setUserProfile({
        uid: cred.user.uid,
        email: cred.user.email || "",
        role: "customer",
        createdAt: new Date(),
      });
    } catch (err: any) {
      const translatedError = translateFirebaseError(err.code);
      setError(translatedError);
      throw err; // Re-throw para que a página possa tratar o erro específico
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      const translatedError = translateFirebaseError(err.code);
      setError(translatedError);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, error, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}