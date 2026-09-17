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
Geist Sans carries headings and reading text. Use Mono only for dates, categories, and small labels. Pixel is available but currently unused; never add a label merely to showcase a font. The existing logo lettering is an image asset and remains unchanged. Large headings and header/footer logos use red CU and white XR. Heading wordmarks stay together on one line; logo crops recolor XR white while preserving the source lettering. Small headings, labels, links, and body text retain their original styling. Its measured source is 338×122; nested SVG viewports crop the bear and lettering independently with preserved aspect ratios. Never force independent image width/height scaling. Body text is at least 16px; long descriptions max 62ch. Heading sizes are desktop caps. Responsive H1: `clamp(3.25rem, 7.3vw, 7rem)`; H2: `clamp(2.5rem, 4.8vw, 4.25rem)`; H3: `clamp(1.5rem, 2.5vw, 2rem)`. Public branding uses CUXR; Cornell University remains the affiliation. Hero H1 arranges a compact diagonal CU/XR mark, with red Chakra Petch SemiBold CU above larger white Pixel XR. CU caps at 120px desktop; XR is 1.35 times its size (1.2 on mobile). On load, CU then X then R assemble from three horizontal slices, staggered 80ms. Alternating lateral offsets reverse between CU and XR, settling into registration with the shared secondary easing; intact lettering replaces the slices after 600ms to avoid seams. The bear scales from 96%; description words resolve from two softly offset horizontal halves in a 16ms reading-order stagger, starting at 220ms. The project link follows at 460ms, with its arrow drawing forward at 540ms; the full entrance completes within 900ms. Copy wraps naturally, duplicate slices are hidden from assistive technology, and keyboard focus reveals the link immediately. Final mark geometry stays fixed; reduced motion shows the complete hero immediately. Bear width caps at 620px desktop and 360px mobile. Secondary page titles may reach 9rem. Primary aliases the dark brand.primary value for tooling; brand.primary retains both theme counterparts; smaller sizes follow a roughly 1.272 scale.

## Layout & Spacing
Centered 1280px content with responsive 24–64px gutters. Sections use 128px desktop / 80px mobile spacing. Alternate expansive imagery with concise information; avoid repeated card grids. The hero uses an asymmetric split: restrained identity and descriptive text sit lower on the left, with a smaller floating bear higher on the right and generous negative space. Mobile places the bear above the text. Never put the bear in a card. The homepage closing invitation has no visible heading: concise copy on the left, recruitment and sponsorship actions on the right, with 64px vertical padding. Below 1000px the actions sit beneath the copy. The homepage feature rotates among five projects in a compact single-panel treatment with adjacent project previews.

## Elevation & Depth
Depth comes from overlapping type and the existing red bear, generous negative space, and intentional image placement. Project media floats directly on the background. Use existing real media only.

## Shapes & Corners
Default media and content have no border, container background, or rounded corners. Buttons use 0–4px corners; rows and active tabs use fine rules. Portraits and their text form open columns, not cards.

## Animation
Surgical, expressive motion. Primary reveal spring: linear(0, 0.15, 0.45, 0.73, 0.9, 0.98, 1.01, 1); secondary easing: cubic-bezier(0.16, 1, 0.3, 1); progress: linear. Durations 180ms controls, 500ms content, 700ms hero; stagger 80ms. Hover shift 2px. Prominent body copy uses a scroll-linked elliptical ink exposure, brightening muted text without moving or fading whole containers; images and controls remain unaffected. Unsupported browsers show static text. Scroll-linked project images on fine pointers only. Native scroll; no scroll capture. The bear video has subtle tilt and a live dot rendering revealed by a continuous, softly warped fluid mask near the cursor, with a short trailing lobe; never random per-cell cutouts; keyboard focus centers the effect; its unstyled visual surface toggles playback with pointer or keyboard. No visible motion-button overlay. Reduced motion removes transforms and autoplay. Content remains visible without JavaScript.

