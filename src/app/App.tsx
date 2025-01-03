import { FC } from "react";
import { NextUIProvider } from "@nextui-org/react";
import SettingsForm from "./components/SettingsForm";

const App: FC = () => {
  return (
    <NextUIProvider disableAnimation disableRipple skipFramerMotionAnimations>
      <SettingsForm />
    </NextUIProvider>
  );
};

export default App;
