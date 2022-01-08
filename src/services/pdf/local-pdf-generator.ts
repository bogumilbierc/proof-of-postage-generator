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
              ...this.mapBottomPartOfConfirmationTable(true)
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
        },
        alignRight: {
          alignment: 'right'
        }
      },
      images: {
        circle: __dirname + '/images/circle.png'
      }

    }

    console.log('Starting PDF Generation')
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('/home/bogumil/tables.pdf'));
    pdfDoc.end();
    console.log('Done PDF Generation')
  }

  private mapBottomPartOfConfirmationTable(priority?: boolean): TableCell[][] {

    const deliveryConfirmationCheckboxRow: TableCell[] = this.createRowWithTableAndColSpan(
        [...this.createCheckbox('Potwierdzenie doręczenia albo zwrotu', false)]
    );

    const receiveConfirmationAndPrioritaireCheckboxRow: TableCell[] = this.createRowWithTableAndColSpan(
        [...this.createCheckbox('Potwierdzenie odbioru', false), ...this.createCheckbox('Priorytetowa', priority)]
    );

    const sizingRow: TableCell[] = this.createRowWithTableAndColSpan(
        [...this.createCheckbox('A', false), ...this.createCheckbox('B', false), {text: 'Gabaryt', border: Borders.NO_BORDER}]
    );

    const stampCircleRow: TableCell[] =
        [{text: ' ', border: Borders.LEFT}, {image: 'circle', border: Borders.RIGHT, style: {alignment: 'right'}}]

    const weightAndPriceRow: TableCell[] = this.createRowWithTableAndColSpan(
        [{text: 'Masa .............kg........g', border: Borders.NO_BORDER}, {text: 'Opłata..........zł....gr', border: Borders.NO_BORDER}]
    );

    const confirmationBottomSectionsCells: TableCell[][] = [
      deliveryConfirmationCheckboxRow,
      [{text: 'SMS/E-MAIL .........................................................', colSpan: 2, border: Borders.LEFT_AND_RIGHT}, {}],
      receiveConfirmationAndPrioritaireCheckboxRow,
      sizingRow,
      stampCircleRow,
      weightAndPriceRow,
      [{text: 'Na stronie https://sledzenie.poczta-polska.pl mozna sprawdzić status nadanej przesyłki rejestrowanej', colSpan: 2, border: Borders.LEFT_RIGHT_BOTTOM, style: 'smallText'}, {}]
    ]

    return confirmationBottomSectionsCells;
  }

  private createRowWithTableAndColSpan(innerTableBodyRow: TableCell[]): TableCell[] {
    return [{
      table: {
        body: [innerTableBodyRow]
      },
      colSpan: 2,
      border: Borders.LEFT_AND_RIGHT
    }, {}];
  }

  private createCheckbox(text: string, checked: boolean): TableCell[] {
    const checkboxElement = checked ? CommonElements.CHECKED_CHECKBOX : CommonElements.UNCHECKED_CHECKBOX;
    return [checkboxElement, {text: text, border: Borders.NO_BORDER}]
  }

}
