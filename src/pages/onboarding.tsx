import { useUser } from "@clerk/clerk-react";
import { Form } from "@radix-ui/react-form";
import { FormEventHandler, useState } from "react";
import { useAction } from "convex/react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "components/atoms/button";
import { Card } from "components/atoms/card";
import { Input } from "components/atoms/input";
import { api } from "convex/_generated/api";
import { Heading } from "components/atoms/heading";
import { Badge } from "components/atoms/badge";
import { cn } from "lib/utils/cn";
import { Paragraph } from "components/atoms/typography";

enum Step {
  Workspace,
  Plan,
  Summary,
}

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [step, setStep] = useState<Step>(Step.Workspace);

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

  const startCheckoutSession = useAction(api.stripe.checkout.subscription);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      if (!!user) {
        const session = await startCheckoutSession({
          customer_email: user?.primaryEmailAddress?.emailAddress!,
          workspace: name,
          user_id: user.id,
          plan,
        });

        if (!!session && !!session.url) {
          window.open(session.url, "_self");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <Card className="w-2/3 px-6 pb-6 pt-4 grid grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4">
            <Badge
              className={cn(
                "w-10 h-10 flex justify-center items-center bg-black",
              )}
            >
              {step === Step.Workspace ? "1" : "✓"}
            </Badge>
            <Heading
              title="Step 1"
              description="Workspace name"
              className="[&_p]:mt-0"
            />
          </div>

          <div className="flex flex-row items-center gap-4">
            <Badge
              className={cn(
                "w-10 h-10 flex justify-center items-center bg-gray-400",
                {
                  "bg-black": step === Step.Plan || step === Step.Summary,
                },
              )}
            >
              {step === Step.Summary ? "✓" : "2"}
            </Badge>
            <Heading
              title="Step 2"
              description="Setup your billing plan"
              className="[&_p]:mt-0"
            />
          </div>

          <div className="flex flex-row items-center gap-4">
            <Badge
              className={cn(
                "w-10 h-10 flex justify-center items-center bg-gray-400",
                {
                  "bg-black": step === Step.Summary,
                },
              )}
            >
              3
            </Badge>
            <Heading
              title="Step 3"
              description="Summary"
              className="[&_p]:mt-0"
            />
          </div>
        </div>
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {(() => {
            switch (step) {
              case Step.Workspace: {
                return (
                  <Input
                    value={name}
                    label="Workspace name"
                    description="This should match the name of your organization or team. You can change it later."
                    name="workspace"
                    placeholder="Acme"
                    onChange={(e) => setName(e.target.value)}
                    validations={{
                      valueMissing: "Please enter a workspace name",
                    }}
                  />
                );
              }
              case Step.Plan: {
                return (
                  <RadioGroup.Root
                    className="grid grid-cols-2 gap-2"
                    defaultValue={plan}
                    onValueChange={(value) => setPlan(value as "free" | "pro")}
                  >
                    <article className="flex flex-col gap-4">
                      <Heading
                        title="Free"
                        description="Get started with the basics"
                      />
                      <RadioGroup.Item value="free" asChild>
                        <Button
                          variant="outline"
                          className="w-full data-[state=checked]:bg-black data-[state=checked]:text-white"
                        >
                          Chose
                        </Button>
                      </RadioGroup.Item>
                    </article>
                    <article className="flex flex-col gap-4">
                      <Heading title="Pro" description="Unlock more features" />
                      <RadioGroup.Item value="pro" asChild>
                        <Button
                          variant="outline"
                          className="w-full data-[state=checked]:bg-black data-[state=checked]:text-white"
                        >
                          Chose
                        </Button>
                      </RadioGroup.Item>
                    </article>
                  </RadioGroup.Root>
                );
              }
              case Step.Summary: {
                return (
                  <>
                    <Heading
                      title="Summary"
                      description="Please confirm your details"
                    />
                    <Paragraph>
                      <strong>Workspace name: </strong>
                      {name}
                      <br />
                      <strong>Plan: </strong>
                      {plan}
                    </Paragraph>
                  </>
                );
              }
              default: {
                return null;
              }
            }
          })()}

          <footer className="mt-auto ml-auto flex flex-row justify-end gap-2">
            {step !== Step.Workspace && (
              <Button
                variant="outline"
                className="w-28"
                onClick={() =>
                  setStep((curr) => {
                    switch (curr) {
                      case Step.Plan:
                        return Step.Workspace;
                      case Step.Summary:
                        return Step.Plan;
                      default:
                        return curr;
                    }
                  })
                }
              >
                Previous
              </Button>
            )}
            <Button
              loading={isLoading}
              className="w-28"
              type="submit"
              onClick={(e) =>
                setStep((curr) => {
                  switch (curr) {
                    case Step.Workspace: {
                      e.preventDefault();
                      return Step.Plan;
                    }
                    case Step.Plan: {
                      e.preventDefault();
                      return Step.Summary;
                    }
                    default:
                      return curr;
                  }
                })
              }
            >
              {step === Step.Summary ? "Confirm" : "Next"}
            </Button>
          </footer>
        </Form>
      </Card>
    </main>
  );
}
