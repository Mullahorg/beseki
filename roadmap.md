# BESEKI — dynamic dealership platform

Keep the existing visual design; extend rather than rebuild.

## Phase 1 — Audit (done)
- [x] Map routes, components, data files, existing tables (vehicles, enquiries, customers, reviews)

## Phase 2 — Data layer
- [ ] Schema: media, vehicle_media, galleries/gallery_items, pages, page_sections, homepage sections, ctas, nav_items, blog_posts, testimonials, faqs, services, team_members, site_settings, seo_meta, leads (extend enquiries), user_roles + app_role
- [ ] Vehicle table extensions: variant, currency, interior_color, stock_number, video_url, status (incl. incoming/archived), draft/publish
- [ ] Indexes for filtering/pagination
- [ ] Seed existing hard-coded content into the DB (no fake people/reviews)

## Phase 3 — Auth + admin shell
- [ ] Email/password + Google auth, /auth route
- [ ] user_roles table + has_role(); roles: super_admin, admin, editor, sales
- [ ] /admin protected layout with sidebar nav (Dashboard, Vehicles, Leads, Appointments, Financing, Trade-Ins, Media, Pages, Homepage, Blog, Testimonials, FAQs, Services, Team, Navigation, Site Settings, SEO, Legal)
- [ ] Admin dashboard with real counts

## Phase 4 — Vehicle CMS
- [ ] CRUD + duplicate, archive/restore, availability & featured toggles
- [ ] Public inventory: server-side filtering, sorting, pagination, URL params
- [ ] Vehicle detail renders from record; related vehicles; status-aware CTAs

## Phase 5 — Media/image system
- [ ] Storage bucket + upload (multi, drag/drop, progress)
- [ ] media table: alt, caption, size, dimensions, category
- [ ] Vehicle image manager: reorder, cover, replace, delete
- [ ] Responsive variants via image transforms; srcset, lazy loading

## Phase 6 — Homepage/content CMS
- [ ] Section records: enable/disable, reorder, headings, images, variants, featured vehicles
- [ ] CTA system (types: internal, vehicle, whatsapp, phone, email, external, flows, scroll)
- [ ] Page CMS with draft/publish/archive, protected system pages

## Phase 7 — Leads/forms
- [ ] All public forms write to leads with source/status
- [ ] Admin lead list, filters, status changes

## Phase 8 — Blog/FAQ/testimonials/services/team CMS
- [ ] CRUD + publish states; public routes read from DB

## Phase 9 — SEO/settings/navigation
- [ ] site_settings (contact, brand assets, colors, WhatsApp templates)
- [ ] Navigation CMS
- [ ] DB-driven SEO metadata per page/vehicle/post

## Phase 10 — QA
- [ ] Route sweep, mobile 360–1440, galleries, forms, admin CRUD, auth
- [ ] Performance: pagination, indexes, lazy loading, skeletons
