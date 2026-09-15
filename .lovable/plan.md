# Bring the existing BESEKI experience to life

## What will change
- Keep every public section, layout, image, color, and content structure in place.
- Add subtle reveal-on-scroll movement to existing headings, content blocks, cards, and images.
- Strengthen hover, press, focus, menu, and image transitions so interactions feel responsive and tactile.
- Add a discreet “Staff access” link in the footer that opens the existing sign-in page.
- Polish the existing admin shell, dashboard cards, tables, navigation, forms, loading states, and page headers without changing admin workflows.
- Prevent hosted pages from serving stale database content by marking public data requests and page responses as fresh/no-store where appropriate.

## Motion style
- Calm, premium automotive movement: short fades, small vertical reveals, restrained image zoom, and crisp button feedback.
- No new page structure, flashy effects, glass-heavy styling, glowing decoration, or continuous motion beyond the announcement bar.
- Respect reduced-motion preferences and preserve keyboard accessibility.

## Technical details
- Use a small reusable intersection-observer reveal component and CSS utilities rather than adding an animation library.
- Apply motion incrementally to shared sections and cards so all public pages benefit consistently.
- Preserve semantic design tokens and existing components.
- Verify desktop and mobile rendering, staff sign-in navigation, admin pages, database freshness, console output, and build status.
