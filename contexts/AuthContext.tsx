import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { AuthResponse, CompleteProfileRequest, User } from "@/types/auth.types";
import { UpdateUserRequest } from "@/types/user.types";
import { showToast } from "@/utils/showToast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Interface do que o Context vai fornecer
interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  republicData: any;
  loading: boolean;
  error: string | null;
  loginWithGoogle: (token: string) => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserRequest) => Promise<void>;
  completeProfile: (data: CompleteProfileRequest) => Promise<void>;
}

// Criar o Context
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider para envolver o app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Começa true para verificar auth
  const [error, setError] = useState<string | null>(null);
  const [republicData, setRepublicData] = useState(null);

  // Ao montar o componente, verificar se há usuário logado
  useEffect(() => {
    checkAuth();
  }, []);

  // Função para verificar autenticação
  const checkAuth = async () => {
    try {
      console.log("🔄 Verificando autenticação...");

      // Buscar token e user do AsyncStorage
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem("@app:token"),
        AsyncStorage.getItem("@app:user"),
      ]);

      // Se não tem token, não está logado
      if (!storedToken) {
        console.log("⚠️ Nenhum token encontrado");
        setLoading(false);
        return;
      }

      // Mostrar dados do cache imediatamente (UX rápido)
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }

      // Validar token com o backend
      try {
        const userData = await userService.fetchUser();
        console.log("✅ Token válido. Usuário autenticado");

        // Atualizar estado e cache se os dados mudaram
        setUser(userData);
        await AsyncStorage.setItem("@app:user", JSON.stringify(userData));
      } catch {
        console.error("⛔ Token inválido ou expirado");

        // Token inválido → limpar tudo
        await AsyncStorage.multiRemove(["@app:token", "@app:user"]);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Erro na verificação de auth:", error);
    } finally {
      setLoading(false);
    }
  };

  // Login com Google
  const loginWithGoogle = React.useCallback(
    async (googleToken: string): Promise<AuthResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        console.log("🔵 Iniciando login com Google...");
        const data = await authService.googleLogin(googleToken);

        // Salvar no AsyncStorage
        await AsyncStorage.setItem("@app:token", data.token);
        await AsyncStorage.setItem("@app:user", JSON.stringify(data.user));

        // Atualizar estado
        setUser(data.user);

        console.log("✅ Login bem-sucedido");
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        console.error("❌ Erro no login:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Logout
  const logout = React.useCallback(async () => {
    try {
      console.log("🔄 Fazendo logout...");

      // Limpar AsyncStorage
      await AsyncStorage.multiRemove(["@app:token", "@app:user"]);

      // Limpar estado
      setUser(null);

      // Redirecionar para login
      router.replace("/login");

      console.log("✅ Logout realizado");
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
    }
  }, []);

  // Completar perfil
  const completeProfile = React.useCallback(
    async (data: CompleteProfileRequest) => {
      try {
        console.log("📝 Dados enviados:", data);

        setLoading(true);

        // 1️⃣ Enviar dados para o backend
        await authService.completeProfile(data);
        console.log("✅ Dados enviados com sucesso");

        const updatedUser = await userService.fetchUser();

        // 3️⃣ Atualizar Context
        setUser(updatedUser);

        // 4️⃣ Atualizar AsyncStorage
        await AsyncStorage.setItem("@app:user", JSON.stringify(updatedUser));

        console.log("✅ Perfil completado e sincronizado");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao completar perfil";
        console.error("❌ Erro ao completar perfil:", errorMessage);

        setError(errorMessage);

        showToast.error("Erro ao completar o perfil. Tente novamente.");

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Atualizar dados do usuário
  const updateUser = React.useCallback(async (data: UpdateUserRequest) => {
    try {
      const userData = await userService.updateUser(data);
      console.log("✅ Usuário atualizado");
      setUser(userData);
      await AsyncStorage.setItem("@app:user", JSON.stringify(userData));
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("republic-data").then((json) => {
      if (json) {
        try {
          const parsed = JSON.parse(json);
          setRepublicData(parsed);
        } catch (err) {
          console.warn("Erro ao parsear republic-data", err);
        }
      }
    });
  }, []);

  const contextValue = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      republicData,
      loginWithGoogle,
      logout,
      updateUser,
      completeProfile,
    }),
    [
      user,
      loading,
      republicData,
      error,
      loginWithGoogle,
      logout,
      updateUser,
      completeProfile,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("❌ useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
