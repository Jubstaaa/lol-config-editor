import { choice, game, percent, slider, toggle } from './catalog.builders'

import type { TabDef } from './catalog.types'

const COOLDOWN_FORMAT = [
    { label: 'None', value: '0' },
    { label: 'Seconds', value: '1' },
    { label: 'Minutes + seconds', value: '2' },
    { label: 'Minutes', value: '3' },
]

const NAME_TAG = [
    { label: 'None', value: '0' },
    { label: 'Summoner name', value: '1' },
    { label: 'Champion name', value: '2' },
]

const CHAT_VISIBILITY = [
    { label: 'Premade only (party)', value: '0' },
    { label: 'Same team (party/ally)', value: '1' },
    { label: 'Everyone (party/ally/all)', value: '2' },
]

const EMOTE_DISPLAY = [
    { label: 'On', value: '0' },
    { label: 'Mute sound', value: '1' },
    { label: 'Off', value: '2' },
]

const CAMERA_LOCK = [
    { label: 'Per-side offset', value: '0' },
    { label: 'Fixed offset', value: '1' },
    { label: 'Semi-locked', value: '2' },
]

export const TABS: TabDef[] = [
    {
        id: 'video',
        label: 'Video',
        groups: [
            {
                label: 'General',
                fields: [
                    toggle(game('General', 'RelativeTeamColors'), 'Use relative team colours', '0'),
                    toggle(game('General', 'EnableScreenShake'), 'Enable screen shake'),
                    toggle(game('HUD', 'ShowFPSAndLatency'), 'Show FPS and latency', '0'),
                ],
            },
            {
                label: 'Accessibility',
                hint: 'League writes these as 0–1; shown here as percentages.',
                fields: [
                    percent(game('Accessibility', 'ColorLevel'), 'Colour level'),
                    percent(game('Accessibility', 'ColorGamma'), 'Colour gamma'),
                    percent(game('Accessibility', 'ColorBrightness'), 'Colour brightness'),
                    percent(game('Accessibility', 'ColorContrast'), 'Colour contrast'),
                ],
            },
        ],
    },
    {
        id: 'sound',
        label: 'Sound',
        groups: [
            {
                label: 'Volume',
                fields: [
                    percent(game('Volume', 'MasterVolume'), 'Master volume'),
                    percent(game('Volume', 'MusicVolume'), 'Music volume', '0.7500'),
                    percent(game('Volume', 'AnnouncerVolume'), 'Announcer volume', '0.5900'),
                    percent(game('Volume', 'VoiceVolume'), 'Voice volume', '0.5900'),
                    percent(game('Volume', 'SfxVolume'), 'Sound FX volume', '0.7500'),
                    percent(game('Volume', 'AmbienceVolume'), 'Ambience volume', '0.7500'),
                    percent(game('Volume', 'PingsVolume'), 'Pings volume', '0.7500'),
                    percent(game('Volume', 'NotificationsVolume'), 'Notifications volume', '0.7500'),
                ],
            },
            {
                label: 'Mute channels',
                hint: 'League stores these the plain way round: 1 means muted.',
                fields: [
                    toggle(game('Volume', 'MasterMute'), 'Mute master', '0'),
                    toggle(game('Volume', 'MusicMute'), 'Mute music', '0'),
                    toggle(game('Volume', 'SfxMute'), 'Mute sound FX', '0'),
                    toggle(game('Volume', 'VoiceMute'), 'Mute voice', '0'),
                    toggle(game('Volume', 'AnnouncerMute'), 'Mute announcer', '0'),
                    toggle(game('Volume', 'AmbienceMute'), 'Mute ambience', '0'),
                    toggle(game('Volume', 'PingsMute'), 'Mute pings', '0'),
                    toggle(game('Volume', 'NotificationsMute'), 'Mute notifications', '0'),
                ],
            },
            {
                label: 'General',
                fields: [
                    toggle(game('General', 'EnableAudio'), 'Disable all sound', '1', { invert: true }),
                    choice(
                        game('General', 'ThemeMusic'),
                        'Theme music',
                        [
                            { label: 'Updated', value: '0' },
                            { label: 'Classic', value: '1' },
                        ],
                        '0'
                    ),
                ],
            },
            {
                label: 'Voice chat',
                fields: [
                    toggle(game('Voice', 'ShowVoiceChatHalos'), 'Show voice chat halos'),
                    toggle(game('Voice', 'ShowVoicePanelWithScoreboard'), 'Show voice panel with scoreboard'),
                ],
            },
        ],
    },
    {
        id: 'interface',
        label: 'Interface',
        groups: [
            {
                label: 'Interface size',
                fields: [
                    percent(game('HUD', 'GlobalScale'), 'HUD scale', '0.0000'),
                    percent(game('General', 'CursorScale'), 'Cursor scale'),
                    percent(game('HUD', 'ShopScale'), 'Shop scale', '0.4300'),
                    slider(game('HUD', 'ChatScale'), 'Chat scale', { min: 0, max: 100 }, '40'),
                    slider(
                        game('HUD', 'MinimapScale'),
                        'Minimap scale',
                        { min: 0, max: 100, scale: 33.3 },
                        '1.8000'
                    ),
                    percent(game('HUD', 'ObjectiveVoteScale'), 'Objective planning scale', '1.0000'),
                    percent(game('HUD', 'DeathRecapScale'), 'Death recap scale', '1.0000'),
                    percent(game('HUD', 'PracticeToolScale'), 'Practice tool scale', '1.0000'),
                ],
            },
            {
                label: 'Health and resource bars',
                fields: [
                    toggle(game('HUD', 'DrawHealthBars'), 'Show health bars'),
                    toggle(game('LossOfControl', 'LossOfControlEnabled'), 'Show loss of control UI'),
                    toggle(game('LossOfControl', 'ShowSlows'), 'Show slows in the loss of control UI', '0'),
                    toggle(game('Performance', 'EnableHUDAnimations'), 'Enable HUD animations'),
                    toggle(game('HUD', 'ShowHealthBarShake'), 'Show health bar animations'),
                    choice(game('HUD', 'NameTagDisplay'), 'Show names above health bar', NAME_TAG, '1'),
                    toggle(game('HUD', 'HidePlayerNames'), 'Hide player names', '0'),
                    toggle(game('HUD', 'ShowChampionIndicator'), 'Show champion indicator', '0'),
                ],
            },
            {
                label: 'Notifications',
                fields: [
                    toggle(game('HUD', 'FlashScreenWhenDamaged'), 'Screen flash on damage'),
                    toggle(game('HUD', 'FlashScreenWhenStunned'), 'Screen flash on loss of control'),
                    toggle(game('HUD', 'ShowOffScreenPointsOfInterest'), 'Show off-screen pings'),
                ],
            },
            {
                label: 'Legacy cursor',
                fields: [toggle(game('General', 'CursorOverride'), 'Enable legacy cursor', '0')],
            },
            {
                label: 'Ability and attack display',
                fields: [
                    toggle(game('HUD', 'AutoDisplayTarget'), 'Show target frame on attack'),
                    toggle(game('HUD', 'EnableLineMissileVis'), 'Enable line missile display'),
                    toggle(game('HUD', 'ShowAttackRadius'), 'Show attack range'),
                    toggle(game('HUD', 'DisableHudSpellClick'), 'Disable spell HUD click', '0'),
                    toggle(game('HUD', 'ShowSpellCosts'), 'Show spell costs'),
                    toggle(game('HUD', 'ShowSpellRecommendations'), 'Show spell recommendation'),
                    choice(
                        game('HUD', 'NumericCooldownFormat'),
                        'Ability cooldown display',
                        COOLDOWN_FORMAT,
                        '2'
                    ),
                ],
            },
            {
                label: 'Minimap',
                fields: [
                    toggle(game('HUD', 'ShowNeutralCamps'), 'Show neutral camps'),
                    toggle(game('HUD', 'FlipMiniMap'), 'Show minimap on left', '0'),
                    toggle(game('HUD', 'MinimapMoveSelf'), 'Allow minimap movement'),
                    toggle(game('HUD', 'MinimapEnableAllTimers'), 'Show all minimap timers', '0'),
                ],
            },
            {
                label: 'Scoreboard and team frames',
                fields: [
                    toggle(game('HUD', 'MirroredScoreboard'), 'Mirror scoreboard layout', '0'),
                    toggle(game('HUD', 'ShowSummonerNamesInScoreboard'), 'Show summoner names in scoreboard'),
                    toggle(game('HUD', 'ShowSummonerNames'), 'Show summoner names', '0'),
                    toggle(game('HUD', 'ShowTeamFramesOnLeft'), 'Show team frames on left', '0'),
                    toggle(game('HUD', 'ShowPlayerStats'), 'Show player stats'),
                    toggle(game('HUD', 'ShowPlayerPerks'), 'Show player runes', '0'),
                    toggle(game('HUD', 'ShowStatsPanel_StatStones'), 'Show the challenges stat panel', '0'),
                ],
            },
            {
                label: 'Chat',
                fields: [
                    choice(game('HUD', 'ChatChannelVisibility'), 'Chat visibility', CHAT_VISIBILITY, '2'),
                    toggle(game('HUD', 'ShowTimestamps'), 'Show timestamps', '0'),
                    toggle(game('HUD', 'ShowAlliedChat'), 'Show allied chat'),
                    toggle(game('HUD', 'ShowAllChannelChat'), 'Show all-channel chat', '0'),
                    toggle(
                        game('HUD', 'ShowAllChannelChatSpectator'),
                        'Show all-channel chat while spectating',
                        '0'
                    ),
                ],
            },
            {
                label: 'Emotes and reactions',
                fields: [
                    choice(
                        game('HUD', 'EmotePopupUIDisplayMode'),
                        'Emote bubble display',
                        EMOTE_DISPLAY,
                        '0'
                    ),
                    choice(
                        game('HUD', 'EmoteSize'),
                        'Emote size',
                        [
                            { label: 'Normal', value: '0' },
                            { label: 'Small', value: '1' },
                        ],
                        '0'
                    ),
                    toggle(game('HUD', 'HideEnemySummonerEmotes'), 'Mute enemy emotes', '0'),
                    toggle(game('HUD', 'HideReciprocityFist'), 'Mute fist bump and my bad', '0'),
                ],
            },
            {
                label: 'Combat text',
                fields: [
                    toggle(game('FloatingText', 'Damage_Enabled'), 'Damage'),
                    toggle(game('FloatingText', 'Heal_Enabled'), 'Heal'),
                    toggle(game('FloatingText', 'Gold_Enabled'), 'Gold'),
                    toggle(game('FloatingText', 'Invulnerable_Enabled'), 'Status'),
                    toggle(game('FloatingText', 'QuestReceived_Enabled'), 'Quest'),
                    toggle(game('FloatingText', 'ManaDamage_Enabled'), 'Mana', '0'),
                    toggle(game('FloatingText', 'EnemyDamage_Enabled'), 'Enemy damage'),
                    toggle(game('FloatingText', 'Dodge_Enabled'), 'Dodge'),
                    toggle(game('FloatingText', 'Level_Enabled'), 'Level'),
                    toggle(game('FloatingText', 'Special_Enabled'), 'Special'),
                    toggle(game('FloatingText', 'Score_Enabled'), 'Score'),
                    toggle(game('FloatingText', 'Experience_Enabled'), 'Experience', '0'),
                ],
            },
            {
                label: 'Item shop',
                fields: [
                    toggle(game('ItemShop', 'InvertDisplayOrder'), 'Invert display order', '0'),
                    toggle(game('ItemShop', 'InventoryPanelPinned'), 'Pin the inventory panel', '0'),
                    toggle(game('ItemShop', 'BootsPanelPinned'), 'Pin the boots panel', '0'),
                    toggle(game('ItemShop', 'ConsumablesPanelPinned'), 'Pin the consumables panel', '0'),
                ],
            },
        ],
    },
    {
        id: 'game',
        label: 'Game',
        groups: [
            {
                label: 'Controls',
                fields: [
                    toggle(game('General', 'OSXMouseAcceleration'), 'Use software mouse', '0', {
                        hint: 'Vertical sync must be off.',
                        wide: true,
                    }),
                    slider(
                        game('General', 'GameMouseSpeed'),
                        'Mouse speed',
                        { min: 0, max: 20, scale: 1 },
                        '10'
                    ),
                    percent(game('HUD', 'MapScrollSpeed'), 'Camera move speed (mouse)'),
                    percent(game('HUD', 'KeyboardScrollSpeed'), 'Camera move speed (keyboard)'),
                    percent(game('HUD', 'MiddleMouseScrollSpeed'), 'Camera move speed (middle mouse)'),
                    toggle(game('General', 'SnapCameraOnRespawn'), 'Move camera on revive'),
                    toggle(game('HUD', 'ScrollSmoothingEnabled'), 'Enable smooth camera', '0'),
                    toggle(game('HUD', 'MiddleClickDragScrollEnabled'), 'Mouse button drag scroll', '0'),
                    choice(game('HUD', 'CameraLockMode'), 'Camera lock mode', CAMERA_LOCK, '1'),
                ],
            },
            {
                label: 'Gameplay',
                fields: [
                    toggle(game('General', 'AutoAcquireTarget'), 'Auto attack'),
                    toggle(game('General', 'PredictMovement'), 'Use movement prediction', '0'),
                    toggle(
                        game('General', 'ShowTurretRangeIndicators'),
                        'Show turret range indicators (co-op vs AI)'
                    ),
                    toggle(game('General', 'EnableTargetedAttackMove'), 'Attack move on cursor'),
                    toggle(
                        game('General', 'EnableLeftMouseButtonAttackMove'),
                        'Left click triggers attack move',
                        '0'
                    ),
                    toggle(
                        game('General', 'TargetChampionsOnlyAsToggle'),
                        'Treat "target champions only" as a toggle'
                    ),
                    toggle(game('General', 'RecommendJunglePaths'), 'Display recommended jungle path', '0'),
                ],
            },
            {
                label: 'Quick cast with indicator',
                fields: [
                    toggle(
                        game('HUD', 'SmartCastOnKeyRelease'),
                        'Replace quick cast with quick cast with indicator in the quickbind UI',
                        '0',
                        { wide: true }
                    ),
                    toggle(
                        game('HUD', 'SmartCastWithIndicator_CastWhenNewSpellSelected'),
                        'Cast the pressed spell when another spell is pressed',
                        '0',
                        { wide: true }
                    ),
                ],
            },
            {
                label: 'Chat',
                fields: [toggle(game('Chat', 'EnableChatFilter'), 'Enable language filter')],
            },
        ],
    },
]
