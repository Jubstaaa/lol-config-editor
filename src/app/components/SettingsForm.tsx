import React from "react";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import Input from "./Input";
import PersistedSettings from "/Applications/League of Legends.app/Contents/LoL/Config/PersistedSettings.json";
import { Button, Card, CardBody, cn, Tab, Tabs } from "@nextui-org/react";
import { FieldType, Field, TabItem } from "../types";

const spellCastClassnames: {
  base: string;
  label: string;
  wrapper: string;
} = {
  base: "m-0 -top-3 inline-flex w-full max-w-md bg-content1 hover:bg-content2 items-center justify-center cursor-pointer rounded-lg gap-2 py-1 px-4 border-2 border-transparent data-[selected=true]:border-primary",
  label: "w-full",
  wrapper: "mr-0",
};

const tabs: TabItem[] = [
  {
    label: "Video",
    sections: [
      {
        label: "General",
        fields: [
          {
            label: "Use Relative Team Colors",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[12].value",
          },
          {
            label: "Enable Screen Shake",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[6].value",
          },
        ],
      },
      {
        label: "Accessibility",
        fields: [
          {
            label: "Color Level",
            type: FieldType.Slider,
            name: "files[0].sections[0].settings[3].value",
            scale: 100,
          },
          {
            label: "Color Gamma",
            type: FieldType.Slider,
            name: "files[0].sections[0].settings[2].value",
            scale: 100,
          },
          {
            label: "Color Brightness",
            type: FieldType.Slider,
            name: "files[0].sections[0].settings[0].value",
            scale: 100,
          },
          {
            label: "Color Contrast",
            type: FieldType.Slider,
            name: "files[0].sections[0].settings[1].value",
            scale: 100,
          },
        ],
      },
    ],
  },
  {
    label: "Sound",
    sections: [
      {
        label: "Sound",
        fields: [
          {
            label: "Master Volume",
            type: FieldType.Slider,
            name: "files[0].sections[12].settings[5].value",
            scale: 100,
          },
          {
            label: "Music Volume",
            type: FieldType.Slider,
            name: "files[0].sections[12].settings[7].value",
            scale: 100,
          },
          {
            label: "Announcer Volume",
            type: FieldType.Slider,
            name: "files[0].sections[12].settings[3].value",
            scale: 100,
          },
          {
            label: "Voice Volume",
            type: FieldType.Slider,
            name: "files[0].sections[12].settings[13].value",
            scale: 100,
          },
          {
            label: "Sound FX Volume",
            type: FieldType.Slider,
            name: "files[0].sections[12].settings[11].value",
            scale: 100,
          },
          {
            label: "Ambience",
            type: FieldType.Slider,
            name: "files[0].sections[12].settings[1].value",
            scale: 100,
          },
          {
            label: "Pings Volume",
            type: FieldType.Slider,
            name: "files[0].sections[12].settings[9].value",
            scale: 100,
          },
          {
            label: "Disable All Sound",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[4].value",
            reverse: true,
          },
          {
            label: "Theme Music",
            type: FieldType.Select,
            name: "files[0].sections[4].settings[16].value",
            options: [
              {
                label: "Updated",
                value: "0",
              },
              { label: "Classic", value: "1" },
            ],
          },
        ],
      },
    ],
  },
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
            label: "Show Off-Screen Pings",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[40].value",
          },
        ],
      },
      {
        label: "Legacy Cursor",
        fields: [
          {
            label: "Enable Legacy Cursor",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[2].value",
          },
        ],
      },
      {
        label: "Ability and Attack Display",
        fields: [
          {
            label: "Show Target Frame on Attack",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[0].value",
          },
          {
            label: "Enable Line Missile Display",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[10].value",
          },
          {
            label: "Show Attack Range",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[35].value",
          },
          {
            label: "Disable Spell Hud Click",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[5].value",
          },
          {
            label: "Show Spell Costs",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[43].value",
          },
          {
            label: "Show Spell Recommendation",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[44].value",
          },
          {
            label: "Ability Cooldown Display",
            type: FieldType.Select,
            name: "files[0].sections[5].settings[27].value",
            options: [
              {
                label: "None",
                value: "0",
              },
              {
                label: "Seconds",
                value: "1",
              },
              {
                label: "Minutes + Seconds",
                value: "2",
              },
              {
                label: "Minutes",
                value: "3",
              },
            ],
          },
        ],
      },
      {
        label: "Minimap",
        fields: [
          {
            label: "Show Neutral Camps",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[39].value",
          },
          {
            label: "Show Minimap on Left",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[14].value",
          },
          {
            label: "Allow Minimap Movement",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[23].value",
          },
        ],
      },
      {
        label: "Scoreboard",
        fields: [
          {
            label: "Mirror Scoreboard Layout",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[25].value",
          },
          {
            label: "Show Summoner Names",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[47].value",
          },
        ],
      },
      {
        label: "Team Frames",
        fields: [
          {
            label: "Show Team Frames on Left",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[48].value",
          },
        ],
      },
      {
        label: "Chat",
        fields: [
          {
            label: "Change Chat Visibility",
            type: FieldType.Select,
            name: "files[0].sections[5].settings[2].value",
            options: [
              {
                label: "Premade Only (Party)",
                value: "0",
              },
              {
                label: "Same Team (Party/Ally)",
                value: "1",
              },
              {
                label: "Everyone (Party/Ally/All)",
                value: "2",
              },
            ],
          },
          {
            label: "Show Timestamps",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[49].value",
          },
        ],
      },
      {
        label: "Emotes",
        fields: [
          {
            label: "Emote Bubble Display",
            type: FieldType.Select,
            name: "files[0].sections[5].settings[7].value",
            options: [
              {
                label: "On",
                value: "0",
              },
              {
                label: "Mute Sound",
                value: "1",
              },
              {
                label: "Off",
                value: "2",
              },
            ],
          },
          {
            label: "Mute Enemy Emotes",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[16].value",
          },
          {
            label: "Emote Size",
            type: FieldType.Select,
            name: "files[0].sections[5].settings[8].value",
            options: [
              {
                label: "Normal",
                value: "0",
              },
              {
                label: "Small",
                value: "1",
              },
            ],
          },
        ],
      },
      {
        label: "Combat Text",
        fields: [
          {
            label: "Damage",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[0].value",
          },
          {
            label: "Heal",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[5].value",
          },
          {
            label: "Gold",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[4].value",
          },
          {
            label: "Status",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[6].value",
          },
          {
            label: "Quest",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[9].value",
          },
          {
            label: "Mana",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[8].value",
          },
          {
            label: "Enemy Damage",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[2].value",
          },
          {
            label: "Dodge",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[1].value",
          },
          {
            label: "Level",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[7].value",
          },
          {
            label: "Special",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[11].value",
          },
          {
            label: "Score",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[10].value",
          },
          {
            label: "Experience",
            type: FieldType.Boolean,
            name: "files[0].sections[3].settings[3].value",
          },
        ],
      },
      {
        label: "Reactions (Fist Bump & My Bad)",
        fields: [
          {
            label: "Mute Reaction",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[18].value",
          },
        ],
      },
    ],
  },
  {
    label: "Game",
    sections: [
      {
        label: "Controls",
        fields: [
          {
            label: "Use Software Mouse (Vertical Sync must be off)",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[9].value",
            full: true,
          },
          {
            label: "Mouse Speed",
            type: FieldType.Slider,
            name: "files[0].sections[4].settings[8].value",
            scale: 5,
            step: 5,
          },
          {
            label: "Camera Move Speed (Mouse)",
            type: FieldType.Slider,
            name: "files[0].sections[5].settings[20].value",
            scale: 100,
          },
          {
            label: "Camera Move Speed (Keyboard)",
            type: FieldType.Slider,
            name: "files[0].sections[5].settings[19].value",
            scale: 100,
          },
          {
            label: "Move Camera On Revive",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[14].value",
          },
          {
            label: "Enable Smooth Camera",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[30].value",
          },
          {
            label: "Mouse Button Drag Scroll",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[21].value",
            full: true,
          },
          {
            label: "Camera Lock Mode",
            type: FieldType.Select,
            name: "files[0].sections[5].settings[1].value",
            options: [
              {
                label: "Per-Side Offset",
                value: "0",
              },
              {
                label: "Fixed Offset",
                value: "1",
              },
              {
                label: "Semi-Locked",
                value: "2",
              },
            ],
          },
        ],
      },
      {
        label: "Gameplay",
        fields: [
          {
            label: "Auto Attack",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[7].value",
          },
          {
            label: "Use Movement Prediction",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[10].value",
          },
          {
            label: "Show Turret Range Indicators (Coop vs AI)",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[13].value",
          },
          {
            label: "Attack Move on Cursor",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[7].value",
          },
          {
            label: "Treat 'Target Champions Only' as a toggle",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[15].value",
          },
          {
            label: "Display Recommended Jungle Path",
            type: FieldType.Boolean,
            name: "files[0].sections[4].settings[11].value",
          },
          {
            label: "Enable Item Component Purchasing",
            type: FieldType.Boolean,
            name: "files[0].sections[5].settings[9].value",
          },
        ],
      },
    ],
  },
];

const quickCastAll = (state: boolean, setFieldValue: any) => {
  const value: string = state ? "1" : "0";

  for (let i = 0; i <= 12; i++) {
    setFieldValue(`files[1].sections[2].settings[${i}].value`, value);
  }
};

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
      {({ setFieldValue }) => (
        <Form>
          <Tabs isVertical>
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
                              name="files[1].sections[0].settings[159].value"
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
                              name="files[1].sections[0].settings[160].value"
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
                              name="files[1].sections[0].settings[161].value"
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
                              name="files[1].sections[0].settings[162].value"
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
                              name="files[1].sections[0].settings[163].value"
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
                              name="files[1].sections[0].settings[164].value"
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
                              name="files[1].sections[0].settings[166].value"
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
                  </>
                </CardBody>
              </Card>
            </Tab>
            {tabs.map((item, index) => (
              <Tab key={index} title={item.label} className="w-full">
                <Card>
                  <CardBody>
                    {item.sections.map((section, sectionIndex) => (
                      <>
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
                      </>
                    ))}
                  </CardBody>
                </Card>
              </Tab>
            ))}
          </Tabs>
        </Form>
      )}
    </Formik>
  );
}
