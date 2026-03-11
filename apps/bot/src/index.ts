// How does Node still not load .env files by default.
import "dotenv/config.js";

import { env } from "./env.js";

import Rhenium from "#structures/Rhenium.js";

/** Primary discord.js client instance. */
export const client = new Rhenium();

/** Main entry point for the program. */
async function main(): Promise<void> {
	// Mount event listeners.
	await client.mountEventListeners();

	// Connect to the gateway.
	await client.login(env.CLIENT_TOKEN);
}

void main();
