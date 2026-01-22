import { D1Database } from "@cloudflare/workers-types";

declare global {
  // This is the specific interface next-on-pages looks for
  interface CloudflareEnv {
    DB: D1Database;
  }
}
export {};
