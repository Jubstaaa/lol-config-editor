import { event, hudEvent, keybind, quickbind, shopEvent } from './catalog.builders'

import type { FieldDef } from './catalog.types'

/** What a hotkey can be pointed at. Items and the trinket are cast differently. */
interface Target {
    /** The suffix League appends to every cast-mode prefix. */
    key: string
    label: string
    /** Items and the trinket are "used", spells are "cast". */
    used?: boolean
}

const SPELLS: Target[] = [
    { key: 'Spell1', label: 'Spell 1' },
    { key: 'Spell2', label: 'Spell 2' },
    { key: 'Spell3', label: 'Spell 3' },
    { key: 'Spell4', label: 'Spell 4' },
]

const SUMMONERS: Target[] = [
    { key: 'AvatarSpell1', label: 'Summoner spell 1' },
    { key: 'AvatarSpell2', label: 'Summoner spell 2' },
]

/** Riot's role-bound slot, added after this app's first version. */
const ROLE_BOUND: Target[] = [{ key: 'RoleBound', label: 'Role-bound spell' }]

const ITEMS: Target[] = [1, 2, 3, 4, 5, 6].map(slot => ({
    key: `Item${slot}`,
    label: `Item ${slot}`,
    used: true,
}))

const TRINKET: Target[] = [{ key: 'VisionItem', label: 'Trinket', used: true }]

export const CASTABLE = [...SPELLS, ...SUMMONERS, ...ROLE_BOUND, ...ITEMS, ...TRINKET]

/** The cast modes League gives every ability and item, in its own order. */
export const CAST_MODES = [
    { prefix: '', label: 'Default' },
    { prefix: 'NormalCast', label: 'Normal cast' },
    { prefix: 'SmartCast', label: 'Quick cast' },
    { prefix: 'SmartCastWithIndicator', label: 'Quick cast with indicator' },
    { prefix: 'SelfCast', label: 'Self cast' },
    { prefix: 'SmartPlusSelfCast', label: 'Quick self cast' },
    { prefix: 'SmartPlusSelfCastWithIndicator', label: 'Quick self cast with indicator' },
] as const

/**
 * The `evt*` name League uses for one target in one mode.
 *
 * The default mode is the odd one out: spells are `evtCastSpell1` but items are
 * `evtUseItem1`, and every other mode is a plain prefix.
 */
export const eventNameFor = (target: Target, prefix: string): string =>
    prefix === '' ? `evt${target.used ? 'Use' : 'Cast'}${target.key}` : `evt${prefix}${target.key}`

/** Every quickbind flag — the checkbox under each default binding. */
export const quickbindFor = (target: Target): string => `${eventNameFor(target, '')}smart`

export const QUICKBIND_REFS = CASTABLE.map(target => quickbind(quickbindFor(target)))

const castRow = (target: Target, prefix: string, slot: number): FieldDef =>
    keybind(event(eventNameFor(target, prefix)), target.label, slot)

export interface HotkeyTable {
    label: string
    /** One column per slot; League keeps two bindings for every action. */
    rows: FieldDef[][]
}

export interface HotkeyGroup {
    label: string
    tables: HotkeyTable[]
}

const SLOTS = [0, 1]

const castTable = (label: string, targets: Target[], prefix: string): HotkeyTable => ({
    label,
    rows: targets.map(target => SLOTS.map(slot => castRow(target, prefix, slot))),
})

const plain = (label: string, entries: [string, string][]): HotkeyTable => ({
    label,
    rows: entries.map(([key, name]) => SLOTS.map(slot => keybind(event(key), name, slot))),
})

const abilities = [...SPELLS, ...SUMMONERS, ...ROLE_BOUND]

