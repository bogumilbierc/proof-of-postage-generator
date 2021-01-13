import { Recipient } from "./recipient.model";

export interface ProcessedDocument {
    path: string;
    recipient?: string[];
    success?: boolean;
    message?: string;
    pdfGenerated?: boolean;
    confirmationLocation?: string;
    recipients?: Recipient[];
}