# Color Palettes & Design System

## Purpose

This document defines the recommended color palettes and semantic color system for the study/opposition-preparation app.

The goal is not simply to make the interface attractive. Colors should help users:

- Read and study for long periods with low visual fatigue.
- Understand hierarchy at a glance.
- Associate specific colors with specific types of information.
- Distinguish important concepts without turning the interface into a rainbow.
- Maintain a coherent visual language across notes, study views, flashcards, tests, calendar and other features.
- Support both light and dark modes.

The designer should treat these palettes as a starting point and refine them through accessibility, contrast and usability testing.

---

# 1. Core Design Principles

## 1.1 Semantic colors over decorative colors

Every significant color should have a purpose.

Recommended semantic mapping:

| Color role | Meaning |
|---|---|
| Blue | Structure, information, navigation |
| Yellow | Important information / memorization |
| Green | Examples, correct answers, positive information |
| Red | Exceptions, errors, warnings |
| Purple | Tricks, mnemonics, special study aids |
| Orange | Frequently tested / attention |
| Neutral | Normal content and secondary information |

The user should be able to learn these associations over time.

## 1.2 Avoid excessive saturation

This is a study application, not a social-media interface.

Avoid:

- Very saturated backgrounds.
- Large areas of pure red, green, blue or yellow.
- Using a different bright color for every UI component.
- Using color as the only way to communicate meaning.

Prefer muted, slightly desaturated colors.

## 1.3 Long-session comfort

The application is expected to be used for long study sessions.

For light mode:

- Prefer warm/off-white backgrounds over pure white.
- Avoid pure black text where possible.
- Keep large surfaces neutral.
- Reserve stronger colors for hierarchy and semantic emphasis.

For dark mode:

- Prefer dark blue/gray backgrounds rather than pure black.
- Avoid pure white text.
- Keep semantic colors somewhat muted.

---

# 2. Recommended Primary Palette

## Academic Blue

This should be the default visual identity.

| Role | Color | Hex |
|---|---|---|
| Primary dark | Academic Navy | `#1E3A5F` |
| Primary | Academic Blue | `#4F81BD` |
| Secondary | Blue Gray | `#527D8A` |
| Light surface | Pale Blue | `#DCEAF7` |
| Background | Warm Off-White | `#FAFAF7` |
| Text | Charcoal | `#303840` |

### Intended use

- Main headings: `#1E3A5F`
- Secondary headings: `#527D8A`
- Links / interactive elements: `#4F81BD`
- Informational cards: `#DCEAF7`
- Main background: `#FAFAF7`
- Body text: `#303840`

This is the recommended default palette for the application.

---

# 3. Semantic Study Palette

These colors should remain consistent throughout the product.

## Important / Memorize

**Yellow**

- Background: `#FFF1B8`
- Strong accent: `#E6C86E`
- Text: use a sufficiently dark neutral such as `#4A4325`

Meaning:

> "This is something I should remember."

Examples:

- Key dates.
- Articles of law.
- Definitions.
- Numbers.
- Important facts.
- Frequently confused concepts.

---

## Example / Correct / Positive

**Green**

- Background: `#DCEBD8`
- Accent: `#6F9B72`
- Text: `#29402C`

Meaning:

> "This illustrates the concept or represents a positive/correct state."

Examples:

- Examples.
- Correct test answers.
- Completed study goals.
- Successful results.

---

## Exception / Warning / Error

**Red**

- Background: `#F3D6D6`
- Accent: `#B96B6B`
- Text: `#552B2B`

Meaning:

> "Pay special attention: this is an exception, error or warning."

Examples:

- Legal exceptions.
- Common mistakes.
- Incorrect test answers.
- Warnings.

Red should be used sparingly.

---

## Mnemonic / Study Trick

**Purple**

- Background: `#E4DDF5`
- Accent: `#8172A8`
- Text: `#40375A`

Meaning:

> "This is a learning aid."

Examples:

- Mnemonics.
- Memory tricks.
- Associations.
- Shortcuts.
- Study strategies.

---

## Frequently Tested / Attention

**Orange**

- Background: `#F2DECC`
- Accent: `#C1845B`
- Text: `#513A2C`

Meaning:

> "This deserves extra attention."

Examples:

- Frequently asked exam topics.
- High-priority sections.
- Topics with high historical exam frequency.

---

# 4. Full Recommended Light Palette

