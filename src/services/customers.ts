import { Customer } from "lib/types";

import { surreal } from "lib/surreal";

export class CustomersService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async create(customer: Omit<Customer, "id">): Promise<Customer> {
    await surreal.authenticate(this.token);

    const result = await surreal.create<Omit<Customer, "id">>(
      "customer",
      customer,
    );

    return result[0];
  }

  async read(id: Customer["id"]): Promise<Customer> {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Customer>(id);
    return result[0];
  }

  async list(): Promise<Customer[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Customer>("customer");
    return result;
  }

  async update(id: Customer["id"], data: Partial<Customer>): Promise<Customer> {
    await surreal.authenticate(this.token);

    const result = await surreal.merge<Customer>(id, data);
    return result[0];
  }

  async delete(id: Customer["id"]): Promise<void> {
    await surreal.authenticate(this.token);

    await surreal.delete(id);
    return;
  }
}
