import { z } from "zod";

// Accepts a valid URL or "" (from a failed ${var} interpolation) and coerces the latter to undefined.
const urlOrEmpty = z
	.url()
	.or(z.literal(""))
	.transform(v => v || undefined);

const embedFooterSchema = z.object({
	text: z.string().min(1).max(2048),
	icon_url: urlOrEmpty.optional()
});

const embedFieldSchema = z.object({
	name: z.string().min(1).max(256),
	value: z.string().min(1).max(1024),
	inline: z.boolean().default(false),
	/** Ommit the field from the embed if the contents end up an empty string. */
	remove_when_empty: z.boolean().default(false)
});

const embedAuthorSchema = z.object({
	name: z.string().min(1).max(256),
	url: urlOrEmpty.optional(),
	icon_url: urlOrEmpty.optional()
});

const embedMediaSchema = z
	.object({ url: urlOrEmpty })
	.transform((data): { url: string } | undefined => (data.url ? { url: data.url } : undefined));

export const CUSTOM_EMBED_SCHEMA = z
	.object({
		title: z.string().min(1).max(256).optional(),
		description: z.string().min(1).max(4096).optional(),
		url: urlOrEmpty.optional(),
		color: z.number().int().min(0).max(0xffffff).optional(),
		footer: embedFooterSchema.optional(),
		author: embedAuthorSchema.optional(),
		fields: z.array(embedFieldSchema).max(25).optional(),
		thumbnail: embedMediaSchema.optional(),
		image: embedMediaSchema.optional(),
		timestamp: z
			.string()
			.refine(
				value => {
					// Check if the string is a valid ISO 8601 timestamp.
					const date = new Date(value);
					return !isNaN(date.getTime());
				},
				{
					message: "Invalid ISO 8601 timestamp."
				}
			)
			.optional()
	})
	.superRefine((data, ctx) => {
		const hasContent =
			[
				data.title,
				data.description,
				data.url,
				data.footer,
				data.author,
				data.thumbnail,
				data.image,
				data.timestamp
			].some(Boolean) || !!data.fields?.length;

		if (!hasContent)
			ctx.addIssue({
				code: "custom",
				message: "At least one of the embed properties must be provided."
			});

		const titleLength = data.title?.length ?? 0;
		const descriptionLength = data.description?.length ?? 0;
		const footerTextLength = data.footer?.text.length ?? 0;
		const authorNameLength = data.author?.name.length ?? 0;
		const fieldsLength =
			data.fields?.reduce((acc, field) => {
				return acc + field.name.length + field.value.length;
			}, 0) ?? 0;

		const totalLength =
			titleLength + descriptionLength + footerTextLength + authorNameLength + fieldsLength;

		if (totalLength > 6000)
			ctx.addIssue({
				code: "custom",
				message: "The total character count of the embed exceeds 6000."
			});
	});

export const MESSAGE_RESPONSE_SCHEMA = z.object({
	content: z.string().max(2000).optional(),
	embeds: z.array(CUSTOM_EMBED_SCHEMA).max(10).optional()
});
