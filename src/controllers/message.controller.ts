import { Request, Response } from 'express';
import { asyncErrorCatcher } from '../middlewares/error.middleware.js';
import { sendMessage, validateMessage } from '../services/message.service.js';
import { BadRequestError, InternalServerError } from '../exceptions/http.exception.js';
import { MessageStatus } from '../types/message.js';

export const createMessage = async (request: Request, response: Response) => {
    try {
        const { body } = request;
        if (!validateMessage(body)) {
            throw new BadRequestError('invalid params');
        }
        const { status, message } = await sendMessage(body.userId, body.message);
        if (status === MessageStatus.failed) {
            throw new InternalServerError(message!);
        }
        response.json({ status: 'success', sentStatus: status, data: message });
    } catch (error) {
        asyncErrorCatcher(error as Error, response);
    }
}