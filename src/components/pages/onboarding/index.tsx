import { useUser } from "@clerk/clerk-react";
import { Form } from "@radix-ui/react-form";
import { useState } from "react";
import { useAction } from "convex/react";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";

import { FormValue, Step } from "./types";
import { WorkspaceStep } from "./steps/workspace";
import { PlanStep } from "./steps/plan";
import { SummaryStep } from "./steps/summary";
import { TeamMembersStep } from "./steps/team-members";
import { STEPS } from "./constants";
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
      teamMembers: [],
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
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={cn("flex flex-row items-start gap-3", {
                "opacity-50": step !== i,
              })}
            >
              <Badge
                className={cn("w-8 h-8 p-0 flex justify-center items-center", {
                  "bg-black": step >= i,
                })}
              >
                {step > i ? "✓" : i + 1}
              </Badge>
              <Heading
                title={s.title}
                description={s.description}
                className="[&_p]:mt-0"
              />
            </div>
          ))}
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
                case Step.TeamMembers: {
                  return <TeamMembersStep />;
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
                      return Step.TeamMembers;
                    }
                    case Step.TeamMembers: {
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
            {STEPS.map((s, i) => (
              <li
                key={s.key}
                className={cn(
                  "w-2 h-2 transition-all rounded-full bg-gray-300 block hover:bg-gray-400 hover:cursor-pointer",
                  {
                    "w-6 bg-blue-600 hover:bg-blue-600": step === i,
                  },
                )}
                onClick={() => setStep(i)}
              />
            ))}
          </ul>
        </nav>
      </section>
    </main>
  );
}
