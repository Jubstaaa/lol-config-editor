import { contextBridge, ipcRenderer } from "electron";
import { FormikValues } from "formik/dist";

contextBridge.exposeInMainWorld("electron", {
  checkDefaultPath: (): Promise<any> =>
    ipcRenderer.invoke("check-default-path"),
  selectFolder: (): Promise<any> => ipcRenderer.invoke("select-folder"),
  saveConfig: (values: FormikValues, name: string): Promise<string> =>
    ipcRenderer.invoke("save-config", values, name),
  getSavedConfigs: (): Promise<{ name: string; path: string }[]> =>
    ipcRenderer.invoke("get-saved-configs"),
  deleteConfig: (filePath: string): Promise<boolean> =>
    ipcRenderer.invoke("delete-config", filePath),
  readConfig: (filePath: string): Promise<any> =>
    ipcRenderer.invoke("read-config", filePath),
  saveReadOnlyConfig: (configData: any): Promise<any> =>
    ipcRenderer.invoke("save-readonly-config", configData),
});
