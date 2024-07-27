import { useUser } from "@clerk/clerk-react";
import { Form } from "@radix-ui/react-form";
import { FormEventHandler, useState } from "react";
import { useAction } from "convex/react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import { api } from "convex/_generated/api";
import { Heading } from "components/atoms/heading";
import { Badge } from "components/atoms/badge";
import { cn } from "lib/utils/cn";
import { Paragraph } from "components/atoms/typography";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/atoms/accordion";

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
    <main className="w-screen h-screen grid grid-cols-4">
      <aside className="bg-gray-100 h-full p-4">
        <span className="flex items-center gap-2 font-semibold text-xl mb-20">
          <img src="/images/logo.svg" className="h-10 w-10" alt="logo" />
          Ezyrp
        </span>

        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-start gap-3">
            <Badge
              className={cn(
                "w-8 h-8 p-0 flex justify-center items-center bg-black",
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

          <div className="flex flex-row items-start gap-3">
            <Badge
              className={cn(
                "w-8 h-8 p-0 flex justify-center items-center bg-gray-400",
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
              className={cn("[&_p]:mt-0", {
                "text-red-300": step < Step.Summary,
              })}
            />
          </div>

          <div className="flex flex-row items-start gap-3">
            <Badge
              className={cn(
                "w-8 h-8 p-0 flex justify-center items-center bg-gray-400",
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
      </aside>

      <section className="col-span-3 h-full grid grid-rows-[1fr_1rem] px-4 py-8">
        <Form
          className="flex flex-col gap-4 w-full max-w-[400px] self-center justify-self-center"
          onSubmit={handleSubmit}
        >
          {(() => {
            switch (step) {
              case Step.Workspace: {
                return (
                  <Input
                    value={name}
                    label="Workspace name"
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
                    className="grid gap-2"
                    defaultValue={plan}
                    onValueChange={(value) => setPlan(value as "free" | "pro")}
                  >
                    <Accordion type="single" collapsible defaultValue={plan}>
                      <AccordionItem value="free">
                        <AccordionTrigger className="font-semibold">
                          Free
                        </AccordionTrigger>
                        <AccordionContent>
                          <Paragraph className="mb-2">
                            Get started with the basic features:
                            <ul className="list-outside list-disc pl-4">
                              <li className="list-item">
                                Up to 5 team members
                              </li>
                              <li className="list-item">Unlimited customers</li>
                              <li className="list-item">
                                Inventory management
                              </li>
                              <li className="list-item">Invoices management</li>
                              <li className="list-item">Schedule management</li>
                              <li className="list-item">
                                Up to 5 custom event types
                              </li>
                            </ul>
                          </Paragraph>
                          <RadioGroup.Item value="free" asChild>
                            <Button
                              variant="outline"
                              className="w-full data-[state=checked]:bg-black data-[state=checked]:text-white"
                            >
                              Chose
                            </Button>
                          </RadioGroup.Item>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="pro">
                        <AccordionTrigger className="font-semibold">
                          Pro
                        </AccordionTrigger>
                        <AccordionContent>
                          <Paragraph className="mb-2">
                            Unlock all the features with the pro plan:
                            <ul className="list-outside list-disc pl-4">
                              <li className="list-item">
                                All free plan features
                              </li>
                              <li className="list-item">
                                Unlimited event types
                              </li>
                              <li className="list-item">
                                Custom email templates
                              </li>
                              <li className="list-item">Custom workflows</li>
                            </ul>
                          </Paragraph>
                          <RadioGroup.Item value="pro" asChild>
                            <Button
                              variant="outline"
                              className="w-full data-[state=checked]:bg-black data-[state=checked]:text-white"
                            >
                              Chose
                            </Button>
                          </RadioGroup.Item>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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

          <Button
            loading={isLoading}
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
            {step === Step.Summary ? "Confirm" : "Continue"}
          </Button>
        </Form>

        <nav>
          <ul className="flex flex-row gap-2 justify-center">
            <li
              className={cn(
                "w-2 h-2 transition-all rounded-full bg-gray-300 block hover:bg-gray-400 hover:cursor-pointer",
                {
                  "w-6 bg-blue-600 hover:bg-blue-600": step === Step.Workspace,
                },
              )}
              onClick={() => setStep(Step.Workspace)}
            />
            <li
              className={cn(
                "w-2 h-2 transition-all rounded-full bg-gray-300 block hover:bg-gray-400 hover:cursor-pointer",
                {
                  "w-6 bg-blue-600 hover:bg-blue-600": step === Step.Plan,
                },
              )}
              onClick={() => setStep(Step.Plan)}
            />
            <li
              className={cn(
                "w-2 h-2 transition-all rounded-full bg-gray-300 block hover:bg-gray-400 hover:cursor-pointer",
                {
                  "w-6 bg-blue-600 hover:bg-blue-600": step === Step.Summary,
                },
              )}
              onClick={() => setStep(Step.Summary)}
            />
          </ul>
        </nav>
      </section>
    </main>
  );
}
