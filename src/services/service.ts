export abstract class Service {
  protected token: string;

  constructor(token: string) {
    this.token = token;
  }
}
