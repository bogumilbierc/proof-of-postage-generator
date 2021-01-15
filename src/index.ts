import { app, BrowserWindow, ipcMain } from 'electron';
import * as log from 'electron-log';
import * as path from 'path';
import { AddressLinesExtractor } from './services/document-recipients/address-lines-extractor';
import { AddressRefiner } from './services/document-recipients/address-refiner';
import { DocumentProcessor } from './services/document-recipients/document-processor';
import { MultipleRecipientsExtractor } from './services/document-recipients/multiple-recipients-extractor';
import { PdfGenerator } from './services/pdf-generator';
import { PreferencesService } from './services/preferences-service';
import { ProofOfPostageService } from './services/proof-of-postage-service';
import { SenderStore } from './services/sender-store';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 900,
    webPreferences: {
      nodeIntegration: true,
      plugins: true
    },
    icon: path.join(__dirname, '../src/assets/icon.png')
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../src/views/index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


const preferencesService = new PreferencesService(app);
const senderStore = new SenderStore(preferencesService);
const addressLinesExtractor = new AddressLinesExtractor();
const addressRefiner = new AddressRefiner();
const recipientExtractor = new MultipleRecipientsExtractor(addressLinesExtractor, addressRefiner);
const documentProcessor = new DocumentProcessor(recipientExtractor);
const pdfGenerator = new PdfGenerator();
const proofOfPostageService = new ProofOfPostageService(documentProcessor, pdfGenerator, senderStore, preferencesService);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// register events
ipcMain.on('processDocuments', async (event, arg) => {
  log.debug(`Got request to process: ${JSON.stringify(arg)}`);
  event.reply('processDocumentsResponse', await proofOfPostageService.processRequest(arg))
});

/**
 * Senders integration
 */
ipcMain.on('getListOfSenders', (event,) => {
  event.returnValue = senderStore.getAllSenders();
});

ipcMain.on('addSender', (event, arg) => {
  event.returnValue = senderStore.addSender(arg);
});

ipcMain.on('deleteSender', (event, arg) => {
  event.returnValue = senderStore.deleteSender(arg);
});

ipcMain.on('setSenderAsDefault', (event, arg) => {
  event.returnValue = senderStore.setSenderAsDefault(arg);
})

/**
 * Preferences integration
 */
ipcMain.on('getPreferences', (event,) => {
  event.returnValue = preferencesService.getUserPreferences();
});

ipcMain.on('savePreferences', (event, arg) => {
  event.returnValue = preferencesService.storeUserPreferences(arg);
});

ipcMain.on('changeSenderFileLocation', (event,) => {
  event.returnValue = preferencesService.changeSendersFileLocation();
});

ipcMain.on('changeConfirmationsLocation', (event,) => {
  event.returnValue = preferencesService.changeConfirmationsLocation();
})