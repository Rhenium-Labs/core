import { Client, Collection, type ApplicationCommandData } from "discord.js";
import { pathToFileURL } from "node:url";

import fs from "node:fs";
import path from "node:path";

import { inflect } from "#utils/index.js";
import { CLIENT_CACHE_OPTIONS, CLIENT_INTENTS, CLIENT_PARTIALS } from "#utils/Constants.js";

import type { CommandRegistry } from "../responses/Template.js";

import Logger from "#utils/Logger.js";
import Command from "./Command.js";
import EventListener from "./EventListener.js";

export default class Rhenium extends Client<true> {
	/** Cached command classes. */
	public readonly commands: Collection<string, Command<keyof CommandRegistry>> =
		new Collection();

	public constructor() {
		super({
			/** Gateway intents. */
			intents: CLIENT_INTENTS,

			/** Discord.js partials. */
			partials: CLIENT_PARTIALS,

			/** Discord.js cache options. */
			makeCache: CLIENT_CACHE_OPTIONS,

			/**
			 * Discord.js sweepers. These are used to automatically remove old data from the cache. The default intervals are set to 6 hours, but you can adjust them as needed.
			 */
			sweepers: {
				guildMembers: {
					interval: 21600, // 6 hours
					filter: () => member =>
						!member.user.bot || member.presence?.status !== "offline"
				},
				users: {
					interval: 21600, // 6 hours
					filter: () => user => !user.bot
				}
			}
		});
	}

	/** Mounts all event listeners from the `events` directory. */
	public async mountEventListeners(): Promise<void> {
		const directory = path.resolve("build/events");

		if (!fs.existsSync(directory)) {
			Logger.fatal("ENOENT: `events` directory missing.");
			return process.exit(1);
		}

		// prettier-ignore
		const fileNames = fs
            .readdirSync(directory)
            .filter(file => file.endsWith(".js"));

		if (fileNames.length === 0) {
			Logger.fatal("No event listeners found in the `events` directory.");
			return process.exit(1);
		}

		Logger.info(`Mounting event listeners...`);

		let count = 0;

		for (const fileName of fileNames) {
			const filePath = path.join(directory, fileName);
			const url = pathToFileURL(filePath).href;

			const listenerModule = await import(url);

			if (!listenerModule.default) {
				Logger.warn(`${fileName} does not have a default export. Skipping...`);
				continue;
			}

			const listener = new listenerModule.default();

			if (!(listener instanceof EventListener)) {
				Logger.warn(
					`${fileName}'s default export is not an instance of EventListener. Skipping...`
				);
				continue;
			}

			let level: string;

			if (listener.once) {
				this.once(listener.event, (...args) => listener.onEmit(...args));
				level = "ONCE";
			} else {
				this.on(listener.event, (...args) => listener.onEmit(...args));
				level = "ON";
			}

			Logger.info(`[${level}] Mounted listener "${listener.event}."`);
			count++;
		}

		Logger.info(`Mounted ${count}/${fileNames.length} event ${inflect(count, `listener`)}.`);
	}

	/** Caches all commands from the `commands` directory. */
	public async cacheCommands(): Promise<void> {
		const directory = path.resolve("build/commands");

		if (!fs.existsSync(directory)) {
			Logger.fatal("ENOENT: `commands` directory missing.");
			return process.exit(1);
		}

		// prettier-ignore
		const fileNames = fs
			.readdirSync(directory)
			.filter(file => file.endsWith(".js"));

		if (fileNames.length === 0) {
			Logger.fatal("No commands found in the `commands` directory.");
			return process.exit(1);
		}

		Logger.info(`Caching commands...`);

		let count = 0;

		for (const fileName of fileNames) {
			const filePath = path.join(directory, fileName);
			const url = pathToFileURL(filePath).href;

			const commandModule = await import(url);

			if (!commandModule.default) {
				Logger.warn(`${fileName} does not have a default export. Skipping...`);
				continue;
			}

			const command = new commandModule.default();

			if (!(command instanceof Command)) {
				Logger.warn(`${fileName}'s default export is not a Command. Skipping...`);
				continue;
			}

			this.commands.set(command.name, command);
			Logger.info(`Cached command "${command.name}".`);
			count++;
		}

		Logger.info(`Cached ${count}/${fileNames.length} ${inflect(count, `command`)}.`);
	}

	/** Registers all application commands to Discord. */
	public async registerApplicationCommands(): Promise<void> {
		const commands: Array<ApplicationCommandData> = this.commands
			.filter(cmd => cmd.register !== undefined)
			.map(cmd => cmd.register!());

		if (commands.length === 0) {
			Logger.warn("No application commands to register.");
			return;
		}

		const set = await this.application.commands.set(commands).catch(error => {
			Logger.error("Failed to register application commands:", error);
			return null;
		});

		if (!set) process.exit(1);
		Logger.info(`Registered ${set.size} application ${inflect(set.size, "command")}.`);
	}
}
