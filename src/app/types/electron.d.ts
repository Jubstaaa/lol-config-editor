interface IElectronAPI {
  saveReadOnlyConfig: (config: any) => Promise<void>;
  saveConfig: (config: any, name?: string) => Promise<void>;
  getSavedConfigs: () => Promise<{ name: string; path: string }[]>;
  readConfig: (path: string) => Promise<any>;
  deleteConfig: (path: string) => Promise<void>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export {};