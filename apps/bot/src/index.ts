// How does Node still not load .env files by default.
import "dotenv/config.js";

import { createKyselyClient } from "@deps/db";

import { env } from "./env.js";
import { sleep } from "#utils/index.js";

import Rhenium from "#structures/Rhenium.js";

/** Primary discord.js client instance. */
export const client = new Rhenium();

/** Primary Kysely client instance. */
export const kysely = createKyselyClient(env.PG_URL);

/** Main entry point for the program. */
async function main(): Promise<void> {
	// Cache commands.
	await client.cacheCommands();

	// Mount event listeners.
	await client.mountEventListeners();

	// Connect to the gateway.
	await client.login(env.CLIENT_TOKEN);

	// Wait 2 seconds then register application commands.
	await sleep(2000);
	await client.registerApplicationCommands();
}

void main();
