import { Recipent } from "../models/recipent.model";
import { dialog } from 'electron'
const mammoth = require('mammoth');

export class DocumentProcessor {

    static readonly HEADER_LENGTH_LIMIT = 500;
    static readonly POSTCODE_CITY_REGEX = /^\d{2}-\d{3} \D{3,}$/;
    static readonly CITY_DATE_START_REGEX = /^\D{3,}, dnia/;
    static readonly CITY_DATE_END_REGEX = /(\d{4} roku)|(\d{4} r.)/;

    async openAndProcessDocument(): Promise<void> {
        const fileNames = dialog.showOpenDialogSync({ properties: ['openFile'] });
        if (fileNames?.length) {
            this.processDocument(fileNames[0]);
        }

    }

    async processDocument(path: string): Promise<void> {
        console.log(`Will try to process document at path: ${path}`);

        const documentText = await this.loadTopPartOfDocumentText(path);
        const top10Lines = this.extractTop10Lines(documentText);
        const addressLines = this.extractAddressLines(top10Lines);
        console.log('Adress lines');
        console.log(addressLines);

    }

    private async loadTopPartOfDocumentText(path: string): Promise<string> {
        const text = await mammoth.extractRawText({ path });
        const possibleRecipientFragment = text?.value?.substring(0, text.length > DocumentProcessor.HEADER_LENGTH_LIMIT ? DocumentProcessor.HEADER_LENGTH_LIMIT : text.length);
        return possibleRecipientFragment;
    }

    private extractTop10Lines(text: string): string[] {
        const splitted = text?.split('\n');

        const nonEmptyLines = splitted?.filter((fragment: string) => !!fragment);
        if (nonEmptyLines?.length > 10) {
            nonEmptyLines.length = 10;
        }
        return nonEmptyLines;
    }

    private extractAddressLines(possibleAddressLines: string[]): string[] {
        const extractedAddressLines: string[] = [];

        for (let i = 0; i < possibleAddressLines.length; i++) {
            const currentLine = possibleAddressLines[i];

            if (this.isLineAddressLine(currentLine)) {
                extractedAddressLines.push(currentLine);
            }
            if (this.isPostcodeLine(currentLine)) {
                break;
            }
        }

        return extractedAddressLines;
    }

    private isLineAddressLine(text: string): boolean {
        return !DocumentProcessor.CITY_DATE_START_REGEX.test(text) && !DocumentProcessor.CITY_DATE_END_REGEX.test(text);
    }

    private isPostcodeLine(text: string): boolean {
        return DocumentProcessor.POSTCODE_CITY_REGEX.test(text);
    }

    extractRecipent(): Recipent {
        return null;
    }

}