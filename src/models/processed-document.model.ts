export interface ProcessedDocument {
    path: string;
    recipient?: string[];
    success?: boolean;
    message?: string;
}