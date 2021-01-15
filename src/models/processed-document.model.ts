import { Recipient } from "./recipient.model";

export interface ProcessedDocument {
    path: string;
    fileName?: string;
    success?: boolean;
    message?: string;
    pdfGenerated?: boolean;
    confirmationLocation?: string;
    recipients?: Recipient[];
}