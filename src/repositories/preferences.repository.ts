import { EntityNotExistsError } from "../exceptions/entity-not-exists.exception.js";
import { Preferences, UserPreferences } from "../types/preferences.js";
import { User } from "../types/user.js";
import { getUserByEmail, getUser, createUser, updateUser } from "./user.repository.js";

const Preferences: Map<string, Preferences> = new Map();

export const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
    const preference = Preferences.get(userId);
    if (!preference) {
        throw new EntityNotExistsError('userPreferences');
    }    
    const user = await getUser(userId);
    return { 
        userId: user.id,
        email: user.email,
        telephone: user.phone,
        preferences: preference,
    }
}

export const createPreferences = async(preference: Omit<UserPreferences, 'userId'>): Promise<UserPreferences> => {
    const { email, telephone, preferences } = preference;
    let user = await getUserByEmail(email);
    if (!user) {
        user = await createUser({
            email,
            phone: telephone,
        });
    }
    let existsPreference = Preferences.get(user.id);
    if (!existsPreference) {
        existsPreference = preferences;
        Preferences.set(user.id, existsPreference);
    } else {
        Object.assign(existsPreference, preferences);
    }

    return {
        userId: user.id, 
        email,
        telephone,
        preferences,
    }
}

export const updatePreferences = async(userId: string, preference: Partial<UserPreferences>): Promise<UserPreferences> => {
    const { email, telephone, preferences } = preference;
    let user = await getUser(userId);
    let existsPreference = Preferences.get(user.id);
    if (!existsPreference) {
        throw new EntityNotExistsError('userPreferences');
    }
    const update: Partial<User> = {}
    if (email) {
        update.email = email;
    }
    if (telephone) {
        update.phone = telephone;
    }
    user = await updateUser(userId, update)
    if (preferences) {
        Object.assign(existsPreference, preferences);
    }

    return {
        userId: user.id, 
        email: user.email,
        telephone: user.phone,
        preferences: existsPreference,
    }
}

