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
              <Toaster />
            </OrganisationProvider>
          </UserProvider>
        </ConvexCacheProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
