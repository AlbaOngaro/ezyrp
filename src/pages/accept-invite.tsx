import Image from "next/image";
import { useSignUp } from "@clerk/clerk-react";
import { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Form } from "@radix-ui/react-form";
import { useRouter } from "next/router";

import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";

export default function AcceptInvitePage() {
  const router = useRouter();
  const { signUp } = useSignUp();
  const searchParams = useSearchParams();
  const ticket = searchParams.get("__clerk_ticket");

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    if (ticket && password && signUp) {
      const response = await signUp.create({
        ticket,
        password,
        strategy: "ticket",
      });

      if (response.status === "complete") {
        router.push("/");
      }
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Enter a new password below to create your account
            </p>
          </div>
          <Form className="grid gap-4" onSubmit={handleSignup}>
            <Input
              placeholder="Password"
              name="password"
              type="password"
              required
              validations={{
                valueMissing: "Password is required",
              }}
            />
            <Button type="submit" className="w-full">
              Signup
            </Button>
          </Form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
