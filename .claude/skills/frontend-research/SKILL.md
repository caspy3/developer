---
name: frontend-research
description: Reverse engineer front-end designs from website URLs. Use this skill when the user provides a website link and asks to research, investigate, analyze, or reverse engineer the design, UI, or aesthetic. Produces comprehensive design guides with both conceptual insights and concrete implementation values.
---

This skill guides the reverse engineering of front-end designs from live websites, extracting both the philosophy behind design decisions and the concrete values needed to recreate them. Apply the same meticulous attention to detail as creating original designs.

The user provides a website URL and asks to analyze, research, or reverse engineer the design. They may specify particular aspects to focus on or pages to prioritize.

## Analysis Approach

Before documenting, understand the design holistically:
- **Brand Context**: What is this company/product? Who is their audience?
- **Aesthetic Classification**: What design tradition does this belong to? (minimalist, brutalist, editorial, luxury, playful, corporate, etc.)
- **Distinctive Elements**: What makes this design memorable? What's the signature move?
- **Design Maturity**: Is this a polished production site or early-stage?

**CRITICAL**: Look beyond surface elements. Identify the underlying system and intentionality. A great analysis reveals the "why" behind every "what."

## Page Scope

Focus analysis on key page types:
- Homepage (primary focus)
- About/Company page
- Contact page
- Product/Service pages
- Any distinctive landing pages

Note template variations and consistent patterns across pages.

## Output Structure

Deliver a combined Design Guide + Implementation Blueprint:

### 1. Design Overview
- **Aesthetic Classification**: Name the design tradition/style
- **Mood & Personality**: 3-5 adjectives capturing the feel
- **Brand Voice**: How does the visual design communicate?
- **Comparable References**: "Similar to [known brand/design system]" with specifics
- **Signature Elements**: What makes this design identifiable?

### 2. Typography System

**Conceptual**: Describe the typographic hierarchy and personality

**Concrete Values**:
```css
/* Font Families */
--font-display: [exact font name];
--font-body: [exact font name];
--font-mono: [if applicable];

/* Font Sizes */
--text-xs: [value];
--text-sm: [value];
--text-base: [value];
--text-lg: [value];
--text-xl: [value];
--text-2xl: [value];
/* ... continue scale */

/* Font Weights */
--font-normal: [value];
--font-medium: [value];
--font-bold: [value];

/* Line Heights */
--leading-tight: [value];
--leading-normal: [value];
--leading-relaxed: [value];

/* Letter Spacing */
--tracking-tight: [value];
--tracking-normal: [value];
--tracking-wide: [value];
```

### 3. Color Palette

**Conceptual**: Describe the color strategy and emotional impact

**Concrete Values**:
```css
/* Primary Colors */
--color-primary: [hex];
--color-primary-light: [hex];
--color-primary-dark: [hex];

/* Secondary Colors */
--color-secondary: [hex];

/* Accent Colors */
--color-accent: [hex];

/* Neutrals */
--color-background: [hex];
--color-surface: [hex];
--color-text-primary: [hex];
--color-text-secondary: [hex];
--color-text-muted: [hex];
--color-border: [hex];

/* Semantic Colors */
--color-success: [hex];
--color-warning: [hex];
--color-error: [hex];

/* Gradients (if used) */
--gradient-primary: [full value];
```

### 4. Spatial System

**Conceptual**: Describe spacing philosophy (generous, tight, varied)

**Concrete Values**:
```css
/* Spacing Scale */
--space-1: [value];
--space-2: [value];
--space-3: [value];
--space-4: [value];
--space-6: [value];
--space-8: [value];
--space-12: [value];
--space-16: [value];
--space-24: [value];

/* Container Widths */
--container-sm: [value];
--container-md: [value];
--container-lg: [value];
--container-xl: [value];

/* Grid */
--grid-columns: [value];
--grid-gap: [value];

/* Border Radius */
--radius-sm: [value];
--radius-md: [value];
--radius-lg: [value];
--radius-full: [value];
```

### 5. Component Patterns

Document key components with implementation notes:

**Navigation**
- Structure and behavior
- Mobile treatment
- Active/hover states

**Buttons**
- Variants (primary, secondary, ghost, etc.)
- Sizes
- States (hover, active, disabled)
- Border radius, padding, font treatment

**Cards**
- Shadow treatment
- Border treatment
- Padding patterns
- Image handling

**Forms**
- Input styling
- Label treatment
- Validation states
- Focus states

**Other Notable Components**
- Document any distinctive UI elements

### 6. Motion & Interactions

**Conceptual**: Describe the motion personality (snappy, smooth, playful, subtle)

**Concrete Values**:
```css
/* Transitions */
--transition-fast: [value];
--transition-base: [value];
--transition-slow: [value];

/* Easing */
--ease-default: [value];
--ease-in: [value];
--ease-out: [value];
--ease-in-out: [value];
```

**Observed Animations**:
- Page load behaviors
- Scroll-triggered effects
- Hover interactions
- Micro-interactions

### 7. Visual Textures & Effects

Document atmospheric elements:
- Background treatments (solid, gradient, pattern, texture)
- Shadow system (subtle, dramatic, layered)
- Border treatments
- Overlay effects
- Grain/noise textures
- Blur effects
- Custom cursors

### 8. Observations & Notes

**Accessibility**:
- Color contrast observations
- Focus state visibility
- Text sizing/readability

**Responsiveness**:
- Breakpoint behavior
- Mobile adaptations
- Layout shifts

**Performance**:
- Image optimization approach
- Animation performance
- Loading strategies

**Areas of Excellence**:
- What does this site do particularly well?

**Potential Concerns**:
- Any issues or inconsistencies noted

## Analysis Quality Standards

- Extract ACTUAL values from the site (use browser dev tools mentally)
- Identify patterns, not just individual instances
- Note exceptions and variations to the system
- Provide enough detail to recreate the design system
- Distinguish between intentional design choices and inconsistencies
- Compare to industry standards and notable references

**IMPORTANT**: This is forensic design analysis. Be thorough, precise, and observant. The goal is a document that could guide faithful recreation of the design system.
