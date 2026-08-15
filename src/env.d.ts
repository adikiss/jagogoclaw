/// <reference types="astro/client" />

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta?: unknown;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query?: string): Promise<unknown>;
}

declare namespace App {
  interface Locals {
    participantId?: number;
    runtime?: {
      env: {
        DB?: D1Database;
        ADMIN_PASSWORD?: string;
        SESSION_SECRET?: string;
        [key: string]: string | D1Database | undefined;
      };
      ctx?: ExecutionContext;
    };
  }
}
