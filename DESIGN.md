---
name: CUXR — Spatial identity
description: "A dark spatial identity: a floating red bear, restrained asymmetric typography, open project showcases, and deliberately unboxed content."
colors:
  primary: "#ed4444"
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
  accent: { fontFamily: "Geist Pixel Square, monospace", fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 }
rounded: { sm: "4px", md: "8px", lg: "16px", full: "9999px" }
spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "64px", section: "128px" }
elevation:
  sm: { light: "0 2px 8px #17191c0a", dark: "none" }
  md: { light: "0 8px 24px #17191c0a", dark: "none" }
  lg: { light: "0 16px 48px #17191c0a", dark: "none" }
---

## Overview
Student-built interfaces beyond the screen. Projects lead, recruitment stays discoverable. Headings name the content directly (Projects, Our team, Recruitment process). Omit decorative eyebrows, slogans, numbered labels without meaning, and motivational filler. The public site uses the approved dark theme; light values document token counterparts, not a theme toggle.

## Colors
Graphite fills most of the page. Surface tones remain available for functional controls; content uses open layouts. Cornell red marks recruitment and selected states; accent red is readable on graphite. Red buttons use a deep red background with light text. Avoid decorative gradients, neon, glass, or colored project cards.

## Typography
Geist Sans carries headings and reading text. Use Mono only for dates, categories, and small labels. Pixel is available but currently unused; never add a label merely to showcase a font. The existing logo lettering is an image asset and remains unchanged. Its measured source is 338×122; nested SVG viewports crop the bear and lettering independently with preserved aspect ratios. Never force independent image width/height scaling. Body text is at least 16px; long descriptions max 62ch. Heading sizes are desktop caps. Responsive H1: `clamp(3.25rem, 7.3vw, 7rem)`; H2: `clamp(2.5rem, 4.8vw, 4.25rem)`; H3: `clamp(1.5rem, 2.5vw, 2rem)`. Public branding uses CUXR; Cornell University remains the affiliation. Hero H1 arranges a compact diagonal CU/XR mark, with white Geist CU above larger red Pixel XR. CU caps at 120px desktop; XR is 1.35 times its size (1.2 on mobile). XR stays anchored; its two letters settle into place once on entry, disabled for reduced motion. Bear width caps at 620px desktop and 360px mobile. Secondary page titles may reach 9rem. Primary aliases the dark brand.primary value for tooling; brand.primary retains both theme counterparts; smaller sizes follow a roughly 1.272 scale.

## Layout & Spacing
Centered 1280px content with responsive 24–64px gutters. Sections use 128px desktop / 80px mobile spacing. Alternate expansive imagery with concise information; avoid repeated card grids. The hero uses an asymmetric split: restrained identity and descriptive text sit lower on the left, with a smaller floating bear higher on the right and generous negative space. Mobile places the bear above the text. Never put the bear in a card. The homepage feature rotates among five projects in a compact single-panel treatment with adjacent project previews.

## Elevation & Depth
Depth comes from overlapping type and the existing red bear, generous negative space, and intentional image placement. Project media floats directly on the background. Use existing real media only.

## Shapes & Corners
Default media and content have no border, container background, or rounded corners. Buttons use 0–4px corners; rows and active tabs use fine rules. Portraits and their text form open columns, not cards.

## Animation
Surgical, expressive motion. Primary reveal spring: linear(0, 0.15, 0.45, 0.73, 0.9, 0.98, 1.01, 1); secondary easing: cubic-bezier(0.16, 1, 0.3, 1); progress: linear. Durations 180ms controls, 500ms content, 700ms hero; stagger 80ms. Reveal offset 24px; hover shift 2px. Scroll-linked project images on fine pointers only. Native scroll; no scroll capture. The bear video has subtle tilt and a live dot rendering revealed by a continuous, softly warped fluid mask near the cursor, with a short trailing lobe; never random per-cell cutouts; keyboard focus centers the effect; its unstyled visual surface toggles playback with pointer or keyboard. No visible motion-button overlay. Reduced motion removes transforms and autoplay. Content remains visible without JavaScript.

## Components
Header: compact logo and clear links; Recruitment emphasized. Banner: compact light announcement strip, dark audience/deadline text, and one red Apply link. Mobile navigation uses a two-line icon opening large text links. Buttons: strong text contrast, generous targets, visible hover and focus. Internal text links use a small side arrow; external text links use an outward arrow. Filled and outlined button links need no arrow. Links have no persistent underline. Footer: one top rule; the logo and compact icon-only Connect group share the top row, with copyright and the Cornell policy link close below. On narrow phones the icons move below the logo. Social links have accessible names; the Cornell policy link uses an outward arrow. Featured work: large media, concise explanation, neighboring project previews, and an automatic progress cue; hovering the carousel temporarily pauses rotation. Team: subteam explanations followed by filter buttons and open portrait columns; details never hover-only.

## Rules
Use shared CSS tokens. Preserve factual content. Keep hidden projects out of public output. Keep recruitment links inside their configured windows. Maintain visible keyboard focus and WCAG AA contrast. On mobile, all content fits the viewport. Use real headings and real links. Always supply reduced-motion and non-JavaScript fallbacks.
