# HSIYC Media & Publicity Department

A responsive React, TypeScript, and Vite website based on the supplied HSIYC visual identity. It introduces the department’s people, activities, proposed plan, and vision with accessible motion controls.

## Development

From `/workspace/Media-department-`, use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Create the production build with `npm run build`; the output is written to `dist/`. Run `npm run preview` to inspect that build locally.

Run the browser checks with `npm test`. The cloud environment uses system Chromium at `/usr/bin/chromium`; keep that browser available when running the Playwright suite.

## View without installing anything

Run `npm run export:preview`, then open `preview/HSIYC-Media-Preview.html` in a browser. This single-file preview embeds the complete website, artwork, fonts, styles, and interactions. It needs no server once generated. Run the export again after changing the website. The preview is generated locally and does not publish the website.

## Update the content

Edit `src/content.ts` to update the activity cards, member profiles, plan phases, and vision values. Member entries use the structure supplied by the department: **Leader**, **Assistant leader**, **Consular**, and **Members**. Names are intentionally shown as “Name to be added”; add confirmed names and profile details before publishing an official directory. Duplicate the member entry with a unique `id` for each additional member.

Activities, role responsibilities, plan phases, and vision text are proposed content. Replace them with the department’s approved information. Keep sample/proposed labels until that content is confirmed. No real event dates, member qualifications, or department contact details have been supplied.

The original identity artwork in `public/identity/` was extracted from `HSIYC_Visual_Identity_Design_Guide(1).pdf`. The embedded JPEG images are unmodified, with exact duplicates removed; `public/identity/assets.json` records their dimensions and provenance. These are brand concepts and templates, not evidence of completed events or merchandise available to buy. `creative-world.png` is a newly generated, text-free hero illustration based on that visual identity, with a deep blue studio setting. `src/studio.css` contains the immersive redesign, full-format gallery, responsive layouts, and motion styling.

## Joining and publishing

This is a front-end website; no backend, official contact address, or submission service has been connected. The joining interaction downloads a draft locally and does not send an application to the department. Connect a confirmed contact or submission service before accepting applications publicly.

### GitHub Pages

The prepared `.github/workflows/pages.yml` builds and publishes the self-contained website when `main` is pushed or the workflow is started manually. In the repository's **Settings → Pages**, choose **GitHub Actions** as the build source before the first deployment. Publishing makes the site and its supplied artwork publicly accessible. The published Vite build loads assets separately and uses relative URLs so it works at the repository subpath. This keeps the initial HTML small and allows images to load independently. The self-contained export remains available for offline review.

After enabling GitHub Pages, open **Actions → Publish HSIYC website → Run workflow** to publish the site. A successful deployment supplies the live website address. Environment publication does not deploy the website.

The simplified edition uses four additional generated scenes (`scene-stories.png`, `scene-workshop.png`, `scene-creations.png`, and `scene-vision.png`) matching the hero identity. Three activity cards replace the paginated gallery, and the repeated poster section is removed. Gentle scene animation runs only while the scenes are in view; the header and footer controls pause motion, and system reduced-motion preferences are respected.

The department logo in `public/identity/department-logo.png` is an image-tool reproduction of the logo supplied in chat, preserving its wording and composition as closely as possible; it is not the original source file. It appears in the header, department introduction, footer, and downloadable presentation. The PowerPoint and PDF in `downloads/` are published alongside the website.
