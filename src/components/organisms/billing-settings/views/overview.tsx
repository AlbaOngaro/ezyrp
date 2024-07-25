import { useAction } from "convex/react";
import { Dispatch, SetStateAction, useState } from "react";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

import { View } from "../types";

import { api } from "convex/_generated/api";
import { Skeleton } from "components/atoms/skeleton";
import { Card } from "components/atoms/card";
import { Button } from "components/atoms/button";
import { useGetStripeSubscriptions } from "hooks/useGetStripeSubscriptions";
import { dialogs } from "components/atoms/dialog";
import { CHF } from "lib/formatters/chf";

type Props = {
  view: Extract<View, { type: "overview" }>;
  setView: Dispatch<SetStateAction<View>>;
};

export function BillingOverviewView({ setView }: Props) {
  const { data, loading, refetch } = useGetStripeSubscriptions();

  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const updatePaymentMethod = useAction(api.stripe.checkout.session);

  const [isCancellingSubscription, setIsCancellingSubscription] =
    useState(false);
  const cancelSubscription = useAction(api.stripe.subscriptions.cancel);

  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="flex flex-col gap-4">
          {data?.data.map((subscription) => {
            switch (subscription.status) {
              case "active": {
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
                            subscription.items.data[0].plan.amount / 100,
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
                              customer: subscription.customer,
                              subscription_id: subscription.id,
                            });

                            window.open(session.url, "_self");
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

                      <Button
                        disabled={isCancellingSubscription}
                        variant="link"
                        className="text-left text-red-400 justify-start py-0 h-6 w-full"
                        onClick={() =>
                          dialogs.warning({
                            title:
                              "Do you really want to cancel your subscription?",
                            description:
                              "You'll be able to resume it later, if you change your mind",
                            onConfirm: async () => {
                              try {
                                setIsCancellingSubscription(true);

                                await cancelSubscription({
                                  subscription_id: subscription.id,
                                });

                                await refetch();
                              } catch (error) {
                                console.error(error);
                              } finally {
                                setIsCancellingSubscription(false);
                              }
                            },
                          })
                        }
                      >
                        Cancel Subscription
                      </Button>
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
