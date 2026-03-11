import { client } from "#root/index.js";
import type { Awaitable, ApplicationCommandData, CommandInteraction } from "discord.js";
import type { CommandOutcome, CommandRegistry } from "../responses/Template.js";

export default abstract class Command<K extends keyof CommandRegistry> {
	/**
	 * The client that owns this command.
	 */
	public client = client;

	/**
	 * The name of the command, used for registration and as the DB key prefix for responses.
	 * Must be unique across all commands.
	 */
	public name: string;

	/**
	 * A short description of the command, used in the help command and for developer reference.
	 */
	public description: string;

	/**
	 * Construct a new command.
	 *
	 * @param options The options for this command.
	 * @returns A new command.
	 */

	protected constructor(options: { name: string; description: string }) {
		this.name = options.name;
		this.description = options.description;
	}

	/**
	 * Method to be called when the command is executed as a message command.
	 * This method should be implemented by all subclasses of Command.
	 */
	public executeMessage?(...args: unknown[]): Awaitable<CommandOutcome<K>>;

	/**
	 * Method to be called when the command is executed as an application command.
	 * This method should be implemented by all subclasses of Command.
	 */
	public executeInteraction?(
		interaction: CommandInteraction<"cached">
	): Awaitable<CommandOutcome<K>>;

	/**
	 * Register function to provide application command data for Discord.
	 * This should be implemented by subclasses if the command is to be registered as an application command.
	 */
	public register?(): ApplicationCommandData;
}