export const HOTKEY_GROUPS: HotkeyGroup[] = [
    {
        label: 'Abilities and summoner spells',
        tables: CAST_MODES.map(mode => castTable(mode.label, abilities, mode.prefix)),
    },
    {
        label: 'Items and trinket',
        tables: CAST_MODES.map(mode => castTable(mode.label, [...ITEMS, ...TRINKET], mode.prefix)),
    },
    {
        label: 'Extra item slot',
        tables: [plain('Inventory', [['evtUseItem7', 'Item 7']])],
    },
    {
        label: 'Player movement',
        tables: [
            plain('Movement', [
                ['evtPlayerMoveClick', 'Move'],
                ['evtPlayerAttackMove', 'Attack move'],
                ['evtPlayerAttackMoveClick', 'Attack move click'],
                ['evtPlayerAttackOnlyClick', 'Attack only'],
                ['evtPlayerHoldPosition', 'Hold position'],
                ['evtPlayerStopPosition', 'Stop'],
                ['evtPetMoveClick', 'Pet move'],
                ['evtChampionOnly', 'Target champions only'],
            ]),
        ],
    },
    {
        label: 'Camera control',
        tables: [
            plain('Camera', [
                ['evtCameraLockToggle', 'Toggle camera lock'],
                ['evtCameraSnap', 'Centre camera'],
                ['evtDragScrollLock', 'Drag scroll lock'],
                ['evtEnableDirectedCamera', 'Directed camera'],
                ['evtScrollUp', 'Scroll up'],
                ['evtScrollDown', 'Scroll down'],
                ['evtScrollLeft', 'Scroll left'],
                ['evtScrollRight', 'Scroll right'],
                ['evtSelectSelf', 'Select self'],
                ['evtSelectAlly1', 'Select ally 1'],
                ['evtSelectAlly2', 'Select ally 2'],
                ['evtSelectAlly3', 'Select ally 3'],
                ['evtSelectAlly4', 'Select ally 4'],
            ]),
        ],
    },
    {
        label: 'Display',
        tables: [
            plain('In game', [
                ['evtDrawHud', 'Toggle HUD'],
                ['evtShowHealthBars', 'Show health bars'],
                ['evtShowSummonerNames', 'Show summoner names'],
                ['evtShowScoreBoard', 'Toggle scoreboard'],
                ['evtToggleMinionHealthBars', 'Toggle minion health bars'],
                ['evtChampMasteryDisplay', 'Champion mastery'],
                ['evtLevelSpell1', 'Level up spell 1'],
                ['evtLevelSpell2', 'Level up spell 2'],
                ['evtLevelSpell3', 'Level up spell 3'],
                ['evtLevelSpell4', 'Level up spell 4'],
            ]),
            {
                label: 'HUD',
                rows: [
                    ['evtHoldShowScoreBoard', 'Hold to show scoreboard'],
                    ['evtToggleDeathRecapShowcase', 'Toggle death recap'],
                    ['evtToggleFPSAndLatency', 'Toggle FPS and latency'],
                    ['evtToggleMouseClip', 'Toggle mouse clipping'],
                    ['evtTogglePlayerStats', 'Toggle player stats'],
                ].map(([key, name]) => SLOTS.map(slot => keybind(hudEvent(key), name, slot))),
            },
            plain('Spectating and replays', [
                ['evtToggleFogOfWar', 'Toggle fog of war'],
                ['evtToggleObserverVisibility', 'Toggle observer visibility'],
                ['evtToggleReplayUI', 'Toggle replay UI'],
            ]),
        ],
    },
    {
        label: 'Communication',
        tables: [
            plain('Pings', [
                ['evntPlayerPing', 'Ping'],
                ['evntPlayerPingCursor', 'Ping at cursor'],
                ['evntPlayerPingDanger', 'Danger ping'],
                ['evntPlayerPingCursorDanger', 'Danger ping at cursor'],
                ['evtPlayerPingRadialDanger', 'Radial danger ping'],
                ['evtPlayerPingOMW', 'On my way'],
                ['evtPlayerPingMIA', 'Enemy missing'],
                ['evtPlayerPingComeHere', 'Come here'],
                ['evtPlayerPingPush', 'Push'],
                ['evtPlayerPingAllIn', 'All in'],
                ['evtPlayerPingBait', 'Bait'],
                ['evtPlayerPingHold', 'Hold'],
                ['evtPlayerPingVisionNeeded', 'Vision needed'],
                ['evtPlayerPingVisionCleared', 'Vision cleared'],
                ['evtPlayerPingAreaIsWarded', 'Area is warded'],
                ['evtPlayerCursorPingAreaIsWarded', 'Area is warded at cursor'],
            ]),
            plain('Chat and voice', [
                ['evtChatHistory', 'Chat history'],
                ['evtPushToTalk', 'Push to talk'],
                ['evtPushToTalkTeam', 'Push to talk (team)'],
                ['evtShowVoicePanel', 'Show voice panel'],
            ]),
            plain('Emotes', [
                ['evtEmoteToggle', 'Toggle emotes'],
                ['evtEmoteDance', 'Dance'],
                ['evtEmoteJoke', 'Joke'],
                ['evtEmoteLaugh', 'Laugh'],
                ['evtEmoteTaunt', 'Taunt'],
                ['evtRadialEmoteOpen', 'Open emote wheel'],
                ['evtRadialEmoteInstantOpen', 'Open emote wheel instantly'],
                ['evtReciprocityTrigger', 'Fist bump'],
                ['evtReciprocityMyBadTrigger', 'My bad'],
                ...Array.from({ length: 9 }, (_, slot): [string, string] => [
                    `evtRadialEmotePlaySlot${slot}`,
                    `Emote wheel slot ${slot + 1}`,
                ]),
            ]),
        ],
    },
    {
        label: 'Shop and menus',
        tables: [
            plain('Menus', [
                ['evtOpenShop', 'Open shop'],
                ['evtSysMenu', 'System menu'],
                ['evtShowCharacterMenu', 'Character menu'],
                ['evtOnUIMouse4Pan', 'UI pan'],
            ]),
            {
                label: 'Item shop',
                rows: [
                    ['evtShopFocusSearch', 'Focus search'],
                    ['evtShopSwitchTabs', 'Switch tabs'],
                ].map(([key, name]) => SLOTS.map(slot => keybind(shopEvent(key), name, slot))),
            },
        ],
    },
    {
        label: 'Teamfight Tactics',
        tables: [
            plain('TFT', [
                ['evtTFTPurchaseXP', 'Buy XP'],
                ['evtTFTRerollShop', 'Reroll shop'],
            ]),
        ],
    },
]
