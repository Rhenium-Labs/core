import { PostgresJSDialect } from "kysely-postgres-js";
import { Kysely, type KyselyPlugin } from "kysely";

import postgres from "postgres";

import type { DB } from "./Schema.js";

/**
 * Creates a new kysely client instance connected to the given PostgreSQL URL.
 *
 * @param url The PostgreSQL connection URL.
 * @param plugins An array of Kysely plugins to use with the client.
 * @return A new Kysely client instance.
 */
export function createKyselyClient(url: string, plugins: KyselyPlugin[] = []): Kysely<DB> {
	return new Kysely<DB>({
		dialect: new PostgresJSDialect({ postgres: postgres(url) }),
		plugins
	});
}
