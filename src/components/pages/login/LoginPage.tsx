import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import Image from "next/image";

import { Button } from "components/atoms/button/Button";

export function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
          </div>
          <div className="grid gap-4">
            <SignInButton forceRedirectUrl="/">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </SignInButton>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <SignUpButton
              forceRedirectUrl="/"
              // @ts-ignore
              className="underline"
            >
              Sign up
            </SignUpButton>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/images/cooking-illustration.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
