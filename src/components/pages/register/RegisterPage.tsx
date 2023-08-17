import { Credentials } from "lib/types";
import { useAuth } from "providers/auth/AuthProvider";
import { FormEventHandler, useState } from "react";

export function RegisterPage() {
  const { register } = useAuth();

  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await register(credentials);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
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
        username
        <input
          type="text"
          value={credentials.username || credentials.email.split("@")[0]}
          onChange={(e) =>
            setCredentials((curr) => ({
              ...curr,
              username: e.target.value,
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
