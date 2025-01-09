import axios, { AxiosError } from 'axios';
import { SendMessageDto } from '../types/payload.js';
import { ErrorResponse, NotificationResponse, SuccessResponse } from '../types/responses.js';
import { Channel } from '../types/message.js';

const instance = axios.create({
    baseURL: process.env.NOTIFICATION_URL,
  });

const errorBuilder = (code: number, channel: Channel, error: string): ErrorResponse => {
    const response: ErrorResponse = {
        type: 'innerServerError',
        error,
        channel,
    };
    if(code === 500) {
        response.type = 'serverError';
    }
    if (code === 429) {
        response.type = 'rateLimit';
    }
    if (code === 400) {
        response.type = 'BadRequest';
    }
    return response;
}

const endpoints: Record<Channel, string> = {
    email: '/send-email',
    sms: '/send-sms',
}

export const sendMessageToProvider = async (payload: SendMessageDto, channel: Channel): Promise<NotificationResponse> => {
    try {
        const { data, status } = await instance.post(endpoints[channel], payload);
        if (status === 200 || data.status === 'sent') {
            return data as SuccessResponse;
        } 
        return errorBuilder(500, channel, data.error ?? 'unknown error');
    } catch (error) {
        console.error(`[${new Date().toISOString()}] sendMessage to ${channel} error `, error);
        return errorBuilder((error as AxiosError).status || 500, channel, (error as Error).message);
    }
}