import { Channel } from "./message.js"

export type SuccessResponse = {
    status: 'sent',
    channel: Channel,
    to: string,
    message: string
}

export type ErrorResponse = {
    error: string,
    type: 'rateLimit' | 'serverError' | 'innerServerError' | 'BadRequest',
    channel: Channel
}

export type NotificationResponse = SuccessResponse | ErrorResponse