import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { useOrganization } from "@clerk/clerk-react";
import { forwardRef, useState } from "react";
import { toast } from "sonner";

import { useAction } from "convex/react";
import { InviteMemberFormValue } from "./types";

import { Container } from "components/atoms/container";
import { Button } from "components/atoms/button";
import { Heading } from "components/atoms/heading";
import { Modal, ModalRoot } from "components/atoms/modal";
import { Loader } from "components/atoms/loader";
import { Card } from "components/atoms/card";
import { Table } from "components/atoms/table";
import { Badge } from "components/atoms/badge";
import { Avatar } from "components/atoms/avatar";
import { dialogs } from "components/atoms/dialog";

import { CreateInviteForm } from "components/organisms/create-invite-form/CreateInviteForm";

import { api } from "convex/_generated/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/atoms/tooltip";

export const TeamSettings = forwardRef<HTMLDivElement, unknown>(
  function TeamSettings(_, ref) {
    const [isLoading, setIsLoading] = useState(false);
    const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
    const { isLoaded, organization, invitations, memberships } =
      useOrganization({
        invitations: {
          pageSize: 5,
          keepPreviousData: true,
        },
        memberships: {
          pageSize: 5,
          keepPreviousData: true,
        },
      });

    const { handleSubmit, ...methods } = useForm<InviteMemberFormValue>({
      defaultValues: {
        email: "",
        role: "org:member",
      },
    });

    const invite = useAction(api.workspaces.invite);

    const handleSubmitWrapper: UseFormHandleSubmit<InviteMemberFormValue> = (
      onSucces,
      onError,
    ) =>
      handleSubmit(async ({ email, role }) => {
        if (!!organization) {
          try {
            await invite({
              email,
              role,
            });

            onSucces({ email, role });

            if (!!invitations && typeof invitations.revalidate === "function") {
              await invitations.revalidate();
            }
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast.error("Failed to invite member", {
                description: error.message,
              });
            } else {
              toast.error("Failed to invite member");
            }
          } finally {
            setIsInviteMemberOpen(false);
          }
        }
      }, onError);

    if (!isLoaded || !organization) {
      return (
        <main className="h-screen w-screen flex justify-center items-center">
          <Loader />
        </main>
      );
    }

    const members = [
      ...(memberships?.data || []).map((membership) => ({
        type: "member",
        _id: membership.id,
        role: membership.role,
        email: membership.publicUserData.identifier,
      })),
      ...(invitations?.data || []).map((invitation) => ({
        type: "invitation",
        role: invitation.role,
        _id: invitation.id,
        email: invitation.emailAddress,
      })),
    ];

    return (
      <>
        <Container
          as="section"
          className="py-10 sm:flex sm:items-center"
          ref={ref}
        >
          <Heading
            title="Team memebers"
            description="A list of all the team members who have been added to your workspace"
          />

          <ModalRoot open={isInviteMemberOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={members.length === 5}
                    onClick={() => setIsInviteMemberOpen(true)}
                    data-testid="settings-team__invite-button"
                  >
                    Invite team member
                  </Button>
                </TooltipTrigger>
                {members.length === 5 && (
                  <TooltipContent>
                    You can only invite up to 5 members
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <Modal>
              <FormProvider {...methods} handleSubmit={handleSubmitWrapper}>
                <CreateInviteForm />
              </FormProvider>
            </Modal>
          </ModalRoot>
        </Container>

        <Container as="section">
          <Card>
            <Table
              loading={isLoading}
              rows={members}
              withMultiSelect
              columns={[
                {
                  id: "email",
                  field: "email",
                  sortable: true,
                  headerName: "Email",
                  render: ({ email }) => (
                    <span className="flex flex-row items-center gap-4">
                      <Avatar className="block" seed={email} /> {email}
                    </span>
                  ),
                },
                {
                  id: "type",
                  field: "type",
                  headerName: "Type",
                  sortable: true,
                },
                {
                  id: "role",
                  field: "role",
                  headerName: "Role",
                  sortable: true,
                  render: ({ role }) => <Badge variant="outline">{role}</Badge>,
                },
              ]}
              contextMenuItems={[
                {
                  type: "item",
                  label: "Remove",
                  onClick: ({ type, _id }) =>
                    dialogs.warning({
                      title: `Do you really want to remove this ${type}?`,
                      description: "This action cannot be undone!",
                      onConfirm: async () => {
                        try {
                          setIsLoading(true);

                          switch (type) {
                            case "member": {
                              const membership = memberships?.data?.find(
                                (membership) => membership.id === _id,
                              );

                              if (!!membership) {
                                await membership.destroy();
                                if (memberships?.revalidate) {
                                  await memberships?.revalidate();
                                }
                              }
                              break;
                            }
                            case "invitation": {
                              const invitation = invitations?.data?.find(
                                (invitation) => invitation.id === _id,
                              );

                              if (!!invitation) {
                                await invitation.revoke();
                                if (invitations?.revalidate) {
                                  await invitations?.revalidate();
                                }
                              }
                              break;
                            }
                          }
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setIsLoading(false);
                        }
                      },
                    }),
                },
              ]}
            />
          </Card>
        </Container>
      </>
    );
  },
);
