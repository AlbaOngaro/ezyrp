import Link from "next/link";
import { FormEventHandler, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Credentials } from "lib/types";

import { useAuth } from "providers/auth/AuthProvider";

import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";

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
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <header className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create an account
        </h2>
      </header>

      <section className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            name="email"
            type="email"
            label="Email address"
            value={credentials.email}
            onChange={(e) =>
              setCredentials((curr) => ({
                ...curr,
                email: e.target.value,
              }))
            }
          />

          <Input
            name="password"
            type="password"
            label="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((curr) => ({
                ...curr,
                password: e.target.value,
              }))
            }
          />

          <Button size="lg" type="submit">
            Sign up
          </Button>
        </Form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?
          <Link
            href="/login"
            className="font-semibold leading-6 ml-1 text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
