import { Credentials } from "lib/types";
import { useAuth } from "providers/auth/AuthProvider";
import { FormEventHandler, useState } from "react";

export function LoginPage() {
  const { login } = useAuth();

  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await login(credentials);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        email
        <input
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials((curr) => ({
              ...curr,
              email: e.target.value,
            }))
          }
        />
      </label>
      <label>
        password
        <input
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((curr) => ({
              ...curr,
              password: e.target.value,
            }))
          }
        />
      </label>

      <button>Register</button>
    </form>
  );
}
