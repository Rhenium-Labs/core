// How does Node still not load .env files by default.
import "dotenv/config.js";

import Rhenium from "#structures/Rhenium.js";

/** Primary discord.js client instance. */
export const client = new Rhenium();

/** Main entry point for the program. */
async function main(): Promise<void> {
	if (!process.env.CLIENT_TOKEN)
		throw new Error("The 'CLIENT_TOKEN' environment variable is not set.");

	// Mount event listeners.
	await client.mountEventListeners();

	// Connect to the gateway.
	await client.login(process.env.CLIENT_TOKEN);
}

void main();
