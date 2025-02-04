import { FC, useEffect, useState } from "react";
import { NextUIProvider, Button } from "@nextui-org/react";
import SettingsForm from "./components/SettingsForm";
import toast, { Toaster } from "react-hot-toast";
import { FormikValues } from "formik/dist";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeSwitcher } from "./components/ThemeSwitcher";

const electron = window.electron;

const App: FC = () => {
  const [persistedSettings, setPersistedSettings] = useState<any>(null);

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
      const data = await electron.selectFolder();
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
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <main className="p-5">
          <ThemeSwitcher />
          {!persistedSettings ? (
            <Button radius="none" onPress={handleSelectFolder}>
              Select League of Legends folder
            </Button>
          ) : (
            <SettingsForm data={persistedSettings} />
          )}
          <Toaster />
        </main>
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default App;