```text
Background
#FAFAF7

Surface
#FFFFFF

Surface secondary
#F2F4F5

Text primary
#303840

Text secondary
#64717A

Text muted
#8A949B

Border
#DDE2E5

Primary dark
#1E3A5F

Primary
#4F81BD

Secondary
#527D8A

Info background
#DCEAF7

Important background
#FFF1B8

Positive background
#DCEBD8

Warning background
#F2DECC

Error / exception background
#F3D6D6

Mnemonic background
#E4DDF5
```

---

# 5. Alternative Palettes

These alternatives can be explored during visual design.

## 5.1 Sage / Natural

A calm palette particularly suitable for very long reading sessions.

```text
Dark green       #355E3B
Sage             #789B7A
Pale green       #E5EFE5
Cream            #F3E8C8
Muted pink       #E8C8C8
Background       #FAF9F4
```

Character:

- Calm.
- Natural.
- Less institutional.
- Comfortable for reading.

Potential use:

- Alternative theme.
- Reading-focused study mode.

---

## 5.2 Blue + Lavender

A modern academic palette.

```text
Deep teal        #24566A
Blue gray        #527D8A
Lavender         #DCD6F7
Cream yellow     #F5E6A8
Pale pink        #E8CFE0
Background       #F8F9FA
```

Character:

- Modern.
- Academic.
- Slightly more expressive.
- Good candidate for the main product identity if the brand wants a less traditional look.

---

## 5.3 Minimal Monochrome

For users who prefer extremely clean notes.

```text
Charcoal         #263238
Blue gray        #546E7A
Light gray       #CFD8DC
Highlight        #FFF1B8
Positive         #D7E8D4
Background       #FFFFFF
```

Important principle:

Use yellow as the dominant semantic highlight and keep everything else neutral.

---

## 5.4 Terracotta / Cream

A warmer and more distinctive alternative.

```text
Dark brown       #5D4037
Terracotta       #B86F52
Peach            #F3D5C8
Mustard          #E6C86E
Olive            #CDD5AE
Cream            #FAF5EB
```

This should be treated as an alternative visual theme rather than the default academic UI.

---

# 6. Dark Mode

Dark mode should not simply invert the light palette.

Recommended base:

```text
Background       #121820
Surface          #1B2530
Surface elevated #222E3A

Text primary     #E8EDF2
Text secondary   #AAB5BE
Text muted       #7F8A93

Border           #35424D

Primary           #8AB4D6
Info              #91BBD4
Important         #D8C78F
Positive          #91B89A
Warning           #C99A72
Error             #C98F8F
Mnemonic          #A89ACB
```

### Dark mode principles

Do not use:

- `#000000` as the main background.
- `#FFFFFF` for all text.
- Extremely bright semantic colors.

Instead, use slightly tinted dark surfaces and muted accents.

---

# 7. Typography + Color Hierarchy

Color should reinforce typography, not replace it.

Recommended hierarchy:

### H1 / Page title

Academic Navy:

`#1E3A5F`

Large, strong typography.

### H2

Blue Gray:

`#527D8A`

### H3

Primary text:

`#303840`

### Body

Primary text:

`#303840`

### Secondary information

`#64717A`

### Metadata

`#8A949B`

### Links / interactive

`#4F81BD`

Do not make every heading a different color.

---

# 8. Notes / Study Content

The note editor should support semantic blocks.

Example:

```text
┌──────────────────────────────────────┐
│ Definition                           │
│ Light blue information block         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ⭐ IMPORTANT                         │
│ Yellow memorization block            │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Example                              │
│ Green example block                  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ⚠ EXCEPTION                         │
│ Red exception block                  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 🧠 MNEMONIC                         │
│ Purple memory trick block            │
└──────────────────────────────────────┘
```

The exact icons are illustrative. The designer should ensure the interface remains accessible without relying exclusively on icons or colors.

---

# 9. Flashcards

Recommended semantic states:

| State | Suggested treatment |
|---|---|
| New | Neutral / blue |
| Learning | Yellow |
| Known | Green |
| Difficult | Orange |
| Again / Incorrect | Red |
| Mnemonic available | Purple indicator |

Avoid turning the entire flashcard background into a saturated color.

Use a subtle border, badge, icon or small accent area instead.

---

# 10. Tests

Tests should have a very restrained semantic language.

### Before answering

Neutral.

### Correct

Subtle green background/accent.

### Incorrect

Subtle red background/accent.

### Explanation

Blue informational block.

