import { Pool, QueryResult, QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function buildPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. See .env.example — for local dev the Next.js " +
        "app connects to the Docker Postgres on host port 5455."
    );
  }
  return new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

export const pool: Pool = global.__pgPool ?? buildPool();
if (process.env.NODE_ENV !== "production") global.__pgPool = pool;

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: ReadonlyArray<unknown>
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params as unknown[]);
}
