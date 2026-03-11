import { GatewayIntentBits, Partials, Options } from "discord.js";

/**
 * Gateway intents used by Rhenium.
 * These intents contain all privileged ones. You'll need to enable them in the Discord Developer Portal for your bot.
 *
 * @see https://discord.com/developers/docs/topics/gateway#gateway-intents for more information on gateway intents.
 */
export const CLIENT_INTENTS: Readonly<Array<GatewayIntentBits>> = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildExpressions,
	GatewayIntentBits.GuildModeration,
	GatewayIntentBits.GuildPresences
];

/**
 * Partial structures Rhenium is allowed to receive.
 */
export const CLIENT_PARTIALS: Readonly<Array<Partials>> = [
	Partials.User,
	Partials.Message,
	Partials.Channel,
	Partials.Reaction,
	Partials.GuildMember
];

/**
 * Cache options for Rhenium.
 * Every unneeded cache is disabled by default.
 */
export const CLIENT_CACHE_OPTIONS = Options.cacheWithLimits({
	GuildBanManager: 0,
	GuildStickerManager: 0,
	GuildTextThreadManager: 0,
	GuildForumThreadManager: 0,
	GuildInviteManager: 0,
	GuildScheduledEventManager: 0,

	ThreadMemberManager: 0,
	VoiceStateManager: 0,
	StageInstanceManager: 0,
	ThreadManager: 0,
	ReactionManager: 0,
	ReactionUserManager: 0,
	MessageManager: 0,
	GuildMessageManager: 0,

	UserManager: Infinity,
	GuildEmojiManager: Infinity,
	GuildMemberManager: Infinity,
	ApplicationCommandManager: Infinity,
	BaseGuildEmojiManager: Infinity
});
