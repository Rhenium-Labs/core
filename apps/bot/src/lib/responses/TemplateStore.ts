import type { ResponseKey } from "./Template.js";

/**
 * Stub in-memory template store — swap this out for a real DB query later.
 * Values are raw JSON and may contain ${variable} placeholders.
 */
const templates = new Map<ResponseKey, unknown>([
	[
		"ping_success",
		{
			content: "Pong! Roundtrip took: ${roundtrip}ms. Heartbeat: ${heartbeat}ms."
		}
	]
]);

export function fetchTemplate(key: ResponseKey): unknown | undefined {
	return templates.get(key);
}
