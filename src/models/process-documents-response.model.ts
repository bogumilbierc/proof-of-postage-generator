export interface ProcessDocumentsResponse {
    success?: ProcessedDocument[];
    failure?: ProcessedDocument[];
}

export interface ProcessedDocument {
    path: string;
    recipient?: string[];
}