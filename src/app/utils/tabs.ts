import { FieldType, Field, TabItem } from "../types";

export const tabs: TabItem[] = [
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='EnableAudio')].value",
            reverse: true,
          },
          {
            label: "Theme Music",
            type: FieldType.Select,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='ThemeMusic')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='GlobalScale')].value",
            scale: 100,
          },
          {
            label: "Cursor Scale",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='CursorScale')].value",
            scale: 100,
          },
          {
            label: "Shop Scale",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShopScale')].value",
            scale: 100,
          },
          {
            label: "Chat Scale",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ChatScale')].value",
          },
          {
            label: "Minimap Scale",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='MinimapScale')].value",
            scale: 33.3,
          },
          {
            label: "Objective Planning Scale",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ObjectiveVoteScale')].value",
            scale: 100,
          },
          {
            label: "Death Recap Scale",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='DeathRecapScale')].value",
            scale: 100,
          },
          {
            label: "Practice Tool Scale",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='PracticeToolScale')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='DrawHealthBars')].value",
          },
          {
            label: "Show Loss of Control UI",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='LossOfControl')].settings[?(@.name=='LossOfControlEnabled')].value",
          },
          {
            label: "Enable HUD Animations",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='Performance')].settings[?(@.name=='EnableHUDAnimations')].value",
          },
          {
            label: "Show Health Bar Animations",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowHealthBarShake')].value",
          },
          {
            label: "Show Names Above Healthbar",
            type: FieldType.Select,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowSummonerNames')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='FlashScreenWhenDamaged')].value",
          },
          {
            label: "Screen Flash on Loss of Control",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='FlashScreenWhenStunned')].value",
          },
          {
            label: "Show Off-Screen Pings",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowOffScreenPointsOfInterest')].value",
          },
        ],
      },
      {
        label: "Legacy Cursor",
        fields: [
          {
            label: "Enable Legacy Cursor",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='CursorOverride')].value",
          },
        ],
      },
      {
        label: "Ability and Attack Display",
        fields: [
          {
            label: "Show Target Frame on Attack",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='AutoDisplayTarget')].value",
          },
          {
            label: "Enable Line Missile Display",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='EnableLineMissileVis')].value",
          },
          {
            label: "Show Attack Range",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowAttackRadius')].value",
          },
          {
            label: "Disable Spell Hud Click",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='DisableHudSpellClick')].value",
          },
          {
            label: "Show Spell Costs",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowSpellCosts')].value",
          },
          {
            label: "Show Spell Recommendation",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowSpellRecommendations')].value",
          },
          {
            label: "Ability Cooldown Display",
            type: FieldType.Select,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='NumericCooldownFormat')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowNeutralCamps')].value",
          },
          {
            label: "Show Minimap on Left",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='FlipMiniMap')].value",
          },
          {
            label: "Allow Minimap Movement",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='MinimapMoveSelf')].value",
          },
        ],
      },
      {
        label: "Scoreboard",
        fields: [
          {
            label: "Mirror Scoreboard Layout",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='MirroredScoreboard')].value",
          },
          {
            label: "Show Summoner Names",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowSummonerNamesInScoreboard')].value",
          },
        ],
      },
      {
        label: "Team Frames",
        fields: [
          {
            label: "Show Team Frames on Left",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowTeamFramesOnLeft')].value",
          },
        ],
      },
      {
        label: "Chat",
        fields: [
          {
            label: "Change Chat Visibility",
            type: FieldType.Select,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ChatChannelVisibility')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ShowTimestamps')].value",
          },
        ],
      },
      {
        label: "Emotes",
        fields: [
          {
            label: "Emote Bubble Display",
            type: FieldType.Select,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='EmotePopupUIDisplayMode')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='HideEnemySummonerEmotes')].value",
          },
          {
            label: "Emote Size",
            type: FieldType.Select,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='EmoteSize')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='Damage_Enabled')].value",
          },
          {
            label: "Heal",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='Heal_Enabled')].value",
          },
          {
            label: "Gold",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='Gold_Enabled')].value",
          },
          {
            label: "Status",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='Invulnerable_Enabled')].value",
          },
          {
            label: "Quest",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='QuestReceived_Enabled')].value",
          },
          {
            label: "Mana",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='ManaDamage_Enabled')].value",
          },
          {
            label: "Enemy Damage",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='EnemyDamage_Enabled')].value",
          },
          {
            label: "Dodge",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='Dodge_Enabled')].value",
          },
          {
            label: "Level",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='Level_Enabled')].value",
          },
          {
            label: "Special",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='Special_Enabled')].value",
          },
          {
            label: "Score",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='Score_Enabled')].value",
          },
          {
            label: "Experience",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='FloatingText')].settings[?(@.name=='Experience_Enabled')].value",
          },
        ],
      },
      {
        label: "Reactions (Fist Bump & My Bad)",
        fields: [
          {
            label: "Mute Reaction",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='HideReciprocityFist')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='OSXMouseAcceleration')].value",
            full: true,
          },
          {
            label: "Mouse Speed",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='GameMouseSpeed')].value",
            scale: 5,
            step: 5,
          },
          {
            label: "Camera Move Speed (Mouse)",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='MapScrollSpeed')].value",
            scale: 100,
          },
          {
            label: "Camera Move Speed (Keyboard)",
            type: FieldType.Slider,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='KeyboardScrollSpeed')].value",
            scale: 100,
          },
          {
            label: "Move Camera On Revive",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='SnapCameraOnRespawn')].value",
          },
          {
            label: "Enable Smooth Camera",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='ScrollSmoothingEnabled')].value",
          },
          {
            label: "Mouse Button Drag Scroll",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='MiddleClickDragScrollEnabled')].value",
            full: true,
          },
          {
            label: "Camera Lock Mode",
            type: FieldType.Select,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='CameraLockMode')].value",
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
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='EnableTargetedAttackMove')].value",
          },
          {
            label: "Use Movement Prediction",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='PredictMovement')].value",
          },
          {
            label: "Show Turret Range Indicators (Coop vs AI)",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='ShowTurretRangeIndicators')].value",
          },
          {
            label: "Attack Move on Cursor",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='EnableTargetedAttackMove')].value",
          },
          {
            label: "Treat 'Target Champions Only' as a toggle",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='TargetChampionsOnlyAsToggle')].value",
          },
          {
            label: "Display Recommended Jungle Path",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='General')].settings[?(@.name=='RecommendJunglePaths')].value",
          },
          {
            label: "Enable Item Component Purchasing",
            type: FieldType.Boolean,
            name: "$.files[?(@.name=='Game.cfg')].sections[?(@.name=='HUD')].settings[?(@.name=='RecommendJunglePaths')].value",
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
