import Link from "next/link";
import { FormEventHandler, ReactElement, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Credentials } from "lib/types";

import { Button } from "components/atoms/button/Button";
import { Input } from "components/atoms/input/Input";
import { CenteredLayout } from "components/layouts/centered/CenteredLayout";
import { useUser } from "hooks/useUser";

export function LoginPage() {
  const { login } = useUser();

  const [credentials, setCredentials] = useState<
    Omit<Credentials, "username" | "workspace">
  >({
    email: "",
    password: "",
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await login({
        variables: {
          credentials,
        },
      });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <>
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
    </>
  );
}

LoginPage.getLayout = (page: ReactElement) => (
  <CenteredLayout>{page}</CenteredLayout>
);
