import * as fs from 'fs';
import PdfPrinter from 'pdfmake';
// eslint-disable-next-line import/no-unresolved
import { Content, StyleDictionary, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import { Sender } from '../sender-store';
import { Recipient } from '../../models/recipient.model';

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

export class Images {
  static readonly CIRCLE = 'data:image/png;base64,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'
}

export class LocalPdfGenerator {

  generatePdf(sender: Sender, recipients: Recipient[], saveLocation: string, caseSignature?: string): void {
    console.log('Starting PDF Generation')
    const fonts = {
      Roboto: {
        normal: __dirname + '/fonts/Roboto-Regular.ttf',
        bold: __dirname + '/fonts/Roboto-Medium.ttf',
        italics: __dirname + '/fonts/Roboto-Italic.ttf',
        bolditalics: __dirname + '/fonts/Roboto-MediumItalic.ttf'
      }
    };
    const printer = new PdfPrinter(fonts);


    const pdfDoc = printer.createPdfKitDocument(this.createDocumentDefinition(sender, recipients, caseSignature));
    pdfDoc.pipe(fs.createWriteStream(saveLocation));
    pdfDoc.end();
    console.log('Done PDF Generation')
  }

  createDocumentDefinition(sender: Sender, recipients: Recipient[], caseSignature?: string): TDocumentDefinitions {
    const styles: StyleDictionary = {
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
    };

    const docDefinition: TDocumentDefinitions = {
      content: recipients.map((recipient: Recipient) => this.createContentEntryForSingleRecipient(sender, recipient, caseSignature)),
      styles
    }

    return docDefinition;
  }

  private createContentEntryForSingleRecipient(sender: Sender, recipient: Recipient, caseSignature?: string): Content {

    const recipientAddressLines = recipient.address.join('\n');
    const recipientAddress = caseSignature ? recipientAddressLines + `\nSygnatura sprawy: ${caseSignature}` : recipientAddressLines;

    const confirmationTopSectionCells: TableCell[][] = [
      [{text: 'POTWIERDZENIE NADANIA', style: 'tableHeader', colSpan: 2, border: Borders.LEFT_RIGHT_TOP}, {}],
      [{text: 'przesyłki poleconej nr', style: 'tableHeader', colSpan: 2, border: Borders.LEFT_AND_RIGHT}, {}],
      [{text: 'Nadawca:', style: 'tableHeader', border: Borders.LEFT}, {text: sender.address.join('\n'), border: Borders.RIGHT}],
      [{text: 'Adresat:', style: 'tableHeader', border: Borders.LEFT_AND_BOTTOM}, {text: recipientAddress, border: Borders.RIGHT_AND_BOTTOM}]
    ]

    return {
      table: {
        widths: [70, 200],
        body: [
          ...confirmationTopSectionCells,
          ...this.mapBottomPartOfConfirmationTable(recipient.priorityShipment)
        ],
      },
      unbreakable: true
    };
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
        [{text: ' ', border: Borders.LEFT}, {image: Images.CIRCLE, border: Borders.RIGHT, style: {alignment: 'right'}}]

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
