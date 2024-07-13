import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { fetchQuery } from "convex/nextjs";
import { jwtDecode } from "jwt-decode";
import { clerkClient } from "@clerk/nextjs/server";

import { Props } from "./SchedulePage";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";

type ClerkSession = {
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
  sid: string;
  sub: string;
};

export async function getServerSideProps({
  query,
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  if (!req.cookies.__session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const eid = Array.isArray(query.eid) ? query.eid[0] : query.eid;
  if (!eid) {
    return {
      props: {
        selected: null,
      },
    };
  }

  try {
    const { sid } = jwtDecode<ClerkSession>(req.cookies.__session);
    const { jwt: token } = await clerkClient.sessions.getToken(sid, "convex");

    const preloaded = await fetchQuery(
      api.events.get,
      {
        id: eid as Id<"events">,
      },
      {
        token,
      },
    );

    return {
      props: {
        selected: preloaded.start,
      },
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      props: {
        selected: null,
      },
    };
  }
}
