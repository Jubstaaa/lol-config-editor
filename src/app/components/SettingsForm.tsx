import React from "react";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import Input from "./Input";
import PersistedSettings from "/Applications/League of Legends.app/Contents/LoL/Config/PersistedSettings.json";
import { Card, CardBody, cn, Tab, Tabs } from "@nextui-org/react";
import { FieldType, Field, TabItem } from "../types";

const tabs: TabItem[] = [
  {
    label: "Interface",
    sections: [
      {
        label: "Interface Size",
        fields: [
          {
            label: "Hud Scale",
            type: FieldType.Slider,
            name: "files[0].sections[5].settings[15].value",
            scale: 100,
          },
          {
            label: "Cursor Scale",
            type: FieldType.Slider,
            name: "files[0].sections[4].settings[3].value",
            scale: 100,
          },
          {
            label: "Shop Scale",
            type: FieldType.Slider,
            name: "files[0].sections[5].settings[31].value",
            scale: 100,
          },
          {
            label: "Chat Scale",
            type: FieldType.Slider,
            name: "files[0].sections[5].settings[3].value",
          },
          {
            label: "Minimap Scale",
            type: FieldType.Slider,
            name: "files[0].sections[5].settings[24].value",
            scale: 33.3,
          },
          {
            label: "Objective Planning Scale",
            type: FieldType.Slider,
            name: "files[0].sections[5].settings[28].value",
            scale: 100,
          },
          {
            label: "Death Recap Scale",
            type: FieldType.Slider,
            name: "files[0].sections[5].settings[4].value",
            scale: 100,
          },
          {
            label: "Practice Tool Scale",
            type: FieldType.Slider,
            name: "files[0].sections[5].settings[29].value",
            scale: 100,
          },
        ],
      },

      {
        label: "Health and Resource Bars",
        className: "grid-cols-2",
        fields: [
          {
            label: "Show Health Bars",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[6].value",
          },
          {
            label: "Show Loss of Control UI",
            type: FieldType.Boolean,
            name: "files[0].sections[7].settings[0].value",
          },
          {
            label: "Enable HUD Animations",
            type: FieldType.Boolean,
            name: "files[0].sections[8].settings[0].value",
          },
          {
            label: "Show Health Bar Animations",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[38].value",
          },
          {
            label: "Show Names Above Healthbar",
            type: FieldType.Select,
            name: "files[0].sections[5].settings[46].value",
            options: [
              {
                label: "None",
                value: "0",
              },
              {
                label: "Summoner Name",
                value: "1",
              },
              {
                label: "Champion Name",
                value: "2",
              },
            ],
          },
        ],
      },
      {
        label: "Notifications",
        className: "grid-cols-2",
        fields: [
          {
            label: "Screen Flash on Damage",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[12].value",
          },
          {
            label: "Screen Flash on Loss of Control",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[13].value",
          },
          {
            label: "Champion Highlight on Camera Center",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[36].value",
          },
          {
            label: "Show Off-Screen Pings",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[40].value",
          },
        ],
      },
    ],
  },
];

export default function SettingsForm() {
  return (
    <Formik
      initialValues={PersistedSettings}
      onSubmit={function (
        values: FormikValues,
        formikHelpers: FormikHelpers<FormikValues>
      ): void | Promise<any> {
        console.log(values);
      }}
    >
      <Form>
        <Tabs isVertical>
          {tabs.map((item, index) => (
            <Tab key={index} title={item.label} className="w-full">
              <Card>
                <CardBody>
                  {item.sections.map((section, sectionIndex) => (
                    <>
                      <h2>{section.label}</h2>

                      <div
                        className={cn("grid gap-3", section.className)}
                        key={sectionIndex}
                      >
                        {section.fields.map((field, fieldIndex) => (
                          <Input key={fieldIndex} {...field} />
                        ))}
                      </div>
                    </>
                  ))}
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>
      </Form>
    </Formik>
  );
}
