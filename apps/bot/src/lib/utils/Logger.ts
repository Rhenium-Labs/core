import pino from "pino";

const Logger = pino({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:HH:MM:ss",
			ignore: "pid,hostname",
			singleLine: false
		}
	},
	serializers: {
		err: pino.stdSerializers.err
	}
});

export default Logger;
