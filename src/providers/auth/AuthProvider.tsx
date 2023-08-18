import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";

import { Credentials, User } from "lib/types";

interface AuthContextValue {
  register: (credentials: Credentials) => Promise<unknown>;
  logout: () => Promise<void>;
  login: (credentials: Omit<Credentials, "username">) => Promise<unknown>;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue>({
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  login: () => Promise.resolve(),
  user: null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/session", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((res: User) => {
        setUser(res);
      })
      .catch((error) => {
        console.error(error);
        setUser(null);
      });

    const it = setInterval(() => {
      fetch("/api/auth/session", {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((res: User) => {
          setUser(res);
        })
        .catch((error) => {
          console.error(error);
          setUser(null);
        });
    }, 1000 * 60);

    return () => {
      clearInterval(it);
      controller.abort();
    };
  }, []);

  const register = useCallback(
    async (credentials: Credentials) => {
      try {
        await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(credentials),
        }).then((res) => res.json());

        return router.push("/");
      } catch (error: unknown) {
        console.error(error);
      }
    },
    [router],
  );

  const login = useCallback(
    async (credentials: Omit<Credentials, "username">) => {
      try {
        await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(credentials),
        }).then((res) => res.json());

        return router.push("/");
      } catch (error: unknown) {
        console.error(error);
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout");
      await router.push("/login");
    } catch (error: unknown) {
      console.error(error);
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        register,
        logout,
        login,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
