import { useOrganizationList } from "@clerk/clerk-react";
import { Form } from "@radix-ui/react-form";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "components/atoms/button";
import { Card, CardContent, CardHeader } from "components/atoms/card";
import { Input } from "components/atoms/input";
import { H3, Paragraph } from "components/atoms/typography";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createOrganization, setActive } = useOrganizationList();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (typeof createOrganization === "function") {
      try {
        setIsLoading(true);
        const { id } = await createOrganization({ name });
        await setActive({
          organization: id,
        });

        return router.push("/");
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    setName("");
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <Card className="w-1/3">
        <CardHeader>
          <H3>Workspace</H3>
        </CardHeader>
        <CardContent>
          <Paragraph>
            Pick a workspace name. This should match the name of your
            organization or team. You can change it later.
          </Paragraph>

          <Form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              value={name}
              name="workspace"
              placeholder="Acme"
              onChange={(e) => setName(e.target.value)}
              validations={{
                valueMissing: "Please enter a workspace name",
              }}
            />
            <Button disabled={!name} loading={isLoading} type="submit">
              Create Workspace
            </Button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
