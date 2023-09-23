import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title?: string;
}

export function CenteredLayout({
  children,
  title = "Sign in to your account",
}: Props) {
  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <header className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-20 w-auto"
          src="https://res.cloudinary.com/dlha07ue9/image/upload/f_auto,q_auto/v1/assets/logo-notext"
          alt="Nimblerp"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {title}
        </h2>
      </header>

      <section className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {children}
      </section>
    </main>
  );
}
