import React, { useEffect, useState } from "react";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import Input from "./Input";
import { FaTrash } from "react-icons/fa";
const electron = window.electron;

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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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
  base: "m-0 inline-flex w-full max-w-md bg-content1 hover:bg-content2 items-center justify-center cursor-pointer rounded-lg gap-2 py-1 px-4 border-2 data-[selected=true]:opacity-100 opacity-50 border rounded-none",
  label: "w-full",
  wrapper: "mr-0",
};

const keybindingClassname = "w-full h-7 text-base rounded-none p-0.5";

const quickCastAll = (state: boolean, setFieldValue: any) => {
  const value: string = state ? "1" : "0";

  for (let i = 0; i <= 12; i++) {
    setFieldValue(`files[1].sections[2].settings[${i}].value`, value);
  }
};

export default function SettingsForm({ data }: { data: FormikValues }) {
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
        loadSavedConfigs();
        setConfigName("");
        toast.success("Config saved successfully!");
      }}
    >
      {({ setFieldValue, values }) => (
        <Form className="flex gap-3">
          <Tabs isVertical classNames={{ wrapper: "w-3/4" }}>
            <Tab title="Hotkeys" className="w-full">
              <Card>
                <CardBody className="flex flex-col items-start gap-7">
                  <div className="w-full flex flex-col items-start gap-3">
                    <h2 className="text-xl font-semibold">Primary Hotkeys</h2>
                    <div className="w-full flex items-center justify-center gap-3">
                      <Button
                        radius="none"
                        onPress={() => quickCastAll(true, setFieldValue)}
                      >
                        Quick Cast All
                      </Button>
                      <Button
                        radius="none"
                        onPress={() => quickCastAll(false, setFieldValue)}
                      >
                        Normal Cast All
                      </Button>
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-start gap-3">
                    <div className="flex gap-10 items-center">
                      <div className="flex flex-col gap-3 items-start">
                        <h3 className="text-lg font-semibold">Abilities</h3>
                        <div className="flex gap-3">
                          <div>
                            <Input
                              label="Spell 1 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtCastSpell1')].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtCastSpell1smart')].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Spell 2 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtCastSpell2')].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtCastSpell2smart')].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Spell 3 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtCastSpell3')].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtCastSpell3smart')].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Spell 4 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtCastSpell4')].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtCastSpell4smart')].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 items-start">
                        <h3 className="text-lg font-semibold">
                          Summoner Spells
                        </h3>
                        <div className="flex gap-3">
                          <div>
                            <Input
                              label="Summoner Spell 1 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtCastAvatarSpell1')].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtCastAvatarSpell1smart')].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                          <div>
                            <Input
                              label="Summoner Spell 2 (Primary)"
                              type={FieldType.KeybindingInput}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtCastAvatarSpell2')].value"
                            />
                            <Input
                              type={FieldType.Boolean}
                              name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtCastAvatarSpell2smart')].value"
                              classNames={spellCastClassnames}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-10 items-center">
                    <div className="flex flex-col gap-3 items-start">
                      <h3 className="text-lg font-semibold">Items</h3>
                      <div className="flex gap-3">
                        <div>
                          <Input
                            label="Item 1 (Primary)"
                            type={FieldType.KeybindingInput}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtUseItem1')].value"
                          />
                          <Input
                            type={FieldType.Boolean}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtUseItem1smart')].value"
                            classNames={spellCastClassnames}
                          />
                        </div>
                        <div>
                          <Input
                            label="Item 2 (Primary)"
                            type={FieldType.KeybindingInput}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtUseItem2')].value"
                          />
                          <Input
                            type={FieldType.Boolean}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtUseItem2smart')].value"
                            classNames={spellCastClassnames}
                          />
                        </div>
                        <div>
                          <Input
                            label="Item 3 (Primary)"
                            type={FieldType.KeybindingInput}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtUseItem3')].value"
                          />
                          <Input
                            type={FieldType.Boolean}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtUseItem3smart')].value"
                            classNames={spellCastClassnames}
                          />
                        </div>
                        <div>
                          <Input
                            label="Item 4 (Primary)"
                            type={FieldType.KeybindingInput}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtUseItem4')].value"
                          />
                          <Input
                            type={FieldType.Boolean}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtUseItem4smart')].value"
                            classNames={spellCastClassnames}
                          />
                        </div>
                        <div>
                          <Input
                            label="Item 5 (Primary)"
                            type={FieldType.KeybindingInput}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtUseItem5')].value"
                          />
                          <Input
                            type={FieldType.Boolean}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtUseItem5smart')].value"
                            classNames={spellCastClassnames}
                          />
                        </div>
                        <div>
                          <Input
                            label="Item 6 (Primary)"
                            type={FieldType.KeybindingInput}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtUseItem6')].value"
                          />
                          <Input
                            type={FieldType.Boolean}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtUseItem6smart')].value"
                            classNames={spellCastClassnames}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 items-start">
                      <h3 className="text-lg font-semibold">Trinket</h3>
                      <div className="flex gap-3">
                        <div>
                          <Input
                            label="Trinket (Primary)"
                            type={FieldType.KeybindingInput}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtUseVisionItem')].value"
                          />
                          <Input
                            type={FieldType.Boolean}
                            name="$.files[?(@.name=='Input.ini')].sections[?(@.name=='Quickbinds')].settings[?(@.name=='evtUseVisionItemsmart')].value"
                            classNames={spellCastClassnames}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-start gap-3">
                    <h2 className="text-xl font-semibold">
                      Quick Cast With Indicator
                    </h2>
                    <div className="flex flex-col gap-3">
                      <Input
                        label="Replace Quick Cast with Quick Cast With Indicator in the quickbind UI"
                        type={FieldType.Boolean}
                        name="$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='SmartCastOnKeyRelease')].value"
                      />
                      <Input
                        label="Cast the pressed spell upon pressing another spell"
                        type={FieldType.Boolean}
                        name="$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='SmartCastWithIndicator_CastWhenNewSpellSelected')].value"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-start gap-3">
                    <h2 className="text-xl font-semibold">Hotkeys</h2>
                    <Accordion disableAnimation selectionMode="multiple">
                      {accordions.map((accordion, accordionIndex) => (
                        <AccordionItem
                          key={accordionIndex}
                          title={accordion.title}
                        >
                          <div className="flex flex-col gap-4">
                            {accordion.tables.map((table, tableIndex) => (
                              <Table
                                classNames={{
                                  th: "text-center",
                                }}
                                key={tableIndex}
                                aria-label="Example table with dynamic content"
                              >
                                <TableHeader>
                                  {table.headers.map((header, headerIndex) => (
                                    <TableColumn key={headerIndex}>
                                      {header}
                                    </TableColumn>
                                  ))}
                                </TableHeader>
                                <TableBody>
                                  {table.columns.map((column, columnIndex) => (
                                    <TableRow key={columnIndex}>
                                      <TableCell>{column.label}</TableCell>
                                      <TableCell>
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
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ))}
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            {tabs.map((item, index) => (
              <Tab key={index} title={item.label} className="w-full">
                <Card>
                  <CardBody className="flex flex-col items-start gap-7">
                    {item.sections.map((section, sectionIndex) => (
                      <div
                        className="w-full flex flex-col gap-3"
                        key={sectionIndex}
                      >
                        <h2 className="text-xl font-semibold">
                          {section.label}
                        </h2>

                        <div
                          className={cn(
                            "grid grid-cols-2 gap-5 items-start",
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
            <Input
              label="Config Name"
              value={configName}
              onValueChange={setConfigName}
            />
            <div className="grid grid-cols-2 gap-2">
              <Button radius="none" type="submit" color="warning">
                Save
              </Button>
              <Button
                radius="none"
                color="primary"
                onPress={async () => {
                  await electron.saveReadOnlyConfig(values);
                  toast.success("Settings successfully applied!");
                }}
              >
                Apply Settings
              </Button>
            </div>
            <h3 className="text-lg font-semibold">Configs</h3>
            <div className="w-full border-small border-default-200 dark:border-default-100">
              <Listbox
                classNames={{
                  base: "p-0",
                }}
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
                    className="rounded-none"
                    endContent={
                      <Button
                        radius="none"
                        isIconOnly
                        className="min-w-6 min-h-6 w-6 h-6"
                        color="danger"
                        onPress={() => {
                          onOpen();
                          setConfigToDelete(config);
                        }}
                      >
                        <FaTrash size={12} color="white" />
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
                        <b>{configToDelete.name}</b>?
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        radius="none"
                        color="danger"
                        variant="light"
                        onPress={onClose}
                      >
                        Close
                      </Button>
                      <Button
                        radius="none"
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
