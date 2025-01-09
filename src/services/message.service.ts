import { sendMessageToProvider } from "../connectors/messages.connector.js";
import { EntityNotExistsError } from "../exceptions/entity-not-exists.exception.js";
import { BadRequestError, InternalServerError } from "../exceptions/http.exception.js";
import { createMessage, updateMessage } from "../repositories/message.repository.js";
import { getUserPreferences } from "../repositories/preferences.repository.js";
import { Channel, Message, MessageStatus } from "../types/message.js";
import { SendMessageDto } from "../types/payload.js";
import { UserPreferences } from "../types/preferences.js";
import { ErrorResponse, NotificationResponse, SuccessResponse } from "../types/responses.js";

const channelsData: Record<Channel, { param: keyof UserPreferences }> = {
    email: { param: 'email' },
    sms: { param: 'telephone' },
}


export const sendMessage = async (userId: string, message: string): Promise<{ status: MessageStatus, message?: string }> => {

    try {
        const userPreferences = await getUserPreferences(userId);
        const { id } = await createMessage({ userId, message });
        const sentResponse = await sendMessageToAllChannels(userPreferences, message);
        if (!sentResponse.length) {
            updateMessage(id, MessageStatus.notSent);
            return { status: MessageStatus.notSent };
        }
        const success = sentResponse.filter(response => (response as SuccessResponse).status === 'sent');
        const failed = sentResponse.filter(response => (response as ErrorResponse).error) as ErrorResponse[];
        if (!failed.length) {
            updateMessage(id, MessageStatus.successful);
            return { status: MessageStatus.successful };
        }
        if (!success.length) {
            updateMessage(id,  MessageStatus.failed, JSON.stringify(failed));
            return { status: MessageStatus.failed, message: JSON.stringify(failed) }
        }
        updateMessage(id,  MessageStatus.partiallySent, JSON.stringify(failed));
        return { status: MessageStatus.partiallySent, message: JSON.stringify(failed) };
    } catch (error) {
        console.error(`[${new Date().toISOString()}] sendMessage failed`, error);
        if (error instanceof BadRequestError) {
            throw error;
        }
        if (error instanceof EntityNotExistsError) {
            console.log('bad request....')
            throw new BadRequestError('invalid parameters');
        }
        throw new InternalServerError('error occurred');
    }
}

const sendMessageToAllChannels = async (userPreferences: UserPreferences, message: string) => {
    const responses: Promise<NotificationResponse>[] = [];
    const { preferences } = userPreferences;
    for (let [channel, channelData] of Object.entries(channelsData)) {
        if (preferences[channel as Channel]) {
            const payload = {
                message,
                [channelData.param ]: userPreferences[channelData.param]
            }
            if (!payload[channelData.param]) {
                throw new BadRequestError(`missing ${channelData.param}`);
            }
            responses.push(sendMessageToProvider(payload as SendMessageDto, channel as Channel))
        }
        
    }
    /* previous implementation:
    if (preferences.email) {
        if (email) {
            responses.push(sendMessage({ email, message }, 'email'))
        } else {
            throw new BadRequestError('missing email');
        }
    }
    if (preferences.sms) {
        if (telephone) {
            responses.push(sendMessage({ telephone, message }, 'sms'))
        } else {
            throw new BadRequestError('missing email');
        }
    }
        */
    return Promise.all(responses);
}

export const validateMessage = (message: Message): message is Message => {
    return Boolean(message.userId?.length && message.message?.length)
}