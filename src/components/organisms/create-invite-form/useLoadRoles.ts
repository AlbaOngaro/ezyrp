import { useOrganization } from "@clerk/clerk-react";
import { OrganizationCustomRoleKey } from "@clerk/types";

import { useEffect, useState } from "react";

type Option = {
  value: OrganizationCustomRoleKey;
  label: string;
};

export function useLoadRoles() {
  const { organization } = useOrganization();
  const [options, setOptions] = useState<Option[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (organization && !isLoading && !options?.length) {
      setIsLoading(true);

      organization
        .getRoles({
          pageSize: 20,
          initialPage: 1,
        })
        .then((res) => {
          setOptions(
            res.data.map((roles) => ({
              value: roles.key,
              label: roles.name,
            })),
          );
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  return options;
}
