/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FormEventHandler, useState } from "react";
import { Credentials } from "lib/types";
import { useAuth } from "providers/auth/AuthProvider";

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
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={credentials.email}
              onChange={(e) =>
                setCredentials((curr) => ({
                  ...curr,
                  email: e.target.value,
                }))
              }
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="flex flex-row justify-between text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((curr) => ({
                  ...curr,
                  password: e.target.value,
                }))
              }
            />
          </fieldset>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign up
          </button>
        </form>

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
