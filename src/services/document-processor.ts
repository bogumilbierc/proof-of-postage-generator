import { Recipent } from "../models/recipent.model";
import { dialog } from 'electron'
const mammoth = require('mammoth');

export class DocumentProcessor {

    static readonly HEADER_LENGTH_LIMIT = 500;

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
        nonEmptyLines?.forEach((fragment: string) => {
            console.debug(`Fragment: ${fragment}`);
        });
        return nonEmptyLines;
    }

    extractRecipent(): Recipent {
        return null;
    }

}