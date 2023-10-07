import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { LOGIN } from "../lib/mutations/LOGIN";
import { LOGOUT } from "../lib/mutations/LOGOUT";
import { REGISTER } from "../lib/mutations/REGISTER";
import { UPDATE_USER_PROFILE } from "../lib/mutations/UPDATE_USER_PROFILE";
import { USER } from "../lib/queries/USER";
import { RESET_PASSWORD } from "lib/mutations/RESET_PASSWORD";
import { DELETE_ACCOUNT } from "lib/mutations/DELETE_ACCOUNT";

export function useUser() {
  const router = useRouter();

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery(USER, {
    errorPolicy: "ignore",
  });

  const [login] = useMutation(LOGIN, {
    onCompleted: () => router.push("/"),
  });
  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => router.push("/login"),
  });
  const [register] = useMutation(REGISTER, {
    onCompleted: () => router.push("/login"),
  });
  const [resetPassword] = useMutation(RESET_PASSWORD);

  const [update] = useMutation(UPDATE_USER_PROFILE, {
    refetchQueries: [USER],
  });

  const [deleteAccount] = useMutation(DELETE_ACCOUNT, {
    onCompleted: () => router.push("/register"),
  });

  return {
    data,
    error,
    isLoading,
    login,
    logout,
    register,
    update,
    resetPassword,
    delete: deleteAccount,
  };
}
