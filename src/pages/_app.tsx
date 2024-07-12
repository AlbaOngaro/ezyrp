import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Toaster } from "components/atoms/sonner";

import "reactflow/dist/base.css";
import "styles/globals.css";

import { UserProvider } from "providers/user";
import { OrganisationProvider } from "providers/organisation";
import { ConvexCacheProvider } from "providers/convex-cache";
import { convex } from "lib/external/convex";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <Head>
        <title>Ezyrp</title>
      </Head>

      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ConvexCacheProvider>
          <UserProvider>
            <OrganisationProvider>
              {getLayout(<Component {...pageProps} />)}
              <Toaster
                expand={false}
                toastOptions={{
                  unstyled: true,
                  classNames: {
                    toast:
                      "bg-white w-full border border-gray-100 grid grid-cols-2 gap-y-0 px-4 py-2 rounded-md shadow-md",
                    title:
                      "col-start-1 row-start-1 text-black font-bold text-sm",
                    content: "col-start-1 row-span-2 text-black",
                    description: "col-start-1 row-start-2 text-black text-sm",
                    actionButton:
                      "text-sm col-start-2 col-end-2 row-start-1 border-none text-right bg-transparent p-0 hover:underline",
                    cancelButton:
                      "text-sm col-start-2 col-end-2 bg-transparent border-none text-right row-start-2 p-0 hover:underline",
                  },
                }}
              />
            </OrganisationProvider>
          </UserProvider>
        </ConvexCacheProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
