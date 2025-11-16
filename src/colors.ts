/**
 * Soft Dark Monochrome Color Palette
 * Easy on the eyes with balanced contrast
 */

export const colors = {
  // Backgrounds
  background: '#1e1e1e',        // Main background - soft black
  surface: '#2a2a2a',           // Cards and elevated surfaces

  // Text
  textPrimary: '#e4e4e4',       // Primary text - soft white
  textSecondary: '#9e9e9e',     // Secondary text - medium gray
  textMuted: '#757575',         // Muted/disabled text

  // UI Elements
  border: '#3a3a3a',            // Borders and dividers
  progressBackground: '#333333', // Progress ring background
  progressActive: '#d0d0d0',    // Active progress ring

  // Interactive elements
  buttonPrimary: '#d0d0d0',     // Primary buttons
  buttonText: '#1e1e1e',        // Text on primary buttons
  iconPrimary: '#e4e4e4',       // Primary icons
  iconSecondary: '#9e9e9e',     // Secondary icons
} as const;
