import { ProcessDocumentsRequest } from '../../../src/models/process-documents-request.model';
import { ProcessedDocument } from '../../../src/models/processed-document.model';
import { AddressLinesExtractor } from '../../../src/services/document-recipients/address-lines-extractor';
import { AddressRefiner } from '../../../src/services/document-recipients/address-refiner';
import { DocumentProcessor } from '../../../src/services/document-recipients/document-processor';
import { MultipleRecipientsExtractor } from '../../../src/services/document-recipients/multiple-recipients-extractor';


describe('DocumentProcessor', () => {

    const recipientExtractorSpy = new MultipleRecipientsExtractor(new AddressLinesExtractor(), new AddressRefiner());
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