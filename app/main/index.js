const { app, BrowserWindow, globalShortcut, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { getPermission } = require('./utils/comm');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

if (require('electron-squirrel-startup')) {
  app.quit();
}

app.commandLine.appendSwitch('disable-hid-blocklist');

function findHidrawPath() {
  for (let i = 0; i < 20; i++) {
    const devPath = `/dev/hidraw${i}`;
    if (!fs.existsSync(devPath)) continue;
    try {
      const ueventPath = `/sys/class/hidraw/hidraw${i}/device/uevent`;
      if (fs.existsSync(ueventPath)) {
        const uevent = fs.readFileSync(ueventPath, 'utf8');
        // Match 30fa:1040 (case-insensitive)
        if (/30fa.*1040/i.test(uevent) || /1040.*30fa/i.test(uevent)) {
          // Check report descriptor for 0xFF01 or usage 0x07
          const rdescPath = `/sys/class/hidraw/hidraw${i}/device/report_descriptor`;
          if (fs.existsSync(rdescPath)) {
            const rdesc = fs.readFileSync(rdescPath);
            // Look for usage page 0xFF01 (0x06, 0x01, 0xFF) or report ID 0x07
            for (let j = 0; j < rdesc.length - 2; j++) {
              if (rdesc[j] === 0x06 && rdesc[j+1] === 0x01 && rdesc[j+2] === 0xff) {
                return devPath;
              }
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return null;
}

let activeHidrawFd = null;
function getHidrawFd() {
  if (activeHidrawFd !== null) {
    return activeHidrawFd;
  }
  const devPath = findHidrawPath();
  if (devPath) {
    try {
      activeHidrawFd = fs.openSync(devPath, 'r+');
      return activeHidrawFd;
    } catch (e) {
      console.warn('Could not open hidraw device directly:', e.message);
    }
  }
  return null;
}

// Fallback ioctl handlers via IPC
ipcMain.handle('hid:isAvailable', async () => {
  return findHidrawPath() !== null;
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 980,
    minHeight: 640,
    title: 'Mouse Slits V2 - Linux Configurator',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      zoomFactor: 1.0
    },
    icon: path.resolve(__dirname, './assets/icon.png')
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.setZoomFactor(1);
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
    mainWindow.webContents.setZoomLevel(0);
  });

  mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
    event.preventDefault();
    if (details.deviceList && details.deviceList.length > 0) {
      for (const device of details.deviceList) {
        if (getPermission(device.vendorId, device.productId)) {
          // Select interface with usagePage 0xFF01 or collection with reportId 7
          const hasConfigCollection = device.collections?.some(c => 
            c.usagePage === 0xff01 || c.featureReports?.some(r => r.reportId === 7)
          );
          if (hasConfigCollection || details.deviceList.length === 1) {
            callback(device.deviceId);
            return;
          }
        }
      }
      // Fallback: pick first matching VID/PID
      const matched = details.deviceList.find(d => getPermission(d.vendorId, d.productId));
      if (matched) {
        callback(matched.deviceId);
      }
    }
  });

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (details && details.device) {
      if (permission === 'hid' && getPermission(details.device.vendorId, details.device.productId)) {
        return true;
      }
    }
    return true;
  });

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details && details.device) {
      if (details.deviceType === 'hid' && getPermission(details.device.vendorId, details.device.productId)) {
        return true;
      }
    }
    return true;
  });

  mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (activeHidrawFd !== null) {
    try { fs.closeSync(activeHidrawFd); } catch(e){}
    activeHidrawFd = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('web-contents-created', (e, webContents) => {
  webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});
