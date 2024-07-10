const config = {
  providers: [
    {
      domain: process.env.NEXT_PUBLIC_CLERK_ISSUER,
      applicationID: "convex",
    },
  ],
};

export default config;
