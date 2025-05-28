# TFE Survey - Theming Guide

This document explains how the theming system works in the TFE Survey application.

## CSS Variables Approach

The application uses CSS variables to manage theming consistently across the application. This allows for:

1. Centralized theme definition
2. Easy theme updates
3. Consistent use of brand colors
4. Support for dynamic theme switching if needed in the future

## Key Files

- `src/styles/theme.css`: Contains all CSS variables that define the theme
- `src/hooks/useTfeTheme.ts`: A React hook that provides programmatic access to theme values

## How to Use the Theme

### In CSS/Tailwind

You can use the theme variables directly in CSS classes:

```css
.my-element {
  background-color: var(--tfe-primary);
  color: white;
}
```

Or via Tailwind classes:

```jsx
<div className="bg-tfe-primary text-white">Content</div>
```

### In React Components

For inline styling or when you need programmatic access to theme values, use the `useTfeTheme` hook:

```jsx
import { useTfeTheme } from '../hooks/useTfeTheme';

function MyComponent() {
  const theme = useTfeTheme();
  
  return (
    <div style={{ 
      backgroundColor: theme.colors.primary,
      color: 'white'
    }}>
      Content
    </div>
  );
}
```

### Utility Styles

The theme hook provides common utility styles:

```jsx
// Button with primary gradient
<button style={{ ...theme.utils.buttonStyle }}>
  Click Me
</button>

// Icon container
<div style={{ ...theme.utils.iconContainerStyle('primary') }}>
  <Icon />
</div>

// Bullet point
<span style={{ ...theme.utils.bulletPointStyle }}></span>
```

## Theme Colors

The theme includes:

- **Primary**: #FF6B35 (Orange)
- **Secondary**: #004E89 (Blue)
- **Accent**: #00A8E8 (Light Blue)
- **Gradients**: Linear gradient from primary to accent
- **Gray Scale**: Various shades for text and UI elements

## Extending the Theme

To add new colors or styles:

1. Add new CSS variables in `src/styles/theme.css`
2. Update the Tailwind configuration in `tailwind.config.js` if needed
3. Update the `useTfeTheme` hook to expose the new colors or styles
