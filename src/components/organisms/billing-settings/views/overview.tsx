import { useAction } from "convex/react";
import { Dispatch, SetStateAction, useState } from "react";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Stripe from "stripe";
import { get } from "lodash";

import { View } from "../types";

import { api } from "convex/_generated/api";
import { Skeleton } from "components/atoms/skeleton";
import { Card } from "components/atoms/card";
import { Button } from "components/atoms/button";
import { useGetStripeSubscriptions } from "hooks/useGetStripeSubscriptions";
import { CHF } from "lib/formatters/chf";
import { dialogs } from "components/atoms/dialog";

type Props = {
  view: Extract<View, { type: "overview" }>;
  setView: Dispatch<SetStateAction<View>>;
};

type UpdatePlanArgs = {
  subscription_id: string;
  subscription_item_id: string;
};

export function BillingOverviewView({ setView }: Props) {
  const { data, loading, refetch } = useGetStripeSubscriptions();

  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const updatePaymentMethod = useAction(api.stripe.checkout.setup);

  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const updatePlan = useAction(api.stripe.subscriptions.update);

  const updateToFreePlan = async ({
    subscription_id,
    subscription_item_id,
  }: UpdatePlanArgs) => {
    try {
      setIsUpdatingPlan(true);
      await updatePlan({
        plan: "free",
        subscription_id,
        subscription_item_id,
      });

      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  const updateToProPlan = async ({
    subscription_id,
    subscription_item_id,
  }: UpdatePlanArgs) => {
    try {
      setIsUpdatingPlan(true);
      await updatePlan({
        plan: "pro",
        subscription_id,
        subscription_item_id,
      });

      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="flex flex-col gap-4">
          {data?.data.map((subscription) => {
            switch (subscription.status) {
              case "active": {
                const { plan } = subscription as Stripe.Subscription & {
                  plan?: Stripe.Plan;
                };

                const subscription_id = subscription.id;
                const subscription_item_id = subscription.items?.data?.[0]?.id;
                const nickname = plan?.nickname;

                console.log(subscription?.items?.data);

                return (
                  <Card
                    key={subscription.id}
                    className="p-4 grid grid-cols-2 gap-2"
                  >
                    <div className="border-r border-solid border-gray-200">
                      <strong className="mb-2 inline-block">
                        Your next payment
                      </strong>
                      <p className="inline-flex items-end gap-2">
                        <strong className="text-2xl">
                          {CHF.format(
                            get(subscription, "items.data[0].plan.amount", 0) /
                              100,
                          )}
                        </strong>
                        <span className="text-muted-foreground">
                          Due by{" "}
                          {format(
                            subscription.current_period_end * 1000,
                            "MMM dd, yyyy",
                          )}
                        </span>
                      </p>
                    </div>

                    <div className="self-center">
                      <Button
                        disabled={isLoadingSession}
                        variant="link"
                        className="text-left justify-start py-0 h-6 w-full"
                        onClick={async () => {
                          try {
                            setIsLoadingSession(true);
                            const session = await updatePaymentMethod({
                              customer: subscription.customer as string,
                              subscription_id: subscription.id,
                            });

                            if (session && session.url) {
                              window.open(session.url, "_self");
                            }
                          } catch (error) {
                            console.error(error);
                          } finally {
                            setIsLoadingSession(false);
                          }
                        }}
                      >
                        Update payment information{" "}
                        <ArrowRight className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="link"
                        className="text-left justify-start py-0 h-6 w-full"
                        onClick={() =>
                          setView({
                            type: "invoices-list",
                            data: {
                              subscription_id: subscription.id,
                            },
                          })
                        }
                      >
                        View payment history
                      </Button>

                      {(() => {
                        switch (nickname) {
                          case "pro": {
                            return (
                              <Button
                                loading={isUpdatingPlan}
                                variant="link"
                                className="text-left text-red-400 justify-start py-0 h-6 w-full"
                                onClick={() =>
                                  dialogs.warning({
                                    title:
                                      "Are you sure you want to downgrade to the free plan?",
                                    description:
                                      "You will lose access to all the features of the Pro plan.",
                                    onConfirm: () =>
                                      updateToFreePlan({
                                        subscription_id,
                                        subscription_item_id,
                                      }),
                                  })
                                }
                              >
                                Downgrade to Free
                              </Button>
                            );
                          }
                          case "free": {
                            return (
                              <Button
                                loading={isUpdatingPlan}
                                variant="link"
                                className="text-left justify-start py-0 h-6 w-full"
                                onClick={() =>
                                  updateToProPlan({
                                    subscription_id,
                                    subscription_item_id,
                                  })
                                }
                              >
                                Upgrade to Pro
                              </Button>
                            );
                          }
                          default:
                            return null;
                        }
                      })()}
                    </div>
                  </Card>
                );
              }
              default: {
                return null;
              }
            }
          })}
        </div>
      )}
    </>
  );
}
