import { app, BrowserWindow } from 'electron';
import path from 'path';
import cors from 'cors';

import crypto from 'crypto';

import express from 'express';
import expressSession from 'express-session';
import { loginGachon } from './gachon/login';
import { GachonLoginSession, GachonUserData } from './gachon/interface';
import { getTimetable } from './gachon/timetable';
import { CookieJar } from 'tough-cookie';

import axios from 'axios';
import { default as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { registerRouter } from './router';
import { registerShellRouter } from './router/shell';

axiosCookieJarSupport(axios);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../public/index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
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

const expressApp = express();

const secret = new Buffer(crypto.randomBytes(8)).readBigUInt64BE();

expressApp.use(cors());
expressApp.use(expressSession({
  secret: secret.toString()
}));

registerRouter(expressApp);
registerShellRouter(expressApp);

// 이스터에그: 이길여길여 -> 이-일-오-일-오
expressApp.listen(21515, "localhost");
