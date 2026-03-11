import type { APIEmbed } from "discord.js";

import { MESSAGE_RESPONSE_SCHEMA } from "./Schema.js";
import type { ResponseKey, ResponseProps } from "./Template.js";

type Props = Record<string, string | null | undefined>;

/** Recursively walks a raw JSON value and interpolates ${key} in all strings. */
function deepInterpolate(value: unknown, props: Props): unknown {
	if (typeof value === "string")
		return value.replace(/\$\{(\w+)\}/g, (_, key: string) => props[key] ?? "");

	if (Array.isArray(value)) return value.map(item => deepInterpolate(item, props));

	if (typeof value === "object" && value !== null)
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>).map(([k, v]) => [
				k,
				deepInterpolate(v, props)
			])
		);

	return value;
}

/** A Discord.js-compatible message payload. */
export interface ResolvedMessage {
	content?: string;
	embeds?: APIEmbed[];
}

/**
 * Takes a raw message template from the database, interpolates all ${key}
 * placeholders with the command's props, validates the result, and returns
 * a Discord.js-compatible message payload.
 *
 * Fields with `remove_when_empty: true` are dropped if they resolve to "".
 *
 * @throws {ZodError} if the interpolated template fails schema validation.
 */
export function resolveResponse<TKey extends ResponseKey>(
	rawTemplate: unknown,
	props: ResponseProps<TKey>
): ResolvedMessage {
	const interpolated = deepInterpolate(rawTemplate, props as Props);
	const parsed = MESSAGE_RESPONSE_SCHEMA.parse(interpolated);

	const embeds = parsed.embeds?.map(embed => {
		const fields = embed.fields
			?.filter(field => !field.remove_when_empty || field.value !== "")
			.map(({ remove_when_empty: _, ...rest }) => rest);

		return { ...embed, fields } satisfies APIEmbed;
	});

	return { content: parsed.content, embeds };
}
