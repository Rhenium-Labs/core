import {
	ApplicationCommandType,
	type ChatInputCommandInteraction,
	type ApplicationCommandData,
	ApplicationIntegrationType,
	InteractionContextType
} from "discord.js";
import type { CommandOutcome } from "#root/lib/responses/Template.js";

import Command from "#structures/Command.js";

export default class Ping extends Command<"ping"> {
	public constructor() {
		super({
			name: "ping",
			description: "Get the websocket heartbeat and roundtrip latency."
		});
	}

	public register(): ApplicationCommandData {
		return {
			name: this.name,
			type: ApplicationCommandType.ChatInput,
			description: this.description,
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild]
		};
	}

	public async executeInteraction(
		interaction: ChatInputCommandInteraction<"cached">
	): Promise<CommandOutcome<"ping">> {
		const start = performance.now();
		await interaction.deferReply();
		const end = performance.now();

		const heartbeat = this.client.ws.ping.toString();
		const roundtrip = Math.round(end - start).toString();

		return {
			outcome: "success",
			props: { heartbeat, roundtrip }
		};
	}
}
