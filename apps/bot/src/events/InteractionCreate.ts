import { resolveResponse } from "#root/lib/responses/Interpolator.js";
import { fetchTemplate } from "#root/lib/responses/TemplateStore.js";
import type { ResponseKey, ResponseProps } from "#root/lib/responses/Template.js";
import EventListener from "#structures/EventListener.js";
import Logger from "#utils/Logger.js";
import { Events, type Interaction } from "discord.js";

export default class extends EventListener {
	public constructor() {
		super({ event: Events.InteractionCreate });
	}

	public async onEmit(interaction: Interaction): Promise<void> {
		if (!interaction.inCachedGuild()) return;
		if (!interaction.isCommand()) return;

		const command = this.client.commands.get(interaction.commandName);

		if (!command) {
			await interaction.reply({ content: "Unknown command.", ephemeral: true });
			return;
		}

		if (!command.executeInteraction) {
			await interaction.reply({
				content: "This command cannot be used as an application command.",
				ephemeral: true
			});
			return;
		}

		const result = await command.executeInteraction(interaction);
		const key = `${command.name}_${result.outcome}` as ResponseKey;
		const rawTemplate = fetchTemplate(key);

		if (!rawTemplate) {
			Logger.warn(`No template found for key "${key}".`);
			await (
				interaction.deferred
					? interaction.editReply
					: interaction.reply.bind(interaction)
			)({
				content: "No response has been configured for this command.",
				ephemeral: true
			});
			return;
		}

		// At the dispatcher level we know the props match the key at runtime.
		const message = resolveResponse(rawTemplate, result.props as ResponseProps<ResponseKey>);
		await (interaction.deferred
			? interaction.editReply(message)
			: interaction.reply(message));
	}
}