### Important rule

Yellow.

The answer UI should never become visually overwhelming after several questions.

---

# 11. Calendar / Planning

Calendar colors should represent categories rather than arbitrary decoration.

Possible categories:

- Study session → Blue
- Review → Purple
- Exam / mock exam → Orange
- Completed → Green
- Important deadline → Yellow
- Problem / missed session → Red

Use colored dots, side borders or small indicators rather than completely filling calendar cells whenever possible.

---

# 12. Accessibility Requirements

The designer must validate the final colors against WCAG contrast requirements.

Important:

- Do not assume that a visually pleasing combination is accessible.
- Check normal text and large text separately.
- Check interactive states.
- Check disabled states.
- Check focus indicators.
- Test the interface with color-vision deficiencies.
- Never communicate information using color alone.

Semantic colors should have a secondary representation:

```text
Yellow + "Important"
Green + "Correct"
Red + "Exception"
Purple + "Mnemonic"
Orange + "High priority"
```

---

# 13. Recommended Color Token Architecture

The implementation should use semantic design tokens rather than hard-coding hex values throughout the application.

Example conceptual structure:

```text
color.background
color.surface
color.surface-elevated

color.text.primary
color.text.secondary
color.text.muted

color.border

color.primary
color.primary-hover

color.info.background
color.info.accent

color.important.background
color.important.accent

color.success.background
color.success.accent

color.warning.background
color.warning.accent

color.error.background
color.error.accent

color.mnemonic.background
color.mnemonic.accent
```

This makes future theme changes much easier.

---

# 14. Designer Recommendation

The recommended design direction is:

**"Academic, calm, modern and highly readable."**

The application should feel closer to:

- a premium study tool,
- a well-designed digital notebook,
- a focused productivity application,

than to:

- a gamified children's learning app,
- a social network,
- a flashy productivity dashboard.

The visual system should communicate:

**Focus → Structure → Clarity → Memory**

rather than visual excitement.

---

# 15. Suggested First Design Direction

For the first high-fidelity design, use:

### Base

- Background: `#FAFAF7`
- Surface: `#FFFFFF`
- Text: `#303840`
- Primary: `#1E3A5F`
- Secondary: `#527D8A`

### Semantic

- Important: `#FFF1B8`
- Success/example: `#DCEBD8`
- Exception/error: `#F3D6D6`
- Mnemonic: `#E4DDF5`
- Attention: `#F2DECC`
- Information: `#DCEAF7`

This should be the **baseline visual system** before experimenting with alternative themes.

---

# 16. Deliverable Expected From Designer

The designer should turn this document into:

1. A complete light theme.
2. A complete dark theme.
3. A semantic color-token system.
4. Components demonstrating each semantic color.
5. Note examples using all semantic blocks.
6. Flashcard states.
7. Test answer states.
8. Calendar category states.
9. Hover/focus/active/disabled states.
10. Accessibility/contrast validation.
11. A small visual style guide documenting when each color should and should not be used.

The final system should remain coherent even if the user creates hundreds of pages of study material.

---

## Final principle

**Color is a navigation and memory system, not decoration.**

If a color is introduced, it should have a reason.

The user should eventually be able to glance at a page and intuitively understand:

- What is important.
- What must be memorized.
- What is an example.
- What is an exception.
- What is a mnemonic.
- What requires attention.

without having to consciously interpret the interface.


---

# 17. Paperlike Mode

## Concept

The application should include a dedicated **Paperlike Mode** designed to simulate the visual experience of studying on physical paper.

This should not simply mean changing the background to beige.

The goal is to reproduce the **visual calm and material feeling of a printed study document**, while retaining the advantages of a digital interface.

Paperlike Mode should be especially suitable for:

- Long reading sessions.
- Studying legislation and dense text.
- Reviewing notes.
- Reading PDFs or study material.
- Users who find conventional bright white screens tiring.
- Users who prefer the feeling of a physical notebook.

The design should feel like:

> **"A very good digital notebook made from high-quality paper."**

rather than:

> **"A website with a beige background."**

---

## 17.1 Paperlike Design Principles

### Warm background

Avoid pure white.

Use warm paper tones such as:

- Ivory.
- Cream.
- Natural paper.
- Warm gray.
- Slightly yellowed paper.

### Soft contrast

The contrast should remain high enough for comfortable reading, but should avoid the extremely stark:

`#FFFFFF` background + `#000000` text.

Prefer combinations such as:

