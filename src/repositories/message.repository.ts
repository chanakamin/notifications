import { nanoid } from "nanoid";
import { Message, MessageEntity, MessageStatus } from "../types/message.js";
import { EntityNotExistsError } from "../exceptions/entity-not-exists.exception.js";

const Messages: Map<string, MessageEntity> = new Map();

export const createMessage = async (message: Message): Promise<MessageEntity> => {
    const { message: text, userId } = message;
    const newMessage: MessageEntity = {
        id: nanoid(),
        status: MessageStatus.sent,
        message: text,
        userId,
    };
    Messages.set(newMessage.id, newMessage);
    return newMessage;
}

export const getMessage = async(messageId: string): Promise<MessageEntity> => {
    const message = Messages.get(messageId);
    if (message) {
        return message;
    }
    throw new EntityNotExistsError('message');
}

export const updateMessage = async(messageId: string, status: MessageStatus, data?: string): Promise<MessageEntity> => {
    const message = await getMessage(messageId);
    message.status = status;
    data && (message.data = data);
    return message;
}