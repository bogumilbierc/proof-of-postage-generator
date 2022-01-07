import * as fs from 'fs';
import PdfPrinter from 'pdfmake';
// eslint-disable-next-line import/no-unresolved
import { TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';

export class Borders {
  static readonly NO_BORDER = [false, false, false, false];
  static readonly LEFT_AND_RIGHT = [true, false, true, false];
  static readonly LEFT_RIGHT_BOTTOM = [true, false, true, true];
  static readonly LEFT_RIGHT_TOP = [true, true, true, false];
  static readonly LEFT = [true, false, false, false];
  static readonly RIGHT = [false, false, true, false];
  static readonly LEFT_AND_BOTTOM = [true, false, false, true];
  static readonly RIGHT_AND_BOTTOM = [false, false, true, true];
}

export class CommonElements {
  static readonly UNCHECKED_CHECKBOX: TableCell = {text: '---', style: 'invisibleText'}
  static readonly CHECKED_CHECKBOX: TableCell = {text: 'X'}
}

export class LocalPdfGenerator {

  generatePdf(): void {
    const fonts = {
      Roboto: {
        normal: __dirname + '/fonts/Roboto-Regular.ttf',
        bold: __dirname + '/fonts/Roboto-Medium.ttf',
        italics: __dirname + '/fonts/Roboto-Italic.ttf',
        bolditalics: __dirname + '/fonts/Roboto-MediumItalic.ttf'
      }
    };
    const printer = new PdfPrinter(fonts);

    const confirmationTopSectionCells: TableCell[][] = [
      [{text: 'POTWIERDZENIE NADANIA', style: 'tableHeader', colSpan: 2, border: Borders.LEFT_RIGHT_TOP}, {}],
      [{text: 'przesyłki poleconej nr', style: 'tableHeader', colSpan: 2, border: Borders.LEFT_AND_RIGHT}, {}],
      [{text: 'Nadawca:', style: 'tableHeader', border: Borders.LEFT}, {text: 'Testowy Tester\nZadupie 123\n00-200 Zadup', border: Borders.RIGHT}],
      [{text: 'Adresat:', style: 'tableHeader', border: Borders.LEFT_AND_BOTTOM}, {text: 'Testowy Tester\nZadupie 123\n00-200 Zadup', border: Borders.RIGHT_AND_BOTTOM}]
    ]


    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          table: {
            widths: [70, 200],
            body: [
              ...confirmationTopSectionCells,
              ...this.mapBottomPartOfConfirmationTable()
            ]
          }
        },

      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        },
        smallText: {
          bold: false,
          fontSize: 8,
          color: 'black'
        },
        invisibleText: {
          color: 'white',
          fontSize: 10
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }

    }

    console.log('Starting PDF Generation')
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('/home/bogumil/tables.pdf'));
    pdfDoc.end();
    console.log('Done PDF Generation')
  }

  private mapBottomPartOfConfirmationTable(priority?: boolean): TableCell[][] {

    const priorityCheckbox = priority ? CommonElements.CHECKED_CHECKBOX : CommonElements.UNCHECKED_CHECKBOX;

    const deliveryConfirmationCheckboxRow: TableCell[] = [{
      table: {
        body: [
          [CommonElements.UNCHECKED_CHECKBOX, {text: 'Potwierdzenie doręczenia albo zwrotu', border: Borders.NO_BORDER}]
        ]
      },
      colSpan: 2,
      border: Borders.LEFT_AND_RIGHT
    }, {}];

    const receiveConfirmationAndPrioritaireCheckboxRow: TableCell[] =
        [{
          table: {
            body: [
              [CommonElements.UNCHECKED_CHECKBOX, {text: 'Potwierdzenie odbioru', border: Borders.NO_BORDER}, priorityCheckbox, {text: 'Priorytetowa', border: Borders.NO_BORDER}]
            ]
          },
          colSpan: 2,
          border: Borders.LEFT_AND_RIGHT
        }, {}];

    const sizingRow: TableCell[] =
        [{
          table: {
            body: [
              [CommonElements.UNCHECKED_CHECKBOX, {text: 'A', border: Borders.NO_BORDER}, CommonElements.UNCHECKED_CHECKBOX, {text: 'B', border: Borders.NO_BORDER}, {
                text: 'Gabaryt',
                border: Borders.NO_BORDER
              }]
            ]
          },
          colSpan: 2,
          border: Borders.LEFT_AND_RIGHT
        }, {}];

    const weightAndPriceRow: TableCell[] = [
      {
        table: {
          body: [
            [{text: 'Masa .............kg........g', border: Borders.NO_BORDER}, {text: 'Opłata..........zł....gr', border: Borders.NO_BORDER}]
          ]
        },
        colSpan: 2,
        border: Borders.LEFT_AND_RIGHT
      }, {}
    ]

    const confirmationBottomSectionsCells: TableCell[][] = [
      deliveryConfirmationCheckboxRow,
      [{text: 'SMS/E-MAIL .........................................................', colSpan: 2, border: Borders.LEFT_AND_RIGHT}, {}],
      receiveConfirmationAndPrioritaireCheckboxRow,
      sizingRow,
      weightAndPriceRow,
      [{text: 'Na stronie https://sledzenie.poczta-polska.pl mozna sprawdzić status nadanej przesyłki rejestrowanej', colSpan: 2, border: Borders.LEFT_RIGHT_BOTTOM, style: 'smallText'}, {}]
    ]

    return confirmationBottomSectionsCells;
  }

}
