import { Config } from "./types";

/**
 * Function loading application configuration from .env file
 * @return Config
 */
export function getConfig(): Config {
  const host = process.env.HOST as string;
  const path = process.env.HOSTPATH as string;
  const port = parseInt(process.env.PORT as string);

  if (!host || !path || !port) {
    throw new Error("Incorrect config!");
  }

  return {
    host,
    path,
    port,
  };
}
