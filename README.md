# KPMTU Website

This workspace contains a clean, bilingual (English/Malayalam) website scaffold for the Kerala Paramedical Technicians Union (KPMTU).

## Key Features

- ✅ English / Malayalam toggle (client-side)
- ✅ Clean, professional layout (no heavy animations, minimal UI)
- ✅ Structured multi-page site (Home, About, Leadership, Districts, Membership, Form, Contact)
- ✅ District details rendered from structured data (`assets/js/content.js`)
- ✅ Membership form with local success message and structure ready for future Google Sheets integration
- ✅ Future-ready admin placeholder page
 - ✅ Image gallery automatically shows uploaded photos from `assets/images/`

## How to Update Content from Images

1. **Extract text from images** (OCR or manual) in the following categories:
   - Organization overview, mission, values
   - Leadership names and roles
   - District committees and contact details
   - Notices/documents

2. **Update the content source**
   - Update `assets/js/i18n.js` for the English and Malayalam strings used throughout the site.
   - For structured content (leadership, districts), update `assets/js/content.js`.
   - Replace placeholder photos by updating `assets/js/content.js` to point to the desired `assets/images/` files.

3. **Add images**
   - Place member photos or documents in `assets/images/`.
   - Update the photo URLs in `assets/js/content.js`.

## Running Locally

From the project root:

```bash
python -m http.server 8000
```

Open: http://localhost:8000

### Language Toggle
- Use the top-right toggle to switch between English and Malayalam.
- For quick testing you can also append `?lang=ml` or `?lang=en` to the URL.

## Next Improvements (Future Ready)

- Add Google Sheets integration using a Google Apps Script endpoint.
- Add login / admin panel to manage member database.
- Add real data extracted from official documents and images.
