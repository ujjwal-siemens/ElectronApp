const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const osUtils = require('os-utils');
const path = require('path');
const os = require('os');
const {dialog} = require('electron');
const ipcMain = require('electron').ipcMain;
const Menu = require('electron').Menu;
const MenuItem = require('electron').MenuItem;

const { autoUpdater, AppUpdater } = require('electron-updater');
const log = require('electron-log');
log.transports.file.resolvePath = () => path.join('C:/workdir/Electron_Project/cool-app', 'logs/main.log');
log.info('Hello, log');
log.warn('Some thing is wrong');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: __dirname + '/icon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.openDevTools();

  /* setInterval(() => {
    osUtils.cpuUsage((v)=> {
      mainWindow.webContents.send('cpu', v*100);
      mainWindow.webContents.send('mem', osUtils.freememPercentage()*100);
      mainWindow.webContents.send('total-mem', osUtils.totalmem()/1024);
    });
  }, 1000); */

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createWindow();

  const template = [
    {
      label: 'demo',
      submenu: [
        {
          label: 'submenu1',
          click: function(){
            console.log('Clicked submenu 1');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'submenu2'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'Help',
      click: function() {
        electron.shell.openExternal('http://www.google.com');
      }
    } 
  ]

  const customMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(customMenu);

  const ctxMenu = new Menu();
  ctxMenu.append(new MenuItem({
    label: 'Hello',
    click: function(){
      console.log('Context menu item clicked');
    }
  }));

  ctxMenu.append(new MenuItem({
    role: 'selectall'
  }));

  mainWindow.webContents.on('context-menu', function(event, params){
    ctxMenu.popup(mainWindow, params.x, params.y);
  });

  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-available',()=>{
  log.info('update-available');
});

autoUpdater.on('checking-for-update',()=>{
  log.info('checking-for-update');
});

autoUpdater.on('download-progress',()=>{
  log.info('download-progress');
});

autoUpdater.on('update-downloaded',()=>{
  log.info('update-downloaded');
});

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

// retrive the event that is send by the renderer process
ipcMain.on('open-file-dialog', (event) => {
  //dialog.showErrorBox('An error message', 'Demo of an error message');
  //event.sender.send('selected-file', 'Main process opened the message dialog');
    
  let files = dialog.showOpenDialogSync({properties: ['openFile']});
  event.sender.send('selected-file', files[0]);
});

const axios = require('axios');
ipcMain.on('fetch-data', async (event,url) => {
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    event.reply('fetch-data-response', response.data);
  }
  catch(error) {
    console.error(error);
  }
});