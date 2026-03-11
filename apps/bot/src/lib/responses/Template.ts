// ============================================================
// Per-command outcome type definitions.
// Add one type per command/component here.
// ============================================================

export type PingExecutionOutcomes = {
	outcome: "success";
	props: {
		roundtrip: string;
		heartbeat: string;
	};
};

export type GreetExecutionOutcomes =
	| {
			outcome: "success";
			props: {
				target_id: string;
				target_username: string;
				target_display_name: string | null;
			};
	  }
	| {
			outcome: "invalid_target";
			props: { provided_target: string };
	  };

// ============================================================
// Command registry — add one entry per command/component.
// The key is the command name and becomes the DB key prefix:
//   { ping: PingExecutionOutcomes } → DB key "ping_success"
// ============================================================

export interface CommandRegistry {
	ping: PingExecutionOutcomes;
	greet: GreetExecutionOutcomes;
}

// ============================================================
// Derived types — no edits needed below.
// ============================================================

// Distribute "commandName_outcomeName" across a union of outcomes.
type DistributeKeys<
	TCommand extends string,
	TOutcomes extends { outcome: string }
> = TOutcomes extends { outcome: infer O extends string } ? `${TCommand}_${O}` : never;

/**
 * All valid DB response keys, automatically derived from CommandRegistry.
 * e.g. "ping_success" | "greet_success" | "greet_invalid_target"
 */
export type ResponseKey = {
	[K in keyof CommandRegistry & string]: DistributeKeys<K, CommandRegistry[K]>;
}[keyof CommandRegistry & string];

// Build a flat map { "ping_success": { roundtrip: string; ... }, "greet_success": { ... }, ... }
// by distributing over each outcome union and then intersecting the records together.
type DistributeProps<
	TCommand extends string,
	TOutcomes extends { outcome: string; props: object }
> = TOutcomes extends { outcome: infer O extends string; props: infer P }
	? Record<`${TCommand}_${O}`, P>
	: never;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

type ResponsePropsMap = UnionToIntersection<
	{
		[K in keyof CommandRegistry & string]: DistributeProps<K, CommandRegistry[K]>;
	}[keyof CommandRegistry & string]
>;

/** The props type for a specific response key, e.g. ResponseProps<"ping_success"> */
export type ResponseProps<TKey extends ResponseKey> = ResponsePropsMap[TKey];

/** The return type for a command handler — ensures the outcome + props shape are correct. */
export type CommandOutcome<TCommand extends keyof CommandRegistry> = CommandRegistry[TCommand];