```text
Paper: #F6F1E7
Ink:   #34312D
```

### Subtle material feeling

The effect should be extremely subtle.

Possible visual details:

- Very light paper texture.
- Slightly imperfect/warm background.
- Subtle separation between pages.
- Paper-like cards.
- Thin, low-contrast borders.
- Gentle shadows where a sheet sits above another surface.

Avoid:

- Strong noise.
- Fake parchment effects.
- Visible "old paper" stains.
- Heavy textures.
- Excessive shadows.
- Skeuomorphism that makes the UI look dated.

The user should notice the feeling of paper more than the actual texture.

---

# 18. Paperlike Themes

Paperlike Mode should support multiple **paper themes**.

The themes should change the paper, ink and accent colors while preserving the same semantic color system.

## 18.1 Classic Ivory

The recommended default.

```text
Paper              #F6F1E7
Paper secondary    #EEE8DC
Ink                #34312D
Secondary ink      #68615A
Border             #D9D1C4

Primary             #405A72
Secondary           #667C8C
```

Character:

- Classic.
- Warm.
- Academic.
- Similar to a high-quality notebook.

This should be the default Paperlike theme.

---

## 18.2 Warm Notebook

A slightly warmer and more traditional notebook appearance.

```text
Paper              #F4EBDD
Paper secondary    #EDE1D0
Ink                #3B342E
Secondary ink      #70655B
Border             #D8CABB

Primary             #5B6570
Secondary           #8A7664
```

Character:

- Warm.
- Comfortable.
- Traditional.
- Good for handwritten-style notes.

---

## 18.3 Cool Paper

For users who prefer a cleaner, less yellow paper.

```text
Paper              #F1F3F1
Paper secondary    #E7EBEA
Ink                #30383A
Secondary ink      #667174
Border             #D3D9D9

Primary             #405F70
Secondary           #67818D
```

Character:

- Cleaner.
- More modern.
- Less warm.
- Good for users who dislike cream backgrounds.

---

## 18.4 Sage Paper

A subtle green-tinted paper.

```text
Paper              #F0F3EA
Paper secondary    #E5EADF
Ink                #30372F
Secondary ink      #657064
Border             #D0D8CB

Primary             #4E6B56
Secondary           #718674
```

Character:

- Calm.
- Natural.
- Excellent for long reading sessions.
- Distinctive without being distracting.

---

## 18.5 Blue Paper

A very subtle blue-gray paper.

```text
Paper              #EEF2F4
Paper secondary    #E4EAED
Ink                #30373B
Secondary ink      #657178
Border             #D0D9DE

Primary             #3F6175
Secondary           #6C8796
```

Character:

- Cool.
- Professional.
- Academic.
- Particularly suitable for legal/technical material.

---

## 18.6 Rose Paper

A very subtle warm pink paper.

```text
Paper              #F5EEEE
Paper secondary    #ECE2E3
Ink                #393334
Secondary ink      #706467
Border             #D9CDCF

Primary             #765D67
Secondary           #967985
```

Character:

- Soft.
- Elegant.
- More personal.
- Should remain very subtle.

---

# 19. Paperlike Semantic Colors

Semantic colors should also be adapted to the paper environment.

They should look like **colored pencil, highlighter or muted ink**, rather than modern UI badges.

## Important / Memorize

```text
Background: #F4E6A8
Accent:     #C7A94A
Ink:        #514725
```

Visual metaphor:

**Yellow highlighter on paper.**

---

## Example / Correct

```text
Background: #DCE7D6
Accent:     #708C68
Ink:        #30402D
```

Visual metaphor:

**Soft green pencil / annotation.**

---

## Exception / Error

```text
Background: #EBD5D3
Accent:     #A76C68
Ink:        #512F2D
```

Visual metaphor:

**Red pencil correction.**

Use carefully. It should not feel like an alert-heavy web application.

---

## Mnemonic

```text
Background: #E2DAEC
Accent:     #806D99
Ink:        #40354D
```

Visual metaphor:

**Purple study annotation.**

---

## High Priority

```text
Background: #EEDCCB
Accent:     #B7794E
Ink:        #503727
```

Visual metaphor:

**Orange pencil/highlighter.**

---

## Information

```text
Background: #D9E5EA
Accent:     #5F7F8D
Ink:        #30434B
```

Visual metaphor:

**Blue marginal annotation.**

---

# 20. Paperlike "Study Sheet" Concept

