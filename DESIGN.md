---
name: CUXR — Spatial identity
description: "A dark, open identity built around Cornell red, the CUXR wordmark, a floating bear, and project media."
colors:
  brand:
    primary: { light: "#b31b1b", dark: "#ed4444" }
    secondary: { light: "#891313", dark: "#b31b1b" }
    accent: { light: "#b31b1b", dark: "#ff7777" }
  neutral:
    background: { light: "#f5f5f6", dark: "#101113" }
    surface: { light: "#ffffff", dark: "#181a1e" }
    overlay: { light: "#e9e9ec", dark: "#23262b" }
    border: { light: "#d0d1d5", dark: "#3c4048" }
    text:
      primary: { light: "#17191c", dark: "#f0f0f2" }
      secondary: { light: "#555963", dark: "#afb2bb" }
  semantic:
    info: { light: "#555963", dark: "#afb2bb" }
    success: { light: "#24724e", dark: "#91c7ad" }
    warning: { light: "#875511", dark: "#e7bd7b" }
    error: { light: "#b31b1b", dark: "#ff7777" }
typography:
  h1: { fontFamily: "Geist Variable, Arial, sans-serif", fontSize: "7rem", fontWeight: 500, lineHeight: 1.04, letterSpacing: "-0.06em" }
  h2: { fontFamily: "Geist Variable, Arial, sans-serif", fontSize: "4.25rem", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.05em" }
  h3: { fontFamily: "Geist Variable, Arial, sans-serif", fontSize: "2rem", fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.035em" }
  body: { fontFamily: "Geist Variable, Arial, sans-serif", fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 }
  monospace: { fontFamily: "Geist Mono Variable, monospace", fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.5 }
rounded: { sm: "4px", md: "8px", lg: "16px", full: "9999px" }
spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "64px", section: "128px" }
---

## Direction

Projects lead; recruitment stays easy to find. The public site uses the dark palette. Light token values are counterparts for tooling, not a public theme. Use direct headings and factual copy. Keep CUXR as the public name and Cornell University as its affiliation.

## Color and type

Graphite is the main canvas. Use the lighter neutrals for controls and legibility, not boxed content. Cornell red marks branding, recruitment, and selected states; accent red makes links and focus visible on graphite. Keep the homepage hero black, transitioning into the shared graphite background. Avoid decorative gradients, neon, glass, and colored project cards.

Geist Sans carries headings and body copy. Geist Mono is for dates, categories, and useful small labels. The hero's CU/XR lettering uses Chakra Petch and Geist Pixel; elsewhere, preserve the established wordmark. Red CU and light XR remain together. Body copy starts at 16px and long descriptions stay narrow enough to read comfortably. Heading tokens are desktop caps; scale them fluidly on smaller screens. Do not add labels solely for visual decoration.

The hero description is an oversized near-white text block with a restrained, static Cornell-red registration edge. It should read as a deliberate secondary typographic element without competing with the wordmark or introducing another animation.

## Layout and imagery

Center content within a 1280px maximum width, with responsive gutters and generous section spacing. Favor open columns, fine rules, and alternating large media with concise explanation. Avoid repeated card grids, rounded media frames, and shadows. Depth comes from scale, overlap, negative space, and intentional image placement.

Use real project, team, and sponsor media. Keep logos and wordmarks in their original proportions. Transparent brand assets should remain legible against the dark canvas. The bear is a free-standing hero focal point, never a card. On narrow screens, preserve reading order and fit content within the viewport.

## Interaction and motion

Motion should clarify focus, selection, and progression. Use the shared timing and easing tokens for controls and content. Keep scrolling native. Text exposure may respond to scroll without moving whole content blocks; project media can move subtly where pointer and motion preferences support it. Respect reduced motion and keep essential content available without JavaScript.

Buttons need strong contrast, comfortable targets, and visible focus. Internal text links use `→`; external text links use `↗`. Filled and outlined buttons have no duplicate arrow. Icon-only links need accessible names.

## Page patterns

- **Home:** Pair restrained identity copy with the floating bear and ample empty space. Let the project showcase give each project equal weight, with adjacent previews. End with concise recruitment and sponsorship actions.
- **Projects:** Present an open, ruled index with equal-weight names and corresponding media/details. Selection must work by keyboard and direct URL hash; mobile details may expand inline.
- **Team:** Group members by subteam. Show full, uncropped portraits in open grids and use compact ruled entries when photos are unavailable. Keep contact actions in Email, LinkedIn, then optional Portfolio order. Details remain accessible by keyboard and touch.
- **Recruitment:** Keep eligibility, deadline, application action, process, and expectations clear and in sequence. Decorative headset and arm graphics stay subdued, preserve their source geometry, and never obscure content.
- **Sponsorship:** Lead with the funding overview, show funding areas beside real event photography, provide a browsable packet preview and PDF download, and close with a clear invitation.

## Guardrails

Use shared CSS tokens. Preserve factual content and configured recruitment windows. Keep hidden projects out of public output. Maintain semantic headings, real links, visible keyboard focus, WCAG AA contrast, reduced-motion support, and readable no-JavaScript fallbacks.
