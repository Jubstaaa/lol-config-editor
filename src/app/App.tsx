import { FC } from "react";
import { NextUIProvider } from "@nextui-org/react";
import SettingsForm from "./components/SettingsForm";

const App: FC = () => {
  return (
    <NextUIProvider >
      <SettingsForm />
    </NextUIProvider>
  );
};

export default App;
