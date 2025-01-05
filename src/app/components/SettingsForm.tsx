import React, { useEffect, useState } from "react";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import Input from "./Input";
import { FaTrash } from "react-icons/fa"; // FontAwesome'dan örnek

import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  cn,
  Tab,
  Tabs,
  Listbox,
  ListboxItem,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from "@nextui-org/react";
import { FieldType, Field, TabItem } from "../types";
import { tabs } from "../utils/tabs";
import { accordions } from "../utils/accordions";
import toast from "react-hot-toast";

const spellCastClassnames: {
  base: string;
  label: string;
  wrapper: string;
} = {
  base: "m-0 -top-3 inline-flex w-full max-w-md bg-content1 hover:bg-content2 items-center justify-center cursor-pointer rounded-lg gap-2 py-1 px-4 border-2 border-transparent data-[selected=true]:border-primary",
  label: "w-full",
  wrapper: "mr-0",
};

const keybindingClassname = "w-full h-7 text-base rounded-none p-0.5";

// TODO - Update names.

const quickCastAll = (state: boolean, setFieldValue: any) => {
  const value: string = state ? "1" : "0";

  for (let i = 0; i <= 12; i++) {
    setFieldValue(`files[1].sections[2].settings[${i}].value`, value);
  }
};

export default function SettingsForm({
  data,
  configPath,
}: {
  data: FormikValues;
  configPath: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [savedConfigs, setSavedConfigs] = useState<
    { name: string; path: string }[]
  >([]);
  const [configName, setConfigName] = useState<string>("");
  const [configData, setConfigData] = useState<FormikValues>(data);
  const [configToDelete, setConfigToDelete] = useState<{
    name: string;
    path: string;
  } | null>(null);

  const loadSavedConfigs = async () => {
    const configs = await electron.getSavedConfigs();
    setSavedConfigs(configs);
  };

  useEffect(() => {
    loadSavedConfigs();
  }, []);

  return (
    <Formik
      initialValues={configData}
      enableReinitialize
      onSubmit={async (values) => {
        console.log(values);
        await electron.saveConfig(values, configName.trim() || undefined);
        loadSavedConfigs(); // Listeyi güncelle
        setConfigName("");
        toast.success("Config saved successfully!");
      }}
    >
      {({ setFieldValue, values }) => (
        <Form className="flex gap-3">
          <Tabs isVertical classNames={{ wrapper: "w-3/4" }}>
            <Tab title="Hotkeys" className="w-full">
              <Card>
                <CardBody>
                  <>
                    <h2>Primary Hotkeys</h2>
                    <div className="w-full flex items-center justify-center gap-3">
                      <Button onPress={() => quickCastAll(true, setFieldValue)}>
                        Quick Cast All
                      </Button>
                      <Button
                        onPress={() => quickCastAll(false, setFieldValue)}
                      >
                        Normal Cast All
                      </Button>
                    </div>
                    <div className="flex gap-10 items-center">
                      <div className="flex flex-col gap-1 items-start">
                        <h3>Abilities</h3>
                        <div className="flex gap-3">
                          <div>
                            <Input
                              label="Spell 1 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[8].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[2].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Spell 2 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[9].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[3].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Spell 3 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[10].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[4].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Spell 4 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[11].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[5].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-start">
                        <h3>Summoner Spells</h3>
                        <div className="flex gap-3">
                          <div>
                            <Input
                              label="Summoner Spell 1 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[6].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[0].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Summoner Spell 2 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[7].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[1].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-10 items-center">
                      <div className="flex flex-col gap-1 items-start">
                        <h3>Items</h3>
                        <div className="flex gap-3">
                          <div>
                            <Input
                              label="Item 1 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[191].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[6].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Item 2 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[192].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[7].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Item 3 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[193].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[8].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Item 4 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[194].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[9].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Item 5 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[195].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[10].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Item 6 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[196].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[11].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-start">
                        <h3>Trinket</h3>
                        <div className="flex gap-3">
                          <div>
                            <Input
                              label="Trinket (Primary)"
                              type={FieldType.KeybindingInput}
                              name="files[1].sections[0].settings[198].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="files[1].sections[2].settings[12].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <h2>Quick Cast With Indicator</h2>
                    <div className="flex flex-col gap-3">
                      <Input
                        label="Replace Quick Cast with Quick Cast With Indicator in the quickbind UI"
                        type={FieldType.Boolean}
                        name="files[0].sections[5].settings[50].value"
                      />
                      <Input
                        label="Cast the pressed spell upon pressing another spell"
                        type={FieldType.Boolean}
                        name="files[0].sections[5].settings[51].value"
                      />
                    </div>
                    <h2>Hotkeys</h2>
                    <Accordion disableAnimation selectionMode="multiple">
                      {accordions.map((accordion, accordionIndex) => (
                        <AccordionItem
                          key={accordionIndex}
                          title={accordion.title}
                        >
                          <div className="flex flex-col gap-4">
                            {accordion.tables.map((table, tableIndex) => (
                              <div
                                key={tableIndex}
                                className="grid grid-cols-2 text-center items-center gap-3"
                              >
                                {table.headers.map((header, headerIndex) => (
                                  <div key={headerIndex}>{header}</div>
                                ))}
                                {table.columns.map((column, columnIndex) => (
                                  <div
                                    key={columnIndex}
                                    className="col-span-2 w-full grid grid-cols-2 gap-4"
                                  >
                                    <div>{column.label}</div>
                                    <Input
                                      label={
                                        column.label +
                                        " " +
                                        (table.headers[1] === "Set 1"
                                          ? "(Primary)"
                                          : "(Secondary)")
                                      }
                                      type={FieldType.KeybindingInput}
                                      name={column.name}
                                      className={keybindingClassname}
                                    />
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </>
                </CardBody>
              </Card>
            </Tab>
            {tabs.map((item, index) => (
              <Tab key={index} title={item.label} className="w-full">
                <Card>
                  <CardBody>
                    {item.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h2>{section.label}</h2>

                        <div
                          className={cn(
                            "grid grid-cols-2 gap-3",
                            section.className
                          )}
                          key={sectionIndex}
                        >
                          {section.fields.map((field, fieldIndex) => (
                            <Input
                              key={fieldIndex}
                              {...field}
                              className={
                                field.type === FieldType.Slider || field.full
                                  ? "col-span-full"
                                  : ""
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </Tab>
            ))}
          </Tabs>
          <div className="w-1/4 flex flex-col gap-3">
            <Input value={configName} onValueChange={setConfigName} />
            <div className="grid grid-cols-2 gap-2">
              <Button type="submit" color="warning">
                Kaydet
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await electron.saveReadOnlyConfig(values, configPath);
                  toast.success("Settings successfully applied!");
                }}
              >
                Apply Game Settings
              </Button>
            </div>
            <h3>Configs</h3>
            <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
              <Listbox
                disallowEmptySelection
                aria-label="Single selection example"
                selectionMode="single"
                variant="flat"
                onAction={(key) => {
                  const selectedConfig = savedConfigs.find(
                    (config) => config.name === key
                  );

                  electron
                    .readConfig(selectedConfig.path)
                    .then((data: FormikValues) => {
                      setConfigName(selectedConfig.name);
                      setConfigData(data);
                    });
                }}
              >
                {savedConfigs.map((config) => (
                  <ListboxItem
                    endContent={
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        onPress={() => {
                          onOpen();
                          setConfigToDelete(config);
                        }}
                      >
                        <FaTrash size={16} color="white" />
                      </Button>
                    }
                    key={config.name}
                  >
                    {config.name}
                  </ListboxItem>
                ))}
              </Listbox>
            </div>
            <Modal disableAnimation isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Delete Config
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        Are you sure you want to delete the config named{" "}
                        <b>{configToDelete.name}</b> ?
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        color="primary"
                        onPress={async () => {
                          await electron.deleteConfig(configToDelete.path);
                          loadSavedConfigs();
                          onClose();
                          toast.success("Deleted successfully!");
                        }}
                      >
                        Delete
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </Form>
      )}
    </Formik>
  );
}
