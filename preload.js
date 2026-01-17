const { contextBridge, ipcRenderer } = require('electron');

// window.addEventListener('DOMContentLoaded', () => {
//   const script = document.createElement('script');
//   script.textContent = `
//     window.open = (function(url) {
//       if(window.pos && window.pos.openUrlForPrint) {
//         window.pos.openUrlForPrint(url);
//       }
//       return null;
//     });`;
//     document.documentElement.appendChild(script);
//     script.remove();
// });

// contextBridge.exposeInMainWorld('pos', {
//   openUrlForPrint: (url) => ipcRenderer.send('open-url-for-print', url),  
// });

