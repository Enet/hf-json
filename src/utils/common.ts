export const noop = () => {};

// Add preceding backslash before the following characters: . [ ] \
export const escapeKey = (unescapedKey: string) => unescapedKey.replace(/([.\[\]\\])/g, '\\$1');

// Remove backslash before the following characters: . [ ] \
export const unescapeKey = (escapedKey: string) => escapedKey.replace(/\\([.\[\]\\])/g, '$1');
