import Link from "next/link";
import { FormEventHandler, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Credentials } from "lib/types";

import { useAuth } from "providers/auth/AuthProvider";
import { Button } from "components/atoms/button/Button";
import { Input } from "components/atoms/input/Input";

export function LoginPage() {
  const { login } = useAuth();

  const [credentials, setCredentials] = useState<Omit<Credentials, "username">>(
    {
      email: "",
      password: "",
    },
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await login(credentials);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <header className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </header>

      <section className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            name="email"
            type="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials((curr) => ({
                ...curr,
                email: e.target.value,
              }))
            }
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((curr) => ({
                ...curr,
                password: e.target.value,
              }))
            }
          />

          <Button size="lg" type="submit">
            Sign in
          </Button>
        </Form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <Link
            href="/register"
            className="font-semibold leading-6 ml-1 text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
