import { Request, Response } from 'express';
import * as PreferencesService from '../services/preferences.service.js';
import { UserPreferences } from '../types/preferences.js';
import { asyncErrorCatcher } from '../middlewares/error.middleware.js';
import { BadRequestError } from '../exceptions/http.exception.js';

export const createUserPreferences = async (request: Request, response: Response) => {
    const { body } = request;
    try {
        if (!PreferencesService.validatePreferencePayload(body)) {
            throw new BadRequestError('error in request payload');
        }
        const userPreferences = await PreferencesService.createUserPreferences(body);
        response.send({status: 'success', data: userPreferences});
    } catch (error) {
        asyncErrorCatcher(error as Error, response);
    }
    
}

export const updateUserPreferences = async (request: Request, response: Response) => {
    const userId = request.params.userId;
    const { body } = request;
    try {
        const updated = await PreferencesService.updateUserPreferences(userId, body);
        response.send({status: 'success', data: updated});
    } catch (error) {
        asyncErrorCatcher(error as Error, response);
    }
}