import { LocalPdfGenerator } from '../../../src/services/pdf/local-pdf-generator';

describe('LocalPdfGenerator', () => {

  it('should generate PDF file', () => {
    const pdfGenerator = new LocalPdfGenerator();
    pdfGenerator.generatePdf();
  })

});
