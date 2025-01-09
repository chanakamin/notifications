import { EntityNotExistsError } from "../exceptions/entity-not-exists.exception.js";
import { BadRequestError } from "../exceptions/http.exception.js";
import { createPreferences, updatePreferences } from "../repositories/preferences.repository.js";
import { UserPreferences } from "../types/preferences.js";

export const createUserPreferences = async (userPreferences: UserPreferences): Promise<UserPreferences> => {
    const newPreferences = await createPreferences(userPreferences);
    return newPreferences;
}

export const updateUserPreferences = async (userId: string, userPreferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    try {
        return await updatePreferences(userId, userPreferences);
    } catch(error) {
        if (error instanceof EntityNotExistsError) {
            throw new BadRequestError(error.message);
        }
        throw error;
    }    
}

export const validatePreferencePayload = (object: UserPreferences): object is UserPreferences => {
    return Boolean(object.email?.length 
        && typeof object.preferences?.email === 'boolean'
        && typeof object.preferences?.sms === 'boolean'
        && (typeof object.telephone === 'undefined' || typeof object.telephone === 'string')
    )
}