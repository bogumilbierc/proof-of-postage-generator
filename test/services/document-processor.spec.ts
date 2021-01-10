import { ProcessDocumentsRequest } from '../../src/models/process-documents-request.model';
import { ProcessedDocument } from '../../src/models/processed-document.model';
import { DocumentProcessor } from '../../src/services/document-processor';
import { RecipientExtractor } from '../../src/services/recipient-extractor';


describe('DocumentProcessor', () => {

    const recipientExtractorSpy = new RecipientExtractor();
    const processor = new DocumentProcessor(recipientExtractorSpy);

    it('should not process documents with unsupported extensions', async () => {
        const request: ProcessDocumentsRequest = {
            paths: [
                '/home/test/unsupported.pdf',
                '/home/test/unsupported.jpg'
            ],
            sender: 'SomeSenderName'
        };

        const expected: ProcessedDocument[] = [
            {
                path: '/home/test/unsupported.pdf',
                success: false,
                message: "FileType unsupported. Supported file types are: [\"doc\",\"docx\",\"odt\"]"
            },
            {
                path: '/home/test/unsupported.jpg',
                success: false,
                message: "FileType unsupported. Supported file types are: [\"doc\",\"docx\",\"odt\"]"
            }
        ]

        const result = await processor.processRequest(request);
        expect(result).toEqual(expected);
    })

})