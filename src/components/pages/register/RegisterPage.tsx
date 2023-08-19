import Link from "next/link";
import { FormEventHandler, ReactElement, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Credentials } from "lib/types";

import { useAuth } from "providers/auth/AuthProvider";

import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";
import { CenteredLayout } from "components/layouts/centered/CenteredLayout";

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
    <>
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
    </>
  );
}

RegisterPage.getLayout = (page: ReactElement) => (
  <CenteredLayout>{page}</CenteredLayout>
);
