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
        return this.documentProcessor.processRequest(request);
    }
}