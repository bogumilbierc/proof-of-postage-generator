import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { DocumentProcessor } from './services/document-processor';
import { PreferencesService } from './services/preferences-service';
import { RecipientExtractor } from './services/recipient-extractor';
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// register events
ipcMain.on('processSingleFileButtonClick', async () => {
  await new DocumentProcessor(new RecipientExtractor()).openAndProcessDocument();
});

ipcMain.on('processListOfFiles', async (event, arg) => {
  console.log(arg);
  return Promise.resolve('test');
});


/**
 * Senders integration
 */
ipcMain.on('getListOfSenders', (event, arg) => {
  event.returnValue = new SenderStore(new PreferencesService(app)).getAllSenders();
});

ipcMain.on('addSender', (event, arg) => {
  event.returnValue = new SenderStore(new PreferencesService(app)).addSender(arg);
});

ipcMain.on('deleteSender', (event, arg) => {
  event.returnValue = new SenderStore(new PreferencesService(app)).deleteSender(arg);
});

ipcMain.on('setSenderAsDefault', (event, arg) => {
  event.returnValue = new SenderStore(new PreferencesService(app)).setSenderAsDefault(arg);
})

/**
 * Preferences integration
 */
ipcMain.on('getPreferences', (event, arg) => {
  event.returnValue = new PreferencesService(app).getUserPreferences();
});

ipcMain.on('savePreferences', (event, arg) => {
  event.returnValue = new PreferencesService(app).storeUserPreferences(arg);
});

ipcMain.on('changeSenderFileLocation', (event, arg) => {
  event.returnValue = new PreferencesService(app).changeSendersFileLocation();
});
