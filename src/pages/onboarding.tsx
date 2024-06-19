import Image from "next/image";
import Link from "next/link";

import { Form } from "@radix-ui/react-form";
import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";

export default function OnboardingPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form className="grid gap-4">
            <div className="grid gap-2">
              <Input
                label="Email"
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                validations={{
                  valueMissing: "Thiy field is required",
                  typeMismatch: "Please enter a valid email address",
                }}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                label="Password"
                name="password"
                id="password"
                type="password"
                validations={{
                  valueMissing: "Thiy field is required",
                }}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block h-screen bg-slate-50 p-12">
        <Image
          src="/images/undraw_schedule_meeting_52nu.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-contain  dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
