/**
 * Turning a browser event into the token League writes.
 *
 * League's vocabulary, taken from a config it wrote itself: lowercase letters,
 * digits, `Ctrl` `Alt` `Shift`, `Space` `Tab` `Esc` `Return`, `F1`–`F12`,
 * `Up Arrow` and friends, and `Button 1`–`Button 5`.
 */

const NAMED: Record<string, string> = {
    ' ': 'Space',
    Control: 'Ctrl',
    Meta: 'Ctrl',
    Enter: 'Return',
    Escape: 'Esc',
    ArrowUp: 'Up Arrow',
    ArrowDown: 'Down Arrow',
    ArrowLeft: 'Left Arrow',
    ArrowRight: 'Right Arrow',
}

/**
 * The DOM numbers mouse buttons from zero and puts the middle button second;
 * League numbers from one and puts the right button second. Passing
 * `event.button` straight through, as the first version did, mislabelled every
 * button on the mouse.
 */
const BUTTONS: Record<number, string> = {
    0: 'Button 1',
    1: 'Button 3',
    2: 'Button 2',
    3: 'Button 4',
    4: 'Button 5',
}

export const tokenForKey = (key: string): string => {
    const named = NAMED[key]
    if (named) return named

    return key.length === 1 ? key.toLowerCase() : key
}

export const tokenForButton = (button: number): string => BUTTONS[button] ?? `Button ${button + 1}`

/** Modifiers come first and in League's own order, however they were pressed. */
const ORDER = ['Ctrl', 'Alt', 'Shift']

export const orderTokens = (tokens: string[]): string[] => {
    const modifiers = ORDER.filter(name => tokens.includes(name))
    const rest = tokens.filter(token => !ORDER.includes(token))

    return [...modifiers, ...rest]
}
