# Connect every public image to admin editing

## Scope

- Keep the current BESEKI layouts and styling; add or repair image slots only.
- Audit every public page, card, logo, article, service, person, testimonial, vehicle, and gallery surface.
- Use the existing media library and upload flow rather than introducing another image system.

## Implementation

1. Strengthen the shared image picker with context-aware upload categories, clear previews, replace/remove controls, and safe broken-image fallbacks.
2. Connect the existing Pages editor to live public pages, including each page's header image, title, intro, and SEO data where appropriate.
3. Render already-editable images that are currently ignored, including service images and testimonial/customer photos.
4. Add editable header-image records for public pages that currently have decorative or empty image areas, while preserving their existing layout.
5. Keep vehicle galleries, homepage section images, blog covers, team photos, branding, favicon, and social-share imagery using the same media records.
6. Ensure missing images show a deliberate branded fallback rather than a broken icon or empty layout.
7. Verify desktop/mobile public pages and matching admin editors, then check for broken images, errors, and dead image controls.

## Technical details

- Reuse `MediaPicker`, `MediaUploader`, the `media` table, and existing media URL helpers.
- Add a public page-content loader for published `pages` records and resolve `featured_media_id` through the media table.
- Extend editor field metadata so uploads are categorized correctly (Page, Blog, Team, Service, Testimonial, Branding, Homepage).
- Preserve lazy loading and responsive image sources where appropriate.
