export const DefaultMessageType = {
    ping_success: "ping_success"
} as const;
export type DefaultMessageType = (typeof DefaultMessageType)[keyof typeof DefaultMessageType];
