import { FC, useEffect, useState } from "react";
import { NextUIProvider, Button } from "@nextui-org/react";
import SettingsForm from "./components/SettingsForm";
import toast, { Toaster } from "react-hot-toast";
import { FormikValues } from "formik/dist";

const App: FC = () => {
  const [persistedSettings, setPersistedSettings] = useState<any>(null);
  const [configPath, setConfigPath] = useState<string>(
    "C:/Riot Games/League of Legends/Config/PersistedSettings.json"
  );

  useEffect(() => {
    electron
      .checkDefaultPath()
      .then((data: FormikValues) => {
        if (data) {
          setPersistedSettings(data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  const handleSelectFolder = async () => {
    try {
      const { data, path } = await electron.selectFolder();
      setConfigPath(path);
      if (data) {
        setPersistedSettings(data);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <NextUIProvider>
      <main className="p-10">
        {!persistedSettings ? (
          <Button onPress={handleSelectFolder}>
            Select League of Legends folder
          </Button>
        ) : (
          <SettingsForm data={persistedSettings} configPath={configPath} />
        )}
        <Toaster />
      </main>
    </NextUIProvider>
  );
};

export default App;
