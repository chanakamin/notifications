import { nanoid } from "nanoid";
import { User } from "../types/user.js";
import { EntityNotExistsError } from '../exceptions/entity-not-exists.exception.js';

const users: Map<string, User> = new Map();

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    return [...users.values()].find(user => user.email === email);
}

export const getUser = async (id: string): Promise<User> => {
    const user = users.get(id);
    if (user) {
        return user;
    }
    throw new EntityNotExistsError('user');
}

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const exists = await getUserByEmail(user.email);
    if (!exists) {
        const newUser = {
            ...user,
            id: nanoid(),
        };
        users.set(newUser.id, newUser);
        return newUser;
    } 
    if (user.phone && !exists.phone) {
        exists.phone = user.phone;
    } 
    return exists;
}

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
    const exists = await getUser(id);

    const { phone, email } = user;
    if (phone) {
        exists.phone = phone;
    }
    if (email) {
        exists.email = email;
    }
    return exists;
}

