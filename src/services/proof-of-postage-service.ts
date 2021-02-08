import * as log from 'electron-log';
import * as path from 'path';
import { DocumentType } from '../models/document-type.enum';
import { GenerateConfirmationsRequest } from '../models/generate-confirmations-request.model';
import { ProcessedDocument } from "../models/processed-document.model";
import { Recipient } from '../models/recipient.model';
import { PdfGenerator } from "./pdf-generator";
import { PreferencesService } from './preferences-service';
import { Sender, SenderStore } from "./sender-store";
import { XlsxGenerator as XlsxGenerator } from './xlsx-generator';
import fs = require('fs');

export class ProofOfPostageService {

    constructor(
        private readonly pdfGenerator: PdfGenerator,
        private readonly sendersStore: SenderStore,
        private readonly preferencesService: PreferencesService,
        private readonly xlsxGenerator: XlsxGenerator) {

    }

    async processRequest(request: GenerateConfirmationsRequest, documentType = DocumentType.PDF): Promise<ProcessedDocument[]> {
        log.debug(`ProofOfPostageService: Processing request: ${JSON.stringify(request)}`);
        const sender = this.sendersStore.getSender(request.sender);
        log.debug(`ProofOfPostageService: Got sender details: ${JSON.stringify(sender)}`);

        const processedDocuments = request.documents;

        for (const document of processedDocuments) {
            document.fileName = document.fileName || path.parse(document.path).name;
            if (document?.recipients?.length) {
                const confirmationPath = this.getConfirmationFilePath(document.fileName, documentType)
                document.confirmationLocation = confirmationPath;

                document.pdfGenerated = await this.generateFile(sender, document.recipients, confirmationPath, documentType);
            } else {
                log.debug(`Document: ${document.fileName} does not have recipients, skipping it`);
                document.pdfGenerated = false;
            }
        }
        log.debug(`ProofOfPostageService: All documents processed`);
        return processedDocuments;
    }

    private async generateFile(sender: Sender, recipients: Recipient[], targetFilePath: string, documentType: DocumentType): Promise<boolean> {
        if (documentType === DocumentType.PDF) {
            return await this.pdfGenerator.safelyGenerateFile(sender, recipients, targetFilePath);
        }
        return await this.xlsxGenerator.safelyGenerateFile(sender, recipients, targetFilePath);
    }

    private getConfirmationFilePath(filename: string, documentType: DocumentType): string {

        if (documentType === DocumentType.PDF) {
            return path.join(
                this.getConfirmationsFolderLocation(),
                `${filename}_potwierdzenie.pdf`
            );
        }
        return path.join(
            this.getConfirmationsFolderLocation(),
            `${filename}_odbiorcy.xlsx`
        );
    }

    private getConfirmationsFolderLocation(): string {
        const rootConfirmationsFolder = this.preferencesService.getUserPreferences().confirmationsLocation;
        const date = new Date();
        const day = `${date.getDate()}`.padStart(2, '0');
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const year = date.getFullYear();
        const folderPath = path.join(
            rootConfirmationsFolder,
            `${year}_${month}_${day}`
        );
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        return folderPath;
    }
}