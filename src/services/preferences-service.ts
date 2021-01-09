export class PreferencesService {

    getUserPreferences(): UserPreferences {

        const preferences: UserPreferences = {
            sendersStoreLocation: '/home/bogumil/senders.json'
        }

        return preferences;
    }

}

export interface UserPreferences {
    sendersStoreLocation: string;
}