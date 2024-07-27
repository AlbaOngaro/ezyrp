import { useUser } from "@clerk/clerk-react";
import { Form } from "@radix-ui/react-form";
import { useState } from "react";
import { useAction } from "convex/react";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";

import { FormValue, Step } from "./types";
import { WorkspaceStep } from "./steps/workspace";
import { PlanStep } from "./steps/plan";
import { SummaryStep } from "./steps/summary";
import { Button } from "components/atoms/button";
import { api } from "convex/_generated/api";
import { Heading } from "components/atoms/heading";
import { Badge } from "components/atoms/badge";
import { cn } from "lib/utils/cn";

export function OnboardingPage() {
  const [step, setStep] = useState<Step>(Step.Workspace);

  const { handleSubmit, formState, ...methods } = useForm<FormValue>({
    defaultValues: {
      name: "",
      plan: "free",
    },
  });

  const { user } = useUser();

  const startCheckoutSession = useAction(api.stripe.checkout.subscription);

  const handleSubmitWrapper: UseFormHandleSubmit<FormValue> = (
    _onSuccess,
    _onError,
  ) =>
    handleSubmit(async ({ name, plan }) => {
      try {
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
      }
    });

  return (
    <main className="w-screen h-screen grid grid-cols-4">
      <aside className="bg-gray-100 h-full p-4">
        <span className="flex items-center gap-2 font-semibold text-xl mb-20">
          <img src="/images/logo.svg" className="h-10 w-10" alt="logo" />
          Ezyrp
        </span>

        <div className="flex flex-col gap-6">
          <div
            className={cn("flex flex-row items-start gap-3", {
              "opacity-50": step !== Step.Workspace,
            })}
          >
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

          <div
            className={cn("flex flex-row items-start gap-3", {
              "opacity-50": step !== Step.Plan,
            })}
          >
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

          <div
            className={cn("flex flex-row items-start gap-3", {
              "opacity-50": step !== Step.Summary,
            })}
          >
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
        <FormProvider
          {...methods}
          handleSubmit={handleSubmitWrapper}
          formState={formState}
        >
          <Form
            className="flex flex-col gap-4 w-full max-w-[400px] self-center justify-self-center"
            onSubmit={handleSubmitWrapper(console.debug, console.error)}
          >
            {(() => {
              switch (step) {
                case Step.Workspace: {
                  return <WorkspaceStep />;
                }
                case Step.Plan: {
                  return <PlanStep />;
                }
                case Step.Summary: {
                  return <SummaryStep />;
                }
                default: {
                  return null;
                }
              }
            })()}

            <Button
              loading={formState.isSubmitting}
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
              disabled={!formState.isValid}
            >
              {step === Step.Summary ? "Confirm" : "Continue"}
            </Button>
          </Form>
        </FormProvider>

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
