import { Recipent } from "../models/recipent.model";
import { dialog } from 'electron'

export class DocumentProcessor {

    openAndProcessDocument(): void {
        const fileNames = dialog.showOpenDialogSync({ properties: ['openFile'] });
        if (fileNames?.length) {
            this.processDocument(fileNames[0]);
        }

    }

    processDocument(path: string): void {
        console.log(`Will try to process document at path: ${path}`);
    }

    extractRecipent(): Recipent {
        return null;
    }

}