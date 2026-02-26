const { app, BrowserWindow, session } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load GitHub
  win.loadURL('https://github.com');

  // Optional: show dev tools
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Allow HID access for hardware security keys
  session.defaultSession.on('select-hid-device', (event, details, callback) => {
    event.preventDefault();
    // Auto-select the first available HID device (or build a picker UI)
    callback(details.deviceList[0]?.deviceId);
  });

  session.defaultSession.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'hid') return true;
    return false;
  });

  createWindow();
  
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});