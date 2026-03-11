import type { Events, Awaitable } from "discord.js";

import { client } from "#root/index.js";

export default abstract class EventListener {
	/**
	 * The client this event is attached to.
	 */
	public client = client;

	/**
	 * The event this listener is listening for.
	 */
	public event: Events | string;

	/**
	 * Whether this listener should only be executed once.
	 */
	public once: boolean;

	/**
	 * Construct a new event listener.
	 *
	 * @param options The options for this event listener.
	 *      - event: The event this listener is listening for.
	 *      - once: Whether this listener should only be executed once.
	 * @returns A new event listener.
	 */

	protected constructor(options: { event: Events; once?: boolean }) {
		this.event = options.event;
		this.once = options.once ?? false;
	}

	/**
	 * Method to be called when the event is emitted.
	 * This method should be implemented by all subclasses of EventListener.
	 *
	 * @param args The arguments emitted by the event.
	 * @returns unknown.
	 */
	public abstract onEmit(...args: unknown[]): Awaitable<unknown>;
}
