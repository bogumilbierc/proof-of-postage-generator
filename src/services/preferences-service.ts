import { App, dialog } from "electron";
import * as log from 'electron-log';
import * as path from 'path';
import fs = require('fs');

export class PreferencesService {

    constructor(private readonly app: App) {

    }

    getUserPreferences(): UserPreferences {
        if (!fs.existsSync(this.getPreferencesFileLocation())) {
            log.debug('Preferences file does not exist, returning default preferences.');
            return this.getDefaultPreferences();
        }

        const rawFile = fs.readFileSync(this.getPreferencesFileLocation());
        const parsedPreference: UserPreferences = JSON.parse(rawFile.toString());
        return {
            confirmationsLocation: parsedPreference.confirmationsLocation || this.getDefaultPreferences().confirmationsLocation,
            sendersStoreLocation: parsedPreference.sendersStoreLocation || this.getDefaultPreferences().sendersStoreLocation,
            recipientsStoreLocation: parsedPreference.recipientsStoreLocation || this.getDefaultPreferences().recipientsStoreLocation,
        }
    }

    changeSendersFileLocation(): void {
        const preferences = this.getUserPreferences();
        const path = dialog.showSaveDialogSync({
            defaultPath: this.getUserPreferences().sendersStoreLocation,
            filters: [
                {
                    name: 'JSON',
                    extensions: ['json']
                }
            ]
        })
        if (!path) {
            return;
        }
        this.storeUserPreferences({
            ...preferences,
            sendersStoreLocation: path
        });
    }

    changeRecipientsFileLocation(): void {
        const preferences = this.getUserPreferences();
        const path = dialog.showSaveDialogSync({
            defaultPath: this.getUserPreferences().recipientsStoreLocation,
            filters: [
                {
                    name: 'JSON',
                    extensions: ['json']
                }
            ]
        })
        if (!path) {
            return;
        }
        this.storeUserPreferences({
            ...preferences,
            recipientsStoreLocation: path
        });
    }

    changeConfirmationsLocation(): void {
        const path = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        });
        if (!path || !path.length || !path[0].length) {
            return;
        }
        const preferences = this.getUserPreferences();
        this.storeUserPreferences({
            ...preferences,
            confirmationsLocation: path[0]
        });
    }

    storeUserPreferences(preferences: UserPreferences): void {
        log.info('Storing user preferences');
        fs.writeFileSync(this.getPreferencesFileLocation(), JSON.stringify(preferences));
    }

    private getDefaultPreferences(): UserPreferences {
        return {
            sendersStoreLocation: path.join(
                this.app.getPath('appData'),
                'confirmation-generator-senders.json'
            ),
            confirmationsLocation: path.join(
                this.app.getPath('appData'),
                'confirmations-pdf'
            ),
            recipientsStoreLocation: path.join(
                this.app.getPath('appData'),
                'confirmation-generator-recipients.json'
            ),
        }
    }

    private getPreferencesFileLocation(): string {
        return path.join(
            this.app.getPath('appData'),
            'confirmation-generator.json'
        );
    }

}

export interface UserPreferences {
    sendersStoreLocation: string;
    confirmationsLocation: string;
    recipientsStoreLocation: string;
}