import { Country, QueryResolvers } from "../../../../__generated__/server";

export const countries: QueryResolvers["countries"] = async () => {
  return fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((countries: Country[]) =>
      countries.sort((a, b) => a.name.common.localeCompare(b.name.common)),
    );
};
