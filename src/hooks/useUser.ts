import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { LOGIN } from "lib/mutations/LOGIN";
import { LOGOUT } from "lib/mutations/LOGOUT";
import { REGISTER } from "lib/mutations/REGISTER";
import { UPDATE_USER_PROFILE } from "lib/mutations/UPDATE_USER_PROFILE";
import { USER } from "lib/queries/USER";

export function useUser() {
  const router = useRouter();

  const { data, error, loading: isLoading } = useQuery(USER);
  const [login] = useMutation(LOGIN, {
    onCompleted: () => router.push("/"),
  });
  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => router.push("/login"),
  });
  const [register] = useMutation(REGISTER);

  const [update] = useMutation(UPDATE_USER_PROFILE);

  return {
    data,
    error,
    isLoading,
    login,
    logout,
    register,
    update,
  };
}
