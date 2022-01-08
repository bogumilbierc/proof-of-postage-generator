import { LocalPdfGenerator } from '../../../src/services/pdf/local-pdf-generator';
import { Sender } from '../../../src/services/sender-store';
import { Recipient } from '../../../src/models/recipient.model';

describe('LocalPdfGenerator', () => {

  it('should generate PDF file', () => {
    const pdfGenerator = new LocalPdfGenerator();

    const sender: Sender = {
      address: [
        'Adam Słodowy',
        'ul. Słonecznikowa 13',
        '00-300 Warszawa'
      ],
      name: 'Dupa'
    }

    const recipients: Recipient[] = [
      {
        address: [
          'Odbiorca Testowy 1',
          'Spółka z o.o.',
          'ul. Lata z radiem 13/12',
          '11-200 Dupa blada'
        ],
        priorityShipment: true
      },
      {
        address: [
          'Odbiorca Testowy 1',
          'Spółka z o.o.',
          'ul. Lata z radiem 13/12',
          '11-200 Dupa blada'
        ],
        priorityShipment: true
      },
      {
        address: [
          'Odbiorca Testowy 1 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          'Spółka z o.o.',
          'ul. Lata z radiem 13/12 długi długi długi adres aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          '11-200 Dupa blada'
        ],
        priorityShipment: false
      }
    ]

    pdfGenerator.generatePdf(sender, recipients, '/home/bogumil/tables.pdf');
  })

});
