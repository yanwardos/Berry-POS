const { app, BrowserWindow, session } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 1080,
    x: 100,
    y: 0,
    kiosk: false, // IMPORTANT: not true
    fullscreen: false,
    alwaysOnTop: false, // user can switch apps
    autoHideMenuBar: true,
    closable: false,
    movable: false,
    resizable: false,
    webPreferences: {
      preload: __dirname + "/preload.js",
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // win.webContents.on("did-start-loading", () => {
  //   console.log("PAGE START LOADING");
  //   win.webContents.executeJavaScript(`
  //     (function () {
  //     const originalOpen = window.open;
  //     window.open = function (url, target, features) {
  //       console.log('window.open hijacked:', url);
  //       if (window.pos && window.pos.printUrl) {
  //         window.pos.printUrl(url);
  //       }
  //       return null;
  //     };
  //   })();
  //   `, true);
  // });

  win.loadURL("https://erp.berryprinting.my.id/pos");

  // Optional: open devtools for sanity
  win.webContents.openDevTools();
}

const { ipcMain } = require("electron");

let isPrintWindowOpen = false;
ipcMain.on("open-url-for-print", (event, url) => {
  if (isPrintWindowOpen) return;
  isPrintWindowOpen = true;
  const currentURL = new URL(event.sender.getURL());
  url = currentURL.origin + url; // OVERRIDE URL WITH SENDER URL

  const printWin = new BrowserWindow({
    show: true,
    webPreferences: {
      // preload: __dirname + "/preload_nested.js",
      contextIsolation: true,
    },
  });

  printWin.on("closed", () => {
    isPrintWindowOpen = false;
  });

  printWin.webContents.on("did-start-loading", () => {
    
    // printWin.webContents.executeJavaScript(
    //   `
    //     (function () {
    //       console.log("OVERWRITE PRINT FUNCTION IN NESTED");
    //       const originalPrint = window.print;
    //       window.print = function () {
    //         console.log("PRINT FUNCTION OVERRIDDEN");
    //       };
    //       return null;
    //     })();
    //   `,
    //   true,
    // );
  });

  printWin.webContents.on("did-finish-load", () => {
    console.log('did-finish-load triggered');
    // printWin.webContents.print(
    //   {
    //       printBackground: false,
    //       deviceName: 'PDF24',
    //       pageSize: 'A6',
    //       orientation: 'portrait',
    //   },
    // );
  });

  printWin.loadURL(url);
  printWin.webContents.openDevTools();
});

app.whenReady().then(() => {
  // Disable print dialogs globally
  // session.defaultSession.setPrintSettings({
  //   silent: true,
  //   printBackground: true
  // });
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      // if (permission === "print") {
      //   return callback(true); // Approve print permission
      // }
    },
  );

  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
