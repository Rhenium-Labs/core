import { Events } from "discord.js";

import EventListener from "#structures/EventListener.js";
import Logger from "#utils/Logger.js";

export default class extends EventListener {
	public constructor() {
		super({ event: Events.ClientReady, once: true });
	}

	public onEmit(): void {
		Logger.info(`Logged in as ${this.client.user.tag} (${this.client.user.id}).`);
	}
}