In Paperlike Mode, study content should be allowed to visually behave like a sheet of paper.

Example conceptual hierarchy:

```text
┌──────────────────────────────────────────┐
│                                          │
│  TEMA 4                                  │
│  Organización administrativa             │
│                                          │
│  ──────────────────────────────────────  │
│                                          │
│  4.1 Concepto                            │
│                                          │
│  Normal study text should look like      │
│  printed text on paper.                  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 🟡 IMPORTANTE                      │  │
│  │ This should be remembered.         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Ejemplo:                                │
│  ┌────────────────────────────────────┐  │
│  │ 🟢 Example content                 │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

The "page" should have generous margins and comfortable line length.

---

# 21. Paperlike Typography

Typography is particularly important in this mode.

Recommended characteristics:

- Comfortable reading size.
- Generous line height.
- Moderate paragraph width.
- Clear hierarchy.
- Avoid excessively bold typography.
- Avoid excessive use of uppercase.

Potentially offer two font personalities:

### Sans-serif paper

Clean modern textbook.

### Serif paper

Traditional printed-book feeling.

The serif option could use a restrained book-like typeface, but readability must take priority.

---

# 22. Optional Paper Texture

Texture should be an **optional enhancement**, not a requirement.

Recommended approach:

```text
Base paper color
        +
extremely subtle texture
        +
normal UI content
```

The texture should be:

- Very low contrast.
- Fine-grained.
- Static or extremely subtle.
- Not distracting while scrolling.

Provide a setting such as:

**Paper texture**
- Off
- Subtle
- Natural

Default: **Subtle**.

Do not make the texture strong enough to interfere with text rendering.

---

# 23. Paperlike Themes vs Application Themes

These are two different concepts.

### Application theme

Controls the general UI:

- Light
- Dark
- Paperlike

### Paperlike theme

Controls the paper appearance:

- Classic Ivory
- Warm Notebook
- Cool Paper
- Sage Paper
- Blue Paper
- Rose Paper

Conceptually:

```text
Appearance
├── Light
├── Dark
└── Paperlike
    ├── Classic Ivory
    ├── Warm Notebook
    ├── Cool Paper
    ├── Sage Paper
    ├── Blue Paper
    └── Rose Paper
```

This allows the product to have a powerful personalization system without multiplying completely independent UI designs.

---

# 24. Recommended Paperlike UX

The user should be able to switch modes easily.

Suggested settings:

```text
Appearance

○ Light
○ Dark
● Paperlike

Paper

Theme
[ Classic Ivory ▾ ]

Texture
[ Subtle ▾ ]

Typography
[ Sans-serif ▾ ]
```

The exact UI is up to the designer.

The important principle is that Paperlike should feel like a **first-class application mode**, not an afterthought.

---

# 25. Paperlike and Accessibility

Paperlike must still satisfy accessibility requirements.

Important:

- Warm paper does not automatically mean better accessibility.
- Check text/background contrast.
- Check focus states.
- Check selected states.
- Check semantic annotations.
- Test with color-vision deficiencies.
- Never depend exclusively on subtle color differences.

If a paper theme reduces contrast too much, the text color should be adjusted rather than simply accepting the lower contrast.

---

# 26. Recommended Product Direction

The strongest overall visual system would be:

### Light

**Academic digital notebook**

Clean, bright, structured.

### Dark

**Focused night study**

Dark blue-gray, low glare, restrained accents.

### Paperlike

**Digital paper notebook**

Warm, calm, tactile, reading-first.

All three modes should share:

- The same semantic meanings.
- The same component structure.
- The same information hierarchy.
- The same interaction patterns.

Only the visual atmosphere should change.

---

# 27. Design Goal

The final experience should allow the user to choose the environment that best matches the task:

**Light → Organizing / planning / general use**

**Dark → Night study / low-light environments**

**Paperlike → Deep reading / long study sessions / note review**

The user should feel that they are choosing between three coherent study environments, not three unrelated themes.

---

# 28. Final Recommendation

For the first implementation, prioritize:

1. Light — Academic Blue
2. Dark — Focused Night
3. Paperlike — Classic Ivory
4. Paperlike theme selector
5. Semantic study colors
6. Accessibility validation
7. Optional subtle texture

Do not initially implement six completely different visual systems.

Build one strong design-token architecture and derive the themes from it.

**Paperlike should be treated as a major product feature because the app's primary use case is prolonged reading and studying.**
