import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import * as path from "path";
import * as fs from "fs";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const settingsPath = path.join(app.getPath("userData"), "settings.json");

if (!fs.existsSync(settingsPath)) {
  const defaultSettings = {
    defaultPath:
      "C:/Riot Games/League of Legends/Config/PersistedSettings.json",
  };
  fs.writeFileSync(
    settingsPath,
    JSON.stringify(defaultSettings, null, 2),
    "utf-8"
  );
}

const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  Menu.setApplicationMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

ipcMain.handle("read-config", async (event, filePath) => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  throw new Error("File not found.");
});

ipcMain.handle("check-default-path", () => {
  // Dosya yoksa varsayılan ayarları oluştur

  // Ayarları oku ve geri döndür
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  if (fs.existsSync(settings.defaultPath)) {
    return JSON.parse(fs.readFileSync(settings.defaultPath, "utf-8"));
  }
  return null;
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "Select League of Legends folder",
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    const persistedSettingsPath = path.join(
      selectedPath,
      "Config",
      "PersistedSettings.json"
    );

    if (fs.existsSync(persistedSettingsPath)) {
      const settings = { defaultPath: persistedSettingsPath };
      fs.writeFileSync(
        settingsPath,
        JSON.stringify(settings, null, 2),
        "utf-8"
      );

      return JSON.parse(fs.readFileSync(persistedSettingsPath, "utf-8"));
    } else {
      throw "Config file not found make sure you choose the correct folder!";
    }
  } else {
    throw "Folder selection canceled.";
  }
});

ipcMain.handle("save-config", async (event, values, name) => {
  const savePath = path.join(app.getPath("userData"), "configs");
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }

  const fileName = `${name || `config-${Date.now()}`}.json`; // Kullanıcı adı veya benzersiz ad
  const filePath = path.join(savePath, fileName);

  fs.writeFileSync(filePath, JSON.stringify(values, null, 2), "utf-8");
  return filePath;
});

ipcMain.handle("save-readonly-config", async (event, configData) => {
  try {
    fs.writeFileSync(
      settings.defaultPath,
      JSON.stringify(configData, null, 2),
      "utf-8"
    );
    fs.chmodSync(settings.defaultPath, 0o444); // Read-only yap

    return { success: true, path: settings.defaultPath };
  } catch (error) {
    console.error("Error saving read-only config:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("get-saved-configs", () => {
  const savePath = path.join(app.getPath("userData"), "configs");
  if (fs.existsSync(savePath)) {
    return fs.readdirSync(savePath).map((file) => {
      const fileNameWithoutExt = path.parse(file).name;
      return {
        name: fileNameWithoutExt,
        path: path.join(savePath, file),
      };
    });
  }
  return [];
});

ipcMain.handle("delete-config", async (event, filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
