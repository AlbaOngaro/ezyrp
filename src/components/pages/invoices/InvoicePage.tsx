import { ReactElement } from "react";
import { format } from "date-fns";
import Link from "next/link";
import {
  CaretLeftIcon,
  FileTextIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";

import { useRouter } from "next/router";

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useQuery } from "convex-helpers/react";
import { useInvoices } from "hooks/useInvoices";
import { CHF } from "lib/formatters/chf";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container/Container";
import { Badge } from "components/atoms/badge/Badge";
import { Button } from "components/atoms/button/Button";
import { Card } from "components/atoms/card/Card";

import { Dialog } from "components/atoms/dialog/Dialog";
import { getBadgeVariantFromStatus } from "lib/utils/getBadgeVariantFromStatus";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

type Props = {
  id: Id<"invoices">;
};

export function InvoicePage({ id }: Props) {
  const router = useRouter();
  const invoices = useInvoices();
  const { data: invoice, status } = useQuery(api.invoices.get, {
    id,
  });

  if (status === "pending" || !invoice) {
    return null;
  }

  return (
    <Container
      as="section"
      className="max-w-4xl py-10 flex flex-col gap-6 print:h-full"
    >
      <Link
        href="/invoices"
        className="inline-flex items-center font-bold gap-2 opacity-100 transition-opacity duration-300 hover:opacity-75 print:hidden"
      >
        <CaretLeftIcon /> Go back
      </Link>

      <Card className="p-6 flex items-center gap-2 print:hidden">
        <strong className="text-sm text-gray-800">Status</strong>
        <Badge size="lg" variant={getBadgeVariantFromStatus(invoice.status)}>
          {invoice.status}
        </Badge>

        <Button title="Edit" size="lg" shape="circle" className="ml-auto">
          <Pencil1Icon />
        </Button>

        <DialogRoot>
          <DialogTrigger>
            <Button title="Delete" size="lg" shape="circle" variant="danger">
              <TrashIcon />
            </Button>
          </DialogTrigger>

          <Dialog
            title="Do you really want to delete this invoice?"
            description="This action cannot be undone!"
            onConfirm={() =>
              invoices
                .delete({
                  id: invoice._id,
                })
                .then(() => router.push("/invoices"))
            }
          />
        </DialogRoot>

        <Button
          title="Print"
          size="lg"
          variant="tertiary"
          shape="circle"
          onClick={() => window.print()}
        >
          <FileTextIcon />
        </Button>
      </Card>

      <Card className="p-6 flex flex-col gap-6 print:h-full">
        <header className="w-full flex flex-row justify-between items-center">
          <div>
            <h3 className="text-gray-800 text-lg font-bold mb-2">
              {invoice?._id}
            </h3>
            <p className="text-gray-500 text-base font-normal">
              {invoice?.description}
            </p>
          </div>

          {/* <p className="text-gray-500 text-base font-normal text-right">
            {user.data?.user?.profile?.address} <br />
            {user.data?.user?.profile?.code} {user.data?.user?.profile?.city}
            <br />
            {user.data?.user?.profile?.country}
          </p> */}
        </header>

        <section className="grid grid-cols-3 items-start print:grid-cols-2">
          <p className="mb-2 inline-flex flex-col text-gray-600">
            <strong className="text-gray-800 mt-2">Emitted on</strong>
            {format(new Date(invoice.emitted), "dd MMM yyyy")}

            <strong className="text-gray-800 mt-2">Invoice due</strong>
            {format(new Date(invoice.due), "dd MMM yyyy")}
          </p>

          <p className="mb-2 inline-flex flex-col text-gray-600 print:text-right">
            <strong className="text-gray-800">Bill to</strong>
            {invoice.customer.name}
          </p>

          <p className="mb-2 inline-flex flex-col text-gray-600 print:hidden">
            <strong className="text-gray-800">Sent to</strong>
            {invoice.customer.name}
          </p>
        </section>

        <Card className="bg-gray-100 p-6">
          <dl className="flex flex-col gap-2">
            <dt className="grid grid-cols-4 text-gray-800 mb-2">
              <strong>Name</strong>
              <strong className="text-center">Qty.</strong>
              <strong className="text-right">Price</strong>
              <strong className="text-right">Total</strong>
            </dt>
            {invoice.items?.map((item) => (
              <dd key={item.name} className="grid grid-cols-4 text-gray-800">
                <span>{item.name}</span>
                <span className="text-center">{item.quantity}</span>
                <span className="text-right">
                  {CHF.format(item.price / 100)}
                </span>
                <span className="text-right">
                  {CHF.format((item.price / 100) * item.quantity)}
                </span>
              </dd>
            ))}
          </dl>

          <footer className="-ml-6 -mb-6 mt-6 w-[calc(100%_+_3rem)] p-6 rounded-b-md flex justify-between bg-gray-800 text-white">
            <strong>Amount due</strong>
            <span>{CHF.format(invoice.amount / 100)}</span>
          </footer>
        </Card>
      </Card>
    </Container>
  );
}

InvoicePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout isSidebarOpen={false}>{page}</SidebarLayout>;
};

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const id = (
    Array.isArray(query.id) ? query.id[0] : query.id
  ) as Id<"invoices">;

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id,
    },
  };
}
