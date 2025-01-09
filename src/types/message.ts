import { Preferences } from "./preferences.js";

export type Message = {
    userId: string;
    message: string;
}

export type MessageEntity = Message & { status: MessageStatus, id: string, data?: string }

export enum MessageStatus {
    sent = 'sent',
    successful = 'successful',
    failed = 'failed',
    partiallySent = 'partially sent',
    notSent = 'empty',
}

export type Channel = keyof Preferences;