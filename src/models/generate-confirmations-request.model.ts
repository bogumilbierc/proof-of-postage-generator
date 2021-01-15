import { ProcessedDocument } from "./processed-document.model";

export interface GenerateConfirmationsRequest {
    sender: string;
    documents: ProcessedDocument[];
}