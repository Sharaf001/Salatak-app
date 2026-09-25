/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#173B3A',
    tint: '#1F5A55',

    // Core surfaces
    background: '#F6F3EC',
    foreground: '#173B3A',

    // Cards / elevated surfaces
    card: '#FFFCF6',
    cardForeground: '#173B3A',

    // Primary action color (buttons, links, active states)
    primary: '#1F5A55',
    primaryForeground: '#FFF9ED',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E4EEE9',
    secondaryForeground: '#1F5A55',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#EAE5DB',
    mutedForeground: '#6B7A74',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#E8C77D',
    accentForeground: '#684B1D',

    // Destructive actions (delete, error states)
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#D8DED7',
    input: '#D8DED7',

    // Product-specific semantic tokens
    deep: '#173B3A',
    deepMuted: '#376762',
    cream: '#FFF9ED',
    gold: '#D7A84C',
    coral: '#D97863',
    success: '#57936E',
    white: '#FFFFFF',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
