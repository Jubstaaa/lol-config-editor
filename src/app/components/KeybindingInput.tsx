import React, { useState, useEffect, useRef } from "react";
import {
  Button,
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
}: KeybindingInputProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen) {
        event.preventDefault();
        onChange(`[${event.key}]`);
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const unbindKey = () => {
    onChange("[<Unbound>]");
    onClose();
  };

  return (
    <>
      <Button
        className="w-20 h-20 text-2xl break-words uppercase p-2 whitespace-normal block"
        onPress={onOpen}
      >
        {!value.includes("Unbound") ? value.replace(/[\[\]]/g, "") : ""}
      </Button>
      <Modal disableAnimation isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Press a key to bind:
              </ModalHeader>
              <ModalBody>Spell 1 Primary</ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={unbindKey}>
                  Unbind
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
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
