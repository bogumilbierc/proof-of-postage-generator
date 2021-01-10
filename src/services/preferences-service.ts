import { App, dialog } from "electron";
import * as path from 'path';
import fs = require('fs');

export class PreferencesService {

    constructor(private readonly app: App) {

    }

    getUserPreferences(): UserPreferences {
        if (!fs.existsSync(this.getPreferencesFileLocation())) {
            console.debug('Preferences file does not exist, returning default preferences.');
            return this.getDefaultPreferences();
        }

        const rawFile = fs.readFileSync(this.getPreferencesFileLocation());
        return JSON.parse(rawFile.toString());
    }

    changeSendersFileLocation(): void {
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
            sendersStoreLocation: path
        });
    }

    storeUserPreferences(preferences: UserPreferences): void {
        console.log('Storing user preferences');
        fs.writeFileSync(this.getPreferencesFileLocation(), JSON.stringify(preferences));
    }

    private getDefaultPreferences(): UserPreferences {
        return {
            sendersStoreLocation: path.join(
                this.app.getPath('appData'),
                'confirmation-generator-senders.json'
            )
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
}