import { EventSpecification } from "@trigger.dev/sdk";

type OnDeployEvent = {
  type: string;
  timestamp: string;
  project: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
  };
  environment: {
    id: string;
    name: string;
  };
  deployment: {
    id: string;
    creator: {
      id: string;
      name: string;
      avatar: string;
    };
    meta: Record<string, unknown>;
  };
};

export const onDeploy: EventSpecification<OnDeployEvent> = {
  name: "DEPLOY",
  title: "On deploy",
  source: "railway.app",
  icon: "railway",
  examples: [
    {
			id: "aasdfasdf",
			name: "deploy",
			payload: {
				type: "DEPLOY",
				timestamp: "2023-10-24T14:52:10.150Z",
				project: {
					id: "ad2b770f-13b8-4108-9804-b4f1f086f0f9",
					name: "nimblerp",
					description: "",
					createdAt: "2023-09-19T19:38:46.369Z",
				},
				environment: {
					id: "1795add9-53fb-4b20-b77e-372270db0e88",
					name: "production",
				},
				deployment: {
					id: "ad2b770f-13b8-4108-9804-b4f1f086f0f9",
					creator: {
						id: "c015e593-1268-4e64-ad10-44afe5b90025",
						name: "Alba Ongaro",
						avatar: "https://avatars.githubusercontent.com/u/23448537?v=4",
					},
					meta: {},
				},
			},
		}
  ],
  parsePayload: (payload) => payload as OnDeployEvent,
  runProperties: (payload) => [{ label: "Deployment ID", text: payload.deployment.id }],
};
