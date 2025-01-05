import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import { KeybindingInputProps } from "../types";

const KeybindingInput = ({
  value,
  onChange,
  placeholder,
  label,
  className,
}: KeybindingInputProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return; // Eğer isOpen false ise hiçbir şey yapma

    const getKeyLabel = (key: string): string => {
      if (key === " ") return "Space";
      if (key === "Control") return "Ctrl";
      if (key === "ArrowUp") return "Up Arrow";
      if (key === "ArrowDown") return "Down Arrow";
      if (key === "ArrowLeft") return "Left Arrow";
      if (key === "ArrowRight") return "Right Arrow";
      return key;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = getKeyLabel(event.key);
      if (!pressedKeys.includes(key) && isOpen) {
        setPressedKeys((prevKeys) => [...prevKeys, key]);
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      const button = `Button ${event.button}`;
      if (!pressedKeys.includes(button) && isOpen) {
        event.preventDefault();
        setPressedKeys((prevKeys) => [...prevKeys, button]);
      }
    };

    const handleKeyUp = () => {
      if (isOpen) {
        finalizePressedKeys();
      }
    };

    const handleMouseUp = () => {
      if (isOpen) {
        finalizePressedKeys();
      }
    };

    const finalizePressedKeys = () => {
      const formattedKeys = pressedKeys.map((item) => `[${item}]`).join("");
      onChange(formattedKeys);
      setPressedKeys([]);
      onClose();
    };

    if (pressedKeys.toString() === "Button 2") {
      finalizePressedKeys();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, [isOpen, pressedKeys]);

  const unbindKey = () => {
    onChange("[<Unbound>]");
    onClose();
    setPressedKeys([]);
  };

  return (
    <>
      <Button
        radius="none"
        className={cn(
          "w-20 h-20 text-2xl break-words p-2 whitespace-normal block",
          className
        )}
        onPress={onOpen}
      >
        {value
          .split(",") // Virgüllerden ayır
          .map(
            (part) =>
              !part.includes("Unbound") && !part.includes("null") // Eğer "Unbound" içermiyorsa işle
                ? part
                    .split(/\]\[/) // Köşeli parantezler arasından parçala
                    .map(
                      (item) =>
                        item
                          .replace(/[\[\]]/g, "") // Köşeli parantezleri kaldır
                          .toLowerCase()
                          .replace(/^\w/, (char) => char.toUpperCase()) // İlk harfi büyük yap
                    )
                    .join(" ") // Parçaları boşluk ile birleştir
                : "" // "Unbound" varsa boş string döndür
          )
          .filter((item) => item !== "") // Boş değerleri kaldır
          .join(" | ")}
      </Button>
      <Modal disableAnimation isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Press a key to bind:
              </ModalHeader>
              <ModalBody>{label || placeholder}</ModalBody>
              <ModalFooter>
                <Button radius="none" color="primary" onPress={unbindKey}>
                  Unbind
                </Button>
                <Button
                  radius="none"
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setPressedKeys([]);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default KeybindingInput;
