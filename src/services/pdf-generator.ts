import axios from "axios";
import * as log from 'electron-log';
import { promises as fs } from 'fs';
import { Recipient } from "../models/recipient.model";
import { Sender } from "./sender-store";

export class PdfGenerator {

    async safelyGenerateFile(sender: Sender, recipients: Recipient[], saveLocation?: string): Promise<boolean> {

        if (!this.isPdfGenerationEnabled()) {
            log.debug('PDF generation disabled');
            return Promise.resolve(false);
        }

        return this.generate(sender, recipients, saveLocation)
            .catch((e) => {
                log.error('Error while trying to generate PDF', e);
                return false;
            });
    }

    private async generate(sender: Sender, recipients: Recipient[], saveLocation?: string): Promise<boolean> {
        log.debug(`PdfGenerator: Will try to generate PDF for Sender: ${JSON.stringify(sender)} and recipient: ${JSON.stringify(recipients)}`);

        const bodyFormData = new URLSearchParams();

        for (let i = 0; i < recipients.length; i++) {
            bodyFormData.append(`data[${i + 1}][nadawca]`, sender.address.join('\n'));
            bodyFormData.append(`data[${i + 1}][odbiorca]`, recipients[i].address.join('\n'));
        }

        log.info(`PdfGenerator: Starting async call`);

        const response = await axios({
            method: 'POST',
            url: 'http://p.ar2oor.pl/potwierdzenia/pdf.php',
            data: bodyFormData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'arraybuffer',
            timeout: 10000
        });

        log.info(`PdfGenerator: File generation response status: ${response.status}`);

        if (saveLocation && response.status === 200) {
            log.debug(`PdfGenerator: Will save PDF file under: ${saveLocation}`);
            await fs.writeFile(saveLocation, response.data, { encoding: null });
            log.info(`PdfGenerator: Saved PDF file under: ${saveLocation}`);
        }

        return true;
    }

    private isPdfGenerationEnabled(): boolean {
        const skipPdf = process.env.SKIP_PDF;
        if (skipPdf === 'true') {
            return false;
        }
        return true;
    }
}