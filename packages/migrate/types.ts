export type Profile = {
  migrations: string;
  surreal_host: string;
  surreal_user: string;
  surreal_password: string;
};

export type Config = Record<string, Profile>;
