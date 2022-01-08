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
      },
      alignRight: {
        alignment: 'right'
      }
    };

    const images = {
      circle: __dirname + '/images/circle.png'
    }

    const docDefinition: TDocumentDefinitions = {
      content: recipients.map((recipient: Recipient) => this.createContentEntryForSingleRecipient(sender, recipient, caseSignature)),
      styles,
      images
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
