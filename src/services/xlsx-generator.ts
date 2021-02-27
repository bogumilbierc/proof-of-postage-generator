import * as log from 'electron-log';
import { Recipient } from "../models/recipient.model";
import { Sender } from "./sender-store";
import ExcelJS = require('exceljs');

export class XlsxGenerator {

    async safelyGenerateFile(sender: Sender, recipients: Recipient[], saveLocation: string, caseSignature?: string): Promise<boolean> {
        return this.generate(sender, recipients, saveLocation, caseSignature)
            .catch((e) => {
                log.error('Error while trying to generate XLSX', e);
                return false;
            });
    }

    private async generate(sender: Sender, recipients: Recipient[], saveLocation: string, caseSignature?: string): Promise<boolean> {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Odbiorcy');

        const rows = [['Adres']];

        recipients.forEach((recipient: Recipient) => {
            let recipientAddress: string = recipient.address.join('\n');
            if (caseSignature) {
                recipientAddress = recipientAddress + `\nSygnatura sprawy: ${caseSignature}`;
            }

            rows.push([recipientAddress])
            if (sender.isStickerRequired) {
                rows.push([sender.address.join('\n')]);
            }

            if (recipient.retrievalConfirmation) {
                rows.push([recipientAddress])
                if (sender.isStickerRequired) {
                    rows.push([sender.address.join('\n')]);
                }
            }
        });

        sheet.insertRows(1, rows);


        await workbook.xlsx.writeFile(saveLocation);
        return true;
    }


}