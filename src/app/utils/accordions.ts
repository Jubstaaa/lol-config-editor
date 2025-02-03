export const accordions = [
  {
    title: "Abilities and Summoner Spells",
    tables: [
      {
        headers: ["Normal Cast", "Set 2"],
        columns: [
          {
            label: "Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastSpell1')].value",
          },
          {
            label: "Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastSpell2')].value",
          },
          {
            label: "Spell 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastSpell3')].value",
          },
          {
            label: "Spell 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastSpell4')].value",
          },
          {
            label: "Summoner Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastAvatarSpell1')].value",
          },
          {
            label: "Summoner Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastAvatarSpell2')].value",
          },
        ],
      },

      {
        headers: ["Quick Cast", "Set 2"],
        columns: [
          {
            label: "Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastSpell1')].value",
          },
          {
            label: "Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastSpell2')].value",
          },
          {
            label: "Spell 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastSpell3')].value",
          },
          {
            label: "Spell 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastSpell4')].value",
          },
          {
            label: "Summoner Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastAvatarSpell1')].value",
          },
          {
            label: "Summoner Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastAvatarSpell2')].value",
          },
        ],
      },
      {
        headers: ["Quick Cast With Indicator", "Set 2"],
        columns: [
          {
            label: "Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorSpell1')].value",
          },
          {
            label: "Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorSpell2')].value",
          },
          {
            label: "Spell 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorSpell3')].value",
          },
          {
            label: "Spell 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorSpell4')].value",
          },
          {
            label: "Summoner Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorAvatarSpell1')].value",
          },
          {
            label: "Summoner Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorAvatarSpell2')].value",
          },
        ],
      },
      {
        headers: ["Self Cast", "Set 1"],
        columns: [
          {
            label: "Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastSpell1')].value",
          },
          {
            label: "Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastSpell2')].value",
          },
          {
            label: "Spell 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastSpell3')].value",
          },
          {
            label: "Spell 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastSpell4')].value",
          },
          {
            label: "Summoner Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastAvatarSpell1')].value",
          },
          {
            label: "Summoner Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastAvatarSpell2')].value",
          },
        ],
      },
      {
        headers: ["Quick + Self Cast", "Set 1"],
        columns: [
          {
            label: "Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastSpell1')].value",
          },
          {
            label: "Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastSpell2')].value",
          },
          {
            label: "Spell 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastSpell3')].value",
          },
          {
            label: "Spell 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastSpell4')].value",
          },
          {
            label: "Summoner Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastAvatarSpell1')].value",
          },
          {
            label: "Summoner Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastAvatarSpell2')].value",
          },
        ],
      },
      {
        headers: ["Quick Cast With Indicator + Self Cast", "Set 2"],
        columns: [
          {
            label: "Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorSpell1')].value",
          },
          {
            label: "Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorSpell2')].value",
          },
          {
            label: "Spell 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorSpell3')].value",
          },
          {
            label: "Spell 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorSpell4')].value",
          },
          {
            label: "Summoner Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorAvatarSpell1')].value",
          },
          {
            label: "Summoner Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorAvatarSpell2')].value",
          },
        ],
      },
      {
        headers: ["Other", "Set 1"],
        columns: [
          {
            label: "Level Up Spell 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtLevelSpell1')].value",
          },
          {
            label: "Level Up Spell 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtLevelSpell2')].value",
          },
          {
            label: "Level Up Spell 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtLevelSpell3')].value",
          },
          {
            label: "Level Up Spell 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtLevelSpell4')].value",
          },
          {
            label: "Target Champions Only",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtChampionOnly')].value",
          },
          {
            label: "Teleport Home",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtUseItem7')].value",
          },
          {
            label: "Champion Specific Interaction 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtChampionSpecificInteractionButton1Click')].value",
          },
          {
            label: "Champion Specific Interaction 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtChampionSpecificInteractionButton2Click')].value",
          },
          {
            label: "Champion Specific Interaction 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtChampionSpecificInteractionButton3Click')].value",
          },
          {
            label: "Champion Specific Interaction 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtChampionSpecificInteractionButton4Click')].value",
          },
          {
            label: "Champion Specific Interaction 5",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtChampionSpecificInteractionButton5Click')].value",
          },
          {
            label: "Champion Specific Interaction 6",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtChampionSpecificInteractionButton6Click')].value",
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
          {
            label: "Trinket",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastVisionItem')].value",
          },
          {
            label: "Item 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastItem1')].value",
          },
          {
            label: "Item 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastItem2')].value",
          },
          {
            label: "Item 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastItem3')].value",
          },
          {
            label: "Item 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastItem4')].value",
          },
          {
            label: "Item 5",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastItem5')].value",
          },
          {
            label: "Item 6",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtNormalCastItem6')].value",
          },
        ],
      },
      {
        headers: ["Quick Cast", "Set 2"],
        columns: [
          {
            label: "Trinket",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastVisionItem')].value",
          },
          {
            label: "Item 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastItem1')].value",
          },
          {
            label: "Item 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastItem2')].value",
          },
          {
            label: "Item 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastItem3')].value",
          },
          {
            label: "Item 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastItem4')].value",
          },
          {
            label: "Item 5",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastItem5')].value",
          },
          {
            label: "Item 6",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastItem6')].value",
          },
        ],
      },
      {
        headers: ["Quick Cast With Indicator", "Set 2"],
        columns: [
          {
            label: "Trinket",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorVisionItem')].value",
          },
          {
            label: "Item 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorItem1')].value",
          },
          {
            label: "Item 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorItem2')].value",
          },
          {
            label: "Item 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorItem3')].value",
          },
          {
            label: "Item 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorItem4')].value",
          },
          {
            label: "Item 5",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorItem5')].value",
          },
          {
            label: "Item 6",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartCastWithIndicatorItem6')].value",
          },
        ],
      },
      {
        headers: ["Self Cast", "Set 1"],
        columns: [
          {
            label: "Trinket",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastVisionItem')].value",
          },
          {
            label: "Item 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastItem1')].value",
          },
          {
            label: "Item 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastItem2')].value",
          },
          {
            label: "Item 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastItem3')].value",
          },
          {
            label: "Item 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastItem4')].value",
          },
          {
            label: "Item 5",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastItem5')].value",
          },
          {
            label: "Item 6",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelfCastItem6')].value",
          },
        ],
      },
      {
        headers: ["Quick + Self Cast", "Set 1"],
        columns: [
          {
            label: "Trinket",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastVisionItem')].value",
          },
          {
            label: "Item 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastItem1')].value",
          },
          {
            label: "Item 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastItem2')].value",
          },
          {
            label: "Item 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastItem3')].value",
          },
          {
            label: "Item 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastItem4')].value",
          },
          {
            label: "Item 5",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastItem5')].value",
          },
          {
            label: "Item 6",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastItem6')].value",
          },
        ],
      },
      {
        headers: ["Quick Cast With Indicator + Self Cast", "Set 2"],
        columns: [
          {
            label: "Trinket",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorVisionItem')].value",
          },
          {
            label: "Item 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorItem1')].value",
          },
          {
            label: "Item 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorItem2')].value",
          },
          {
            label: "Item 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorItem3')].value",
          },
          {
            label: "Item 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorItem4')].value",
          },
          {
            label: "Item 5",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorItem5')].value",
          },
          {
            label: "Item 6",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSmartPlusSelfCastWithIndicatorItem6')].value",
          },
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
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerMoveClick')].value",
          },
          {
            label: "Player Attack Move Click",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerAttackMoveClick')].value",
          },
          {
            label: "Player Attack Only Click",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerAttackOnlyClick')].value",
          },
          {
            label: "Player Attack Move",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerAttackMove')].value",
          },
          {
            label: "Player Hold Position",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerHoldPosition')].value",
          },
          {
            label: "Player Stop Position",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerStopPosition')].value",
          },
          {
            label: "Move Pet Click",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPetMoveClick')].value",
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
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtCameraSnap')].value",
          },
          {
            label: "Select Self",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelectSelf')].value",
          },
          {
            label: "Select Ally 1",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelectAlly1')].value",
          },
          {
            label: "Select Ally 2",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelectAlly2')].value",
          },
          {
            label: "Select Ally 3",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelectAlly3')].value",
          },
          {
            label: "Select Ally 4",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSelectAlly4')].value",
          },
          {
            label: "Toggle Camera Lock",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtCameraLockToggle')].value",
          },
          {
            label: "Scroll Up",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtScrollUp')].value",
          },
          {
            label: "Scroll Down",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtScrollDown')].value",
          },
          {
            label: "Scroll Up",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtScrollLeft')].value",
          },
          {
            label: "Scroll Right",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtScrollRight')].value",
          },
          {
            label: "Drag Scroll",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtOnUIMouse4Pan')].value",
          },
          {
            label: "Drag Scroll Lock",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtDragScrollLock')].value",
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
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='HUDEvents')].settings[?(@.name=='evtShowHealthBars')].value",
          },
          {
            label: "Toggle Minion Health Bars",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='HUDEvents')].settings[?(@.name=='evtToggleMinionHealthBars')].value",
          },
          {
            label: "Show Summoner Names",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='HUDEvents')].settings[?(@.name=='evtShowSummonerNames')].value",
          },
          {
            label: "Show/Hide HUD",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='HUDEvents')].settings[?(@.name=='evtDrawHud')].value",
          },
          {
            label: "Toggle FPS Display",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='HUDEvents')].settings[?(@.name=='evtToggleFPSAndLatency')].value",
          },
          {
            label: "Toggle Death Recap Showcase",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='HUDEvents')].settings[?(@.name=='evtToggleDeathRecapShowcase')].value",
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
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evntPlayerPingCursor')].value",
          },
          {
            label: "Quick Alert Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evntPlayerPing')].value",
          },
          {
            label: "Caution Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evntPlayerPingCursorDanger')].value",
          },
          {
            label: "Quick Caution Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evntPlayerPingDanger')].value",
          },
        ],
      },
      {
        headers: ["Individual Pings", "Set 1"],
        columns: [
          {
            label: "On My Way Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerPingOMW')].value",
          },
          {
            label: "Enemy Missing Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerPingMIA')].value",
          },
          {
            label: "Retreat Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerPingRadialDanger')].value",
          },
          {
            label: "Assist Me Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerPingComeHere')].value",
          },
          {
            label: "Push Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerPingPush')].value",
          },
          {
            label: "All In Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerPingAllIn')].value",
          },
          {
            label: "Quick Enemy Vision Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerPingAreaIsWarded')].value",
          },
          {
            label: "Need Vision Ping",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtPlayerPingVisionNeeded')].value",
          },
        ],
      },
      {
        headers: ["Expression", "Set 1"],
        columns: [
          {
            label: "Joke",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtEmoteJoke')].value",
          },
          {
            label: "Taunt",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtEmoteTaunt')].value",
          },
          {
            label: "Dance",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtEmoteDance')].value",
          },
          {
            label: "Laugh",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtEmoteLaugh')].value",
          },
          {
            label: "Toggle",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtEmoteToggle')].value",
          },
          {
            label: "Mastery Emote",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtChampMasteryDisplay')].value",
          },
          {
            label: "Fist Bump",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtReciprocityTrigger')].value",
          },
          {
            label: "My Bad",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtReciprocityMyBadTrigger')].value",
          },
        ],
      },
      {
        headers: ["Emote", "Set 1"],
        columns: [
          {
            label: "Open Emote Wheel",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmoteOpen')].value",
          },
          {
            label: "Quick Open Emote Wheel",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmoteInstantOpen')].value",
          },
          {
            label: "Quick Play Emote North",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmotePlaySlot0')].value",
          },
          {
            label: "Quick Play Emote Northeast",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmotePlaySlot1')].value",
          },
          {
            label: "Quick Play Emote East",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmotePlaySlot2')].value",
          },
          {
            label: "Quick Play Emote Southeast",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmotePlaySlot3')].value",
          },
          {
            label: "Quick Play Emote South",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmotePlaySlot4')].value",
          },
          {
            label: "Quick Play Emote Southwest",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmotePlaySlot5')].value",
          },
          {
            label: "Quick Play Emote West",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmotePlaySlot6')].value",
          },
          {
            label: "Quick Play Emote Northwest",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmotePlaySlot7')].value",
          },
          {
            label: "Quick Play Emote Center",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtRadialEmotePlaySlot8')].value",
          },
        ],
      },
      {
        headers: ["Other", "Set 1"],
        columns: [
          {
            label: "Chat History",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtChatHistory')].value",
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
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtShowScoreBoard')].value",
          },
          {
            label: "Show Scoreboard (Hold)",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='HUDEvents')].settings[?(@.name=='evtHoldShowScoreBoard')].value",
          },
          {
            label: "Toggle Mouse Screen Lock",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='HUDEvents')].settings[?(@.name=='evtToggleMouseClip')].value",
          },
          {
            label: "System Menu",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtSysMenu')].value",
          },
          {
            label: "Show Advanced Player Stats",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtShowCharacterMenu')].value",
          },
          {
            label: "Toggle Basic Player Stats",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='HUDEvents')].settings[?(@.name=='evtTogglePlayerStats')].value",
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
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='GameEvents')].settings[?(@.name=='evtOpenShop')].value",
          },
          {
            label: "Focus Shop Search Bar",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='ShopEvents')].settings[?(@.name=='evtShopFocusSearch')].value",
          },
          {
            label: "Switch Shop Tabs",
            name: "$.files[?(@.name=='Input.ini')].sections[?(@.name=='ShopEvents')].settings[?(@.name=='evtShopSwitchTabs')].value",
          },
        ],
      },
    ],
  },
];
