import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Since the bot is just a single server app, we can just put all of our environment variables in the `server` section. The `client` section is meant for environment variables that are exposed to the client, which we don't have in this case.
	 */
	server: {
		CLIENT_TOKEN: z.string().nonempty(),
		PG_URL: z.string().nonempty()
	},

	/**
	 * The `client` section is meant for environment variables that are exposed to the client, which we don't have in this case. We still need to define it, but we can just leave it as an empty object.
	 */
	client: {},

	/**
	 * The prefix for environment variables that are exposed to the client. Since we don't have any client environment variables, we can just set this to something that won't conflict with our server environment variables.
	 */
	clientPrefix: "PUBLIC_",

	/**
	 * What object holds the environment variables at runtime.
	 * In a Node.js environment, this is typically `process.env`.
	 */
	runtimeEnv: process.env,

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 */
	emptyStringAsUndefined: true
});
