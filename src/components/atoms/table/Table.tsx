import { useCustomers } from "hooks/useCustomers";
import { Customer } from "lib/types";
import { twMerge } from "lib/utils/twMerge";

interface Props {
  className?: string;
  people: Customer[];
}

export function Table({ className, people }: Props) {
  const { mutate } = useCustomers();

  return (
    <div className={twMerge("mt-8 flow-root", className)}>
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, personIdx) => (
                <tr key={person.email}>
                  <td
                    className={twMerge(
                      personIdx !== people.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8",
                    )}
                  >
                    {person.name}
                  </td>
                  <td
                    className={twMerge(
                      "whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell",
                      {
                        "border-b border-gray-200":
                          personIdx !== people.length - 1,
                      },
                    )}
                  >
                    {person.phone}
                  </td>
                  <td
                    className={twMerge(
                      "whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell",
                      {
                        "border-b border-gray-200":
                          personIdx !== people.length - 1,
                      },
                    )}
                  >
                    {person.email}
                  </td>
                  <td
                    className={twMerge(
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                      {
                        "border-b border-gray-200":
                          personIdx !== people.length - 1,
                      },
                    )}
                  >
                    {person.email}
                  </td>
                  <td
                    className={twMerge(
                      personIdx !== people.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8",
                    )}
                  >
                    <button
                      onClick={() =>
                        mutate(async () => {
                          await fetch(`/api/customers/${person.id}`, {
                            method: "PATCH",
                            headers: {
                              "content-type": "application/json",
                            },
                            body: JSON.stringify({
                              name: "Amina Piatti",
                            }),
                          });
                        })
                      }
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit<span className="sr-only">, {person.name}</span>
                    </button>

                    <button
                      onClick={() =>
                        mutate(async () => {
                          await fetch(`/api/customers/${person.id}`, {
                            method: "DELETE",
                            headers: {
                              "content-type": "application/json",
                            },
                          });
                        })
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete<span className="sr-only">, {person.name}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
