import * as log from 'electron-log';
import { Recipient } from "../models/recipient.model";
import { Sender } from "./sender-store";

export class CsvGenerator {


    async safelyGenerateFile(sender: Sender, recipients: Recipient[], saveLocation: string): Promise<boolean> {
        return this.generate(sender, recipients, saveLocation)
            .catch((e) => {
                log.error('Error while trying to generate CSV', e);
                return false;
            });
    }

    private async generate(sender: Sender, recipients: Recipient[], saveLocation: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}