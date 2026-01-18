const { app, BrowserWindow, session, Tray, screen } = require("electron");

// function getPositioning() {
//   const {screen} = require("electron");
//   const primaryDisplay = screen.getPrimaryDisplay();
//   const bounds = primaryDisplay.bounds;
//   const workArea = primaryDisplay.workArea;

//   let taskbarPosition;
//   let taskbarSize;

//   if (bounds.width > workArea.width) { // Taskbar is on the left or right
//     taskbarSize = bounds.width - workArea.width;
//     if (workArea.x > 0) {
      
//       taskbarPosition = 'Left';
//     } else {
//       taskbarPosition = 'Right';
//     }
//   } else if (bounds.height > workArea.height) { // Taskbar is on the top or bottom
//     taskbarSize = bounds.height - workArea.height;
//     if (workArea.y > 0) {
//       taskbarPosition = 'Top';
//     } else {
//       taskbarPosition = 'Bottom';
//     }
//   } else {
//     taskbarPosition = 'Unknown/Auto-hidden';
//     taskbarSize = 0;
//   }
// }

function createWindow() {
  const PrimaryDisplay = screen.getPrimaryDisplay();

  const workArea = PrimaryDisplay.workArea;
  
  const {width: workAreaWidth, height: workAreaHeight} = PrimaryDisplay.workAreaSize;

  const winWidth = workAreaWidth;
  const winHeight = workAreaHeight;
  
  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: workArea.x,
    y: workArea.y,
    kiosk: false, // IMPORTANT: not true
    fullscreen: false,
    alwaysOnTop: false, // user can switch apps
    autoHideMenuBar: true,
    minimizable: false,
    closable: false,
    movable: false,
    resizable: false,
    frame: false,
    skipTaskbar: true,  
    icon: __dirname + "/assets/favicon-310x310.png",
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
  // win.webContents.openDevTools();
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
    // console.log('did-finish-load triggered');
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