## Components
Header: compact logo and clear links; Recruitment emphasized. Banner: compact light announcement strip, dark audience/deadline text, and one red Apply link. Mobile navigation uses a two-line icon opening large text links. Buttons: strong text contrast, generous targets, visible hover and focus. Internal text links use a small side arrow; external text links use an outward arrow. Filled and outlined button links need no arrow. Links have no persistent underline. Footer: one top rule; the logo and compact icon-only Connect group share the top row, with copyright and the Cornell policy link close below. On narrow phones the icons move below the logo. Social links have accessible names; the Cornell policy link uses an outward arrow. Featured work: large media, concise explanation, neighboring project previews, and an automatic progress cue; hovering the carousel temporarily pauses rotation. Projects page: equal-weight project names form a compact ruled index on the right; hover or keyboard focus shows the project image and description on the left. Clicking sets its hash; direct hashes open, scroll to, and focus the project. Desktop details crossfade with a small vertical settle; mobile expands and collapses inline details smoothly, one project at a time. Plus/minus indicators morph with selection. Interrupted transitions resume from their current frame; keyboard selection and reduced motion are immediate. The first project opens by default; all details remain readable without JavaScript. Team: compact 2–3rem “Meet the team” title and subteam jump links share one baseline-aligned row, wrapping below on narrow screens. Each subteam pairs its description with a four-column uncropped portrait grid at the source 711:1080 aspect ratio (three on tablets, two on phones), leads first. Photos retain their full framing without hover zoom. Members without a headshot file use compact ruled text entries stacked within one portrait-width column of the same grid, with details and links always visible; no initials or reserved image space. Names and roles remain visible. Email, LinkedIn, and optional portfolio icons sit right-aligned beside the name, in that order. Major and year reserve only their natural content height below the role. Details and icons are revealed by hover or keyboard focus, toggled by tap on touchscreens; no layout shift. Without JavaScript, details remain visible. Alumni appear last with former teams and no titles. Missing roles derive from the team, with Software Engineer as the software default and Game Developer as the game default. Explicit roles override defaults.

Recruitment: a small 1.25rem “Recruitment” H1 sits above introductory copy; no repeated wordmark. Introduction, application deadline/action, recruitment process, then expectations. The supplied headset-wireframe.svg extends from the viewport’s right edge behind the intro, enlarged at its original aspect ratio. The linework uses the subtle SVG grid-sampling and dilation filter, inverted and subdued for graphite; mobile reduces its prominence. A clipped decorative layer prevents horizontal overflow. Intro uses 64px vertical padding. Eligibility, deadline, and Apply form one left-aligned group directly beneath the copy, separated by 32px. The oversized headset occupies the right side. Process and expectations use open 2:3 columns with 64px gaps and section padding; below 760px they stack with 32px gaps. The supplied dithered arm occupies the left of the process section at a large scale, contained within its available height so the full silhouette remains visible; its heading, description, and steps share the right column. Mobile places the subdued full arm behind the inset introduction, keeping steps on a clear background. Screen blending removes the image’s black background. Process numbers reflect the actual sequence; dates sit directly beneath info sessions with red left rules. The primary application button uses deep red. Phones stack the application action beneath the deadline. Preserve configured recruitment windows and event expiry.

## Sponsorship
The sponsor page opens directly with the funding overview, using its title as the page H1 and placing Explore the work below the introductory copy. Funding areas use ruled rows beside real event photography. A manually browsable, scroll-snapped packet preview includes pages 1, 3, 4, and 6 with readable HTML summaries, keyboard navigation, and a PDF download. Pricing and package pages are omitted from the preview. Close with an email invitation. Retain the shared graphite/red palette and motion curves.

## Rules
Use shared CSS tokens. Preserve factual content. Keep hidden projects out of public output. Keep recruitment links inside their configured windows. Maintain visible keyboard focus and WCAG AA contrast. On mobile, all content fits the viewport. Use real headings and real links. Always supply reduced-motion and non-JavaScript fallbacks.
