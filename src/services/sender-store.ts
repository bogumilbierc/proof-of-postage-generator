import { PreferencesService } from "./preferences-service";

import fs = require('fs');

export class SenderStore {

    constructor(private readonly preferencesService: PreferencesService) {

    }

    addSender(sender: Sender): void {
        const senders = this.getAllSenders();
        senders.push(sender);
        this.storeSenders(senders);
    }

    deleteSender(name: string): void {
        const senders = this.getAllSenders();
        const filteredSenders = senders.filter(
            (sender: Sender) => sender.name !== name
        );
        this.storeSenders(filteredSenders);
    }

    getAllSenders(): Sender[] {
        const sendersLocation = this.preferencesService.getUserPreferences().sendersStoreLocation;
        if (!fs.existsSync(sendersLocation)) {
            console.log('Senders file does not exist. Returning empty list of senders');
            return [];
        }
        const rawFile = fs.readFileSync(sendersLocation);
        return JSON.parse(rawFile.toString());
    }

    setSenderAsDefault(name: string): void {
        const senders = this.getAllSenders();
        const updatedSenders = senders.map((sender: Sender) => {
            return {
                ...sender,
                isDefault: name === sender.name
            }
        });
        this.storeSenders(updatedSenders);
    }

    private storeSenders(senders: Sender[]): void {
        const sendersLocation = this.preferencesService.getUserPreferences().sendersStoreLocation;
        console.debug(`Storing list of senders in: ${sendersLocation}`);
        fs.writeFileSync(sendersLocation, JSON.stringify(senders));
        console.info(`Stored list of senders in: ${sendersLocation}`);
    }

}

export interface Sender {
    name: string;
    address: string[];
    isDefault?: boolean;
}