---
name: SmartSearch
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#b9c7e0'
  on-secondary: '#233144'
  secondary-container: '#3c4a5e'
  on-secondary-container: '#abb9d2'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 48px
---

## Brand & Style

The design system is engineered for high-performance research and data synthesis. It targets professionals who require deep focus and cognitive clarity. The brand personality is authoritative yet unobtrusive, acting as a sophisticated conduit for information rather than a distraction.

The visual style is **Glassmorphic Minimalism**. It utilizes a dark-mode foundation to reduce eye strain during long research sessions. The aesthetic relies on the interplay of deep charcoal surfaces, subtle background blurs, and hyper-thin strokes to create a sense of depth and precision. The emotional response should be one of "digital calm" and "technical mastery."

## Colors

This design system utilizes a restricted "Midnight Slate" palette. The foundation is built on `#0A0A0A` for the background to ensure infinite depth, while `#121212` serves as the primary surface color for elevated containers. 

**Primary Blue (#3B82F6)** is reserved strictly for high-priority actions, active states, and focus indicators. 
**Slate (#334155)** is used for secondary UI elements, such as inactive borders, icons, and metadata labels, providing a softer transition between the background and foreground.

## Typography

The typography system relies exclusively on **Inter** to maintain a systematic, utilitarian feel. 

Headings use a slightly tighter letter spacing for a compact, modern appearance, while labels and data points use increased tracking to ensure legibility against dark backgrounds. Tracking (letter-spacing) is a critical lever in this system; display titles should feel airy and premium, whereas body text remains grounded for long-form reading.

## Layout & Spacing

This design system uses a **Fixed-Fluid Hybrid** model. The sidebar remains fixed at 280px, while the main content area occupies the remaining width up to a maximum of 1440px. 

A strict 8px grid governs all internal component spacing. Generous whitespace is prioritized to prevent the "data-heavy" dashboard feel, using `unit-xl` (48px) to separate major sections. On mobile, margins compress to 16px and the sidebar transitions to a hidden drawer.

## Elevation & Depth

Depth is conveyed through **Glassmorphism and Tonal Layering**. 

1.  **Level 0 (Base):** Pure `#0A0A0A`.
2.  **Level 1 (Cards):** Semi-transparent `glass_fill_hex` with a `20px` backdrop blur and a `1px` solid border (`glass_stroke_hex`).
3.  **Level 2 (Modals/Popovers):** Higher opacity fills with a subtle `0 20px 40px rgba(0,0,0,0.4)` outer shadow to separate the element from the blurred background.

Avoid heavy drop shadows. Use light-based indicators (subtle top-inner glows) to suggest surface height.

## Shapes

The design system utilizes a **Rounded (0.5rem)** logic. This softens the technical nature of the dashboard without making it feel "bubbly" or informal. 

Search bars and primary action buttons use `rounded-xl` (1.5rem) to differentiate them from the structural grid of cards and modules. Icons must follow the same corner radius logic where applicable.

## Components

-   **Search Bar:** The centerpiece. A high-radius input with a 24px backdrop blur. On focus, it emits a soft `primary_color` outer glow (8px blur, 0.2 opacity).
-   **Glassmorphic Cards:** Elements use the `glass_fill_hex` and `glass_stroke_hex`. Header areas within cards are separated by a subtle 1px horizontal line.
-   **Sidebar:** A vertical nav with minimal Lucide-style icons. Active states use a "ghost" background with a 2px vertical accent bar of the primary blue on the far left.
-   **Buttons:**
    -   *Primary:* Solid `#3B82F6` with white text.
    -   *Secondary:* Transparent with a 1px `glass_stroke_hex` and blurred background.
-   **Inputs:** Minimalist fields with labels in `label-md` style. Focus state changes the border to `primary_color_hex`.
-   **Chips/Tags:** Small `rounded-lg` elements using `#334155` at 30% opacity for a subtle, integrated look.