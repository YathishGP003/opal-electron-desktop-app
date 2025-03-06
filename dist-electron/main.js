import { app, ipcMain, desktopCapturer, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let studio;
let floatingWebCam;
function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 600,
    minHeight: 600,
    minWidth: 300,
    frame: false,
    hasShadow: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
      webSecurity: true
    }
  });
  studio = new BrowserWindow({
    width: 400,
    height: 50,
    minHeight: 70,
    maxHeight: 400,
    minWidth: 300,
    maxWidth: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  floatingWebCam = new BrowserWindow({
    width: 400,
    height: 200,
    minHeight: 70,
    maxHeight: 400,
    minWidth: 300,
    maxWidth: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, "screen-saver", 1);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  studio.webContents.on("did-finish-load", () => {
    studio == null ? void 0 : studio.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studio.loadURL(`${"http://localhost:5173"}/studio.html`);
    floatingWebCam.loadURL(`${"http://localhost:5173"}/webcam.html`);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    studio.loadFile(path.join(RENDERER_DIST, "studio.html"));
    floatingWebCam.loadFile(path.join(RENDERER_DIST, "webcam.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});
ipcMain.on("closeApp", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});
ipcMain.handle("getSources", async () => {
  try {
    const data = await desktopCapturer.getSources({
      types: ["window", "screen"],
      thumbnailSize: { height: 100, width: 150 },
      fetchWindowIcons: true
    });
    console.log("Fetched Sources:", data);
    return data;
  } catch (error) {
    console.error("Error fetching sources:", error);
    throw error;
  }
});
ipcMain.on("media-sources", (event, payload) => {
  console.log(event);
  studio == null ? void 0 : studio.webContents.send("profile-received", payload);
});
ipcMain.on("resize-studio", (event, payload) => {
  console.log(event);
  if (payload.shrink) {
    studio == null ? void 0 : studio.setSize(400, 100);
  }
  if (!payload.shrink) {
    studio == null ? void 0 : studio.setSize(400, 250);
  }
});
ipcMain.on("hide-plugin", (event, payload) => {
  console.log(event);
  win == null ? void 0 : win.webContents.send("hide-plugin", payload);
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
