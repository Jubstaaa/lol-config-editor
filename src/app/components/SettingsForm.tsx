import React from "react";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import Input from "./Input";
import PersistedSettings from "/Applications/League of Legends.app/Contents/LoL/Config/PersistedSettings.json";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  cn,
  Tab,
  Tabs,
} from "@nextui-org/react";
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

const keybindingClassname = "w-full h-7 text-base rounded-none p-0.5";

// TODO - Update names.

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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='RelativeTeamColors')].value",
          },
          {
            label: "Enable Screen Shake",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='EnableScreenShake')].value",
          },
        ],
      },
      {
        label: "Accessibility",
        fields: [
          {
            label: "Color Level",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Accessibility')].settings[?(@.name=='ColorLevel')].value",
            scale: 100,
          },
          {
            label: "Color Gamma",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Accessibility')].settings[?(@.name=='ColorGamma')].value",
            scale: 100,
          },
          {
            label: "Color Brightness",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Accessibility')].settings[?(@.name=='ColorBrightness')].value",
            scale: 100,
          },
          {
            label: "Color Contrast",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Accessibility')].settings[?(@.name=='ColorContrast')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Volume')].settings[?(@.name=='MasterVolume')].value",
            scale: 100,
          },
          {
            label: "Music Volume",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Volume')].settings[?(@.name=='MusicVolume')].value",
            scale: 100,
          },
          {
            label: "Announcer Volume",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Volume')].settings[?(@.name=='AnnouncerVolume')].value",
            scale: 100,
          },
          {
            label: "Voice Volume",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Volume')].settings[?(@.name=='VoiceVolume')].value",
            scale: 100,
          },
          {
            label: "Sound FX Volume",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Volume')].settings[?(@.name=='SfxVolume')].value",
            scale: 100,
          },
          {
            label: "Ambience",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Volume')].settings[?(@.name=='AmbienceVolume')].value",
            scale: 100,
          },
          {
            label: "Pings Volume",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Volume')].settings[?(@.name=='PingsVolume')].value",
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
  {
    label: "Chat & Friends",
    sections: [
      {
        label: "General",
        fields: [
          {
            label: "Enable Language Filter",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Chat')].settings[?(@.name=='EnableChatFilter')].value",
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

const accordions = [
  {
    title: "Abilities and Summoner Spells",
    tables: [
      {
        headers: ["Normal Cast", "Set 2"],
        columns: [
          { label: "Spell 1", name: "files[1].sections[0].settings[41].value" },
          { label: "Spell 2", name: "files[1].sections[0].settings[42].value" },
          { label: "Spell 3", name: "files[1].sections[0].settings[43].value" },
          { label: "Spell 4", name: "files[1].sections[0].settings[44].value" },
          {
            label: "Summoner Spell 1",
            name: "files[1].sections[0].settings[33].value",
          },
          {
            label: "Summoner Spell 2",
            name: "files[1].sections[0].settings[34].value",
          },
        ],
      },

      {
        headers: ["Quick Cast", "Set 2"],
        columns: [
          {
            label: "Spell 1",
            name: "files[1].sections[0].settings[140].value",
          },
          {
            label: "Spell 2",
            name: "files[1].sections[0].settings[141].value",
          },
          {
            label: "Spell 3",
            name: "files[1].sections[0].settings[142].value",
          },
          {
            label: "Spell 4",
            name: "files[1].sections[0].settings[143].value",
          },
          {
            label: "Summoner Spell 1",
            name: "files[1].sections[0].settings[132].value",
          },
          {
            label: "Summoner Spell 2",
            name: "files[1].sections[0].settings[133].value",
          },
        ],
      },
      {
        headers: ["Quick Cast With Indicator", "Set 2"],
        columns: [
          {
            label: "Spell 1",
            name: "files[1].sections[0].settings[153].value",
          },
          {
            label: "Spell 2",
            name: "files[1].sections[0].settings[154].value",
          },
          {
            label: "Spell 3",
            name: "files[1].sections[0].settings[155].value",
          },
          {
            label: "Spell 4",
            name: "files[1].sections[0].settings[156].value",
          },
          {
            label: "Summoner Spell 1",
            name: "files[1].sections[0].settings[145].value",
          },
          {
            label: "Summoner Spell 2",
            name: "files[1].sections[0].settings[146].value",
          },
        ],
      },
      {
        headers: ["Self Cast", "Set 1"],
        columns: [
          {
            label: "Spell 1",
            name: "files[1].sections[0].settings[122].value",
          },
          {
            label: "Spell 2",
            name: "files[1].sections[0].settings[123].value",
          },
          {
            label: "Spell 3",
            name: "files[1].sections[0].settings[124].value",
          },
          {
            label: "Spell 4",
            name: "files[1].sections[0].settings[125].value",
          },
          {
            label: "Summoner Spell 1",
            name: "files[1].sections[0].settings[114].value",
          },
          {
            label: "Summoner Spell 2",
            name: "files[1].sections[0].settings[115].value",
          },
        ],
      },
      {
        headers: ["Quick + Self Cast", "Set 1"],
        columns: [
          {
            label: "Spell 1",
            name: "files[1].sections[0].settings[166].value",
          },
          {
            label: "Spell 2",
            name: "files[1].sections[0].settings[167].value",
          },
          {
            label: "Spell 3",
            name: "files[1].sections[0].settings[168].value",
          },
          {
            label: "Spell 4",
            name: "files[1].sections[0].settings[169].value",
          },
          {
            label: "Summoner Spell 1",
            name: "files[1].sections[0].settings[159].value",
          },
          {
            label: "Summoner Spell 2",
            name: "files[1].sections[0].settings[160].value",
          },
        ],
      },
      {
        headers: ["Quick Cast With Indicator + Self Cast", "Set 2"],
        columns: [
          {
            label: "Spell 1",
            name: "files[1].sections[0].settings[147].value",
          },
          {
            label: "Spell 2",
            name: "files[1].sections[0].settings[148].value",
          },
          {
            label: "Spell 3",
            name: "files[1].sections[0].settings[149].value",
          },
          {
            label: "Spell 4",
            name: "files[1].sections[0].settings[150].value",
          },
          {
            label: "Summoner Spell 1",
            name: "files[1].sections[0].settings[139].value",
          },
          {
            label: "Summoner Spell 2",
            name: "files[1].sections[0].settings[140].value",
          },
        ],
      },
      {
        headers: ["Other", "Set 1"],
        columns: [
          {
            label: "Level Up Spell 1",
            name: "files[1].sections[0].settings[23].value",
          },
          {
            label: "Level Up Spell 2",
            name: "files[1].sections[0].settings[24].value",
          },
          {
            label: "Level Up Spell 3",
            name: "files[1].sections[0].settings[25].value",
          },
          {
            label: "Level Up Spell 4",
            name: "files[1].sections[0].settings[26].value",
          },
          {
            label: "Target Champions Only",
            name: "files[1].sections[0].settings[13].value",
          },
          {
            label: "Teleport Home",
            name: "files[1].sections[0].settings[165].value",
          },
          {
            label: "Champion Specific Interaction 1",
            name: "files[1].sections[0].settings[14].value",
          },
          {
            label: "Champion Specific Interaction 2",
            name: "files[1].sections[0].settings[15].value",
          },
          {
            label: "Champion Specific Interaction 3",
            name: "files[1].sections[0].settings[16].value",
          },
          {
            label: "Champion Specific Interaction 4",
            name: "files[1].sections[0].settings[17].value",
          },
          {
            label: "Champion Specific Interaction 5",
            name: "files[1].sections[0].settings[18].value",
          },
          {
            label: "Champion Specific Interaction 6",
            name: "files[1].sections[0].settings[19].value",
          },
        ],
      },
    ],
  },
  {
    title: "Items",
    tables: [
      {
        headers: ["Normal Cast", "Set 2"],
        columns: [
          { label: "Trinket", name: "files[1].sections[0].settings[45].value" },
          { label: "Item 1", name: "files[1].sections[0].settings[35].value" },
          { label: "Item 2", name: "files[1].sections[0].settings[36].value" },
          { label: "Item 3", name: "files[1].sections[0].settings[37].value" },
          { label: "Item 4", name: "files[1].sections[0].settings[38].value" },
          { label: "Item 5", name: "files[1].sections[0].settings[39].value" },
          { label: "Item 6", name: "files[1].sections[0].settings[40].value" },
        ],
      },
      {
        headers: ["Quick Cast", "Set 2"],
        columns: [
          {
            label: "Trinket",
            name: "files[1].sections[0].settings[118].value",
          },
          { label: "Item 1", name: "files[1].sections[0].settings[109].value" },
          { label: "Item 2", name: "files[1].sections[0].settings[110].value" },
          { label: "Item 3", name: "files[1].sections[0].settings[111].value" },
          { label: "Item 4", name: "files[1].sections[0].settings[112].value" },
          { label: "Item 5", name: "files[1].sections[0].settings[113].value" },
          { label: "Item 6", name: "files[1].sections[0].settings[114].value" },
        ],
      },
      {
        headers: ["Quick Cast With Indicator", "Set 2"],
        columns: [
          {
            label: "Trinket",
            name: "files[1].sections[0].settings[131].value",
          },
          { label: "Item 1", name: "files[1].sections[0].settings[121].value" },
          { label: "Item 2", name: "files[1].sections[0].settings[122].value" },
          { label: "Item 3", name: "files[1].sections[0].settings[123].value" },
          { label: "Item 4", name: "files[1].sections[0].settings[124].value" },
          { label: "Item 5", name: "files[1].sections[0].settings[125].value" },
          { label: "Item 6", name: "files[1].sections[0].settings[126].value" },
        ],
      },
      {
        headers: ["Self Cast", "Set 1"],
        columns: [
          {
            label: "Trinket",
            name: "files[1].sections[0].settings[100].value",
          },
          { label: "Item 1", name: "files[1].sections[0].settings[90].value" },
          { label: "Item 2", name: "files[1].sections[0].settings[91].value" },
          { label: "Item 3", name: "files[1].sections[0].settings[92].value" },
          { label: "Item 4", name: "files[1].sections[0].settings[93].value" },
          { label: "Item 5", name: "files[1].sections[0].settings[94].value" },
          { label: "Item 6", name: "files[1].sections[0].settings[95].value" },
        ],
      },
      {
        headers: ["Quick + Self Cast", "Set 1"],
        columns: [
          {
            label: "Trinket",
            name: "files[1].sections[0].settings[144].value",
          },
          { label: "Item 1", name: "files[1].sections[0].settings[134].value" },
          { label: "Item 2", name: "files[1].sections[0].settings[135].value" },
          { label: "Item 3", name: "files[1].sections[0].settings[136].value" },
          { label: "Item 4", name: "files[1].sections[0].settings[137].value" },
          { label: "Item 5", name: "files[1].sections[0].settings[138].value" },
          { label: "Item 6", name: "files[1].sections[0].settings[139].value" },
        ],
      },
      {
        headers: ["Quick Cast With Indicator + Self Cast", "Set 2"],
        columns: [
          {
            label: "Trinket",
            name: "files[1].sections[0].settings[157].value",
          },
          { label: "Item 1", name: "files[1].sections[0].settings[147].value" },
          { label: "Item 2", name: "files[1].sections[0].settings[148].value" },
          { label: "Item 3", name: "files[1].sections[0].settings[149].value" },
          { label: "Item 4", name: "files[1].sections[0].settings[150].value" },
          { label: "Item 5", name: "files[1].sections[0].settings[151].value" },
          { label: "Item 6", name: "files[1].sections[0].settings[152].value" },
        ],
      },
    ],
  },
  {
    title: "Player Movement",
    tables: [
      {
        headers: ["", "Set 1"],
        columns: [
          {
            label: "Player Move Click",
            name: "files[1].sections[0].settings[54].value",
          },
          {
            label: "Player Attack Move Click",
            name: "files[1].sections[0].settings[50].value",
          },
          {
            label: "Player Attack Only Click",
            name: "files[1].sections[0].settings[51].value",
          },
          {
            label: "Player Attack Move",
            name: "files[1].sections[0].settings[49].value",
          },
          {
            label: "Player Move Click",
            name: "files[1].sections[0].settings[53].value",
          },
          {
            label: "Player Stop Position",
            name: "files[1].sections[0].settings[66].value",
          },
          {
            label: "Move Pet Click",
            name: "files[1].sections[0].settings[48].value",
          },
        ],
      },
    ],
  },
  {
    title: "Camera Control",
    tables: [
      {
        headers: ["", "Set 1"],
        columns: [
          {
            label: "Center Camera On Champion",
            name: "files[1].sections[0].settings[5].value",
          },
          {
            label: "Select Self",
            name: "files[1].sections[0].settings[89].value",
          },
          {
            label: "Select Ally 1",
            name: "files[1].sections[0].settings[84].value",
          },
          {
            label: "Select Ally 2",
            name: "files[1].sections[0].settings[85].value",
          },
          {
            label: "Select Ally 3",
            name: "files[1].sections[0].settings[86].value",
          },
          {
            label: "Select Ally 4",
            name: "files[1].sections[0].settings[87].value",
          },
          {
            label: "Toggle Camera Lock",
            name: "files[1].sections[0].settings[4].value",
          },
          {
            label: "Scroll Up",
            name: "files[1].sections[0].settings[83].value",
          },
          {
            label: "Scroll Down",
            name: "files[1].sections[0].settings[80].value",
          },
          {
            label: "Scroll Up",
            name: "files[1].sections[0].settings[81].value",
          },
          {
            label: "Scroll Right",
            name: "files[1].sections[0].settings[82].value",
          },
          {
            label: "Drag Scroll",
            name: "files[1].sections[0].settings[46].value",
          },
          {
            label: "Drag Scroll Lock",
            name: "files[1].sections[0].settings[21].value",
          },
        ],
      },
    ],
  },
  {
    title: "Display",
    tables: [
      {
        headers: ["", "Set 1"],
        columns: [
          {
            label: "Show Health Bars",
            name: "files[1].sections[0].settings[104].value",
          },
          {
            label: "Toggle Minion Health Bars",
            name: "files[1].sections[0].settings[164].value",
          },
          {
            label: "Show Summoner Names",
            name: "files[1].sections[0].settings[106].value",
          },
          {
            label: "Show/Hide HUD",
            name: "files[1].sections[0].settings[22].value",
          },
          {
            label: "Toggle FPS Display",
            name: "files[1].sections[1].settings[2].value",
          },
          {
            label: "Toggle Death Recap Showcase",
            name: "files[1].sections[1].settings[1].value",
          },
        ],
      },
    ],
  },
  {
    title: "Communication",
    tables: [
      {
        headers: ["Open Tactical Wheel", "Set 1"],
        columns: [
          {
            label: "Alert Ping",
            name: "files[1].sections[0].settings[1].value",
          },
          {
            label: "Quick Alert Ping",
            name: "files[1].sections[0].settings[0].value",
          },
          {
            label: "Caution Ping",
            name: "files[1].sections[0].settings[2].value",
          },
          {
            label: "Quick Caution Ping",
            name: "files[1].sections[0].settings[3].value",
          },
        ],
      },
      {
        headers: ["Individual Pings", "Set 1"],
        columns: [
          {
            label: "On My Way Ping",
            name: "files[1].sections[0].settings[61].value",
          },
          {
            label: "Enemy Missing Ping",
            name: "files[1].sections[0].settings[60].value",
          },
          {
            label: "Retreat Ping",
            name: "files[1].sections[0].settings[63].value",
          },
          {
            label: "Assist Me Ping",
            name: "files[1].sections[0].settings[58].value",
          },
          {
            label: "Push Ping",
            name: "files[1].sections[0].settings[62].value",
          },
          {
            label: "All In Ping",
            name: "files[1].sections[0].settings[55].value",
          },
          {
            label: "Quick Enemy Vision Ping",
            name: "files[1].sections[0].settings[56].value",
          },
          {
            label: "Need Vision Ping",
            name: "files[1].sections[0].settings[65].value",
          },
        ],
      },
      {
        headers: ["Expression", "Set 1"],
        columns: [
          {
            label: "Joke",
            name: "files[1].sections[0].settings[24].value",
          },
          {
            label: "Taunt",
            name: "files[1].sections[0].settings[26].value",
          },
          {
            label: "Dance",
            name: "files[1].sections[0].settings[23].value",
          },
          {
            label: "Laugh",
            name: "files[1].sections[0].settings[25].value",
          },
          {
            label: "Toggle",
            name: "files[1].sections[0].settings[27].value",
          },
          {
            label: "Mastery Emote",
            name: "files[1].sections[0].settings[12].value",
          },
          {
            label: "Fist Bump",
            name: "files[1].sections[0].settings[81].value",
          },
          {
            label: "My Bad",
            name: "files[1].sections[0].settings[80].value",
          },
        ],
      },
      {
        headers: ["Emote", "Set 1"],
        columns: [
          {
            label: "Open Emote Wheel",
            name: "files[1].sections[0].settings[90].value",
          },
          {
            label: "Quick Open Emote Wheel",
            name: "files[1].sections[0].settings[91].value",
          },
          {
            label: "Quick Play Emote North",
            name: "files[1].sections[0].settings[71].value",
          },
          {
            label: "Quick Play Emote Northeast",
            name: "files[1].sections[0].settings[72].value",
          },
          {
            label: "Quick Play Emote East",
            name: "files[1].sections[0].settings[73].value",
          },
          {
            label: "Quick Play Emote Southeast",
            name: "files[1].sections[0].settings[74].value",
          },
          {
            label: "Quick Play Emote South",
            name: "files[1].sections[0].settings[75].value",
          },
          {
            label: "Quick Play Emote Southwest",
            name: "files[1].sections[0].settings[76].value",
          },
          {
            label: "Quick Play Emote West",
            name: "files[1].sections[0].settings[77].value",
          },
          {
            label: "Quick Play Emote Northwest",
            name: "files[1].sections[0].settings[78].value",
          },
          {
            label: "Quick Play Emote Center",
            name: "files[1].sections[0].settings[79].value",
          },
        ],
      },
      {
        headers: ["Other", "Set 1"],
        columns: [
          {
            label: "Chat History",
            name: "files[1].sections[0].settings[20].value",
          },
        ],
      },
    ],
  },
  {
    title: "Menus",
    tables: [
      {
        headers: ["", "Set 1"],
        columns: [
          {
            label: "Show Scoreboard",
            name: "files[1].sections[0].settings[107].value",
          },
          {
            label: "Show Scoreboard (Hold)",
            name: "files[1].sections[1].settings[0].value",
          },
          {
            label: "Toggle Mouse Screen Lock",
            name: "files[1].sections[1].settings[3].value",
          },
          {
            label: "System Menu",
            name: "files[1].sections[0].settings[162].value",
          },
          {
            label: "Show Advanced Player Stats",
            name: "files[1].sections[0].settings[105].value",
          },
          {
            label: "Toggle Basic Player Stats",
            name: "files[1].sections[1].settings[4].value",
          },
        ],
      },
    ],
  },
  {
    title: "Item Shop",
    tables: [
      {
        headers: ["", "Set 1"],
        columns: [
          {
            label: "Open Shop",
            name: "files[1].sections[0].settings[47].value",
          },
          {
            label: "Focus Shop Search Bar",
            name: "files[1].sections[3].settings[0].value",
          },
          {
            label: "Switch Shop Tabs",
            name: "files[1].sections[3].settings[1].value",
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
      {({ setFieldValue, values }) => (
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
