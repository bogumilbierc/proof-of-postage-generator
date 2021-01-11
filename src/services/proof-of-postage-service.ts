import * as log from 'electron-log';
import { ProcessDocumentsRequest } from "../models/process-documents-request.model";
import { ProcessedDocument } from "../models/processed-document.model";
import { DocumentProcessor } from "./document-processor";
import { PdfGenerator } from "./pdf-generator";
import { SenderStore } from "./sender-store";

export class ProofOfPostageService {

    constructor(
        private readonly documentProcessor: DocumentProcessor,
        private readonly pdfGenerator: PdfGenerator,
        private readonly sendersStore: SenderStore) {

    }

    async processRequest(request: ProcessDocumentsRequest): Promise<ProcessedDocument[]> {
        log.debug(`ProofOfPostageService: Processing request: ${JSON.stringify(request)}`);
        const sender = this.sendersStore.getSender(request.sender);
        log.debug(`ProofOfPostageService: Got sender details: ${JSON.stringify(sender)}`);
        const processedDocuments: ProcessedDocument[] = await this.documentProcessor.processRequest(request);
        log.debug(`ProofOfPostageService: Documents processed: ${JSON.stringify(processedDocuments)}`);
        // const downloadFilePromises = processedDocuments
        //     .filter((document: ProcessedDocument) => document.success)
        //     .map((document: ProcessedDocument) => {
        //         this.pdfGenerator.safelyGenerateFile(sender, document.recipient, document.path + '_confirmatio.pdf');
        //     });
        // log.debug(`ProofOfPostageService: Created promises for file downloading`);
        // await Promise.all(downloadFilePromises);
        await this.pdfGenerator.safelyGenerateFile(sender, processedDocuments[0].recipient, processedDocuments[0].path + '_confirmatio.pdf');

        log.debug(`ProofOfPostageService: File downloading promises resolved`);
        return processedDocuments;
    }
}