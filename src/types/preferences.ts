export type Preferences = {
    email: Boolean;
    sms: Boolean;
}

export type UserPreferences = {
    userId: string;
    email: string;
    telephone?: string;
    preferences: Preferences;
}