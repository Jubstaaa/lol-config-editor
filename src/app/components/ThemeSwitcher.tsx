"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      className="fixed bottom-0 right-0 m-4"
      isIconOnly
      radius="full"
      variant="bordered"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? (
        <FaSun className="text-yellow-500" size={24} />
      ) : (
        <FaMoon className="text-gray-500" size={24} />
      )}
    </Button>
  );
}
