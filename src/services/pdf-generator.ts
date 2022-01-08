import * as log from 'electron-log';
import { Recipient } from '../models/recipient.model';
import { Sender } from './sender-store';
import { LocalPdfGenerator } from './pdf/local-pdf-generator';

export class PdfGenerator {

  async safelyGenerateFile(sender: Sender, recipients: Recipient[], saveLocation?: string, caseSignature?: string): Promise<boolean> {
    const result = await this.generateOrCatch(sender, recipients, saveLocation, caseSignature);
    if (result) {
      log.debug('PDF generation call OK, returning');
      return result;
    }
    log.debug('PDF generation call failed, retrying');
    const result2 = await this.generateOrCatch(sender, recipients, saveLocation, caseSignature);
    if (result2) {
      log.debug('Second PDF generation call OK, returning');
      return result2;
    }
    return await this.generateOrCatch(sender, recipients, saveLocation, caseSignature);
  }

  private async generateOrCatch(sender: Sender, recipients: Recipient[], saveLocation?: string, caseSignature?: string): Promise<boolean> {
    return this.generate(sender, recipients, saveLocation, caseSignature)
    .catch((e) => {
      log.error('Error while trying to generate PDF', e);
      return false;
    });
  }

  private async generate(sender: Sender, recipients: Recipient[], saveLocation?: string, caseSignature?: string): Promise<boolean> {
    log.debug(`PdfGenerator: Will try to generate PDF for Sender: ${JSON.stringify(sender)} and recipient: ${JSON.stringify(recipients)}`);
    new LocalPdfGenerator().generatePdf(sender, recipients, saveLocation, caseSignature);
    log.info(`PdfGenerator: Saved PDF file under: ${saveLocation}`);
    return Promise.resolve(true);
  }
}
