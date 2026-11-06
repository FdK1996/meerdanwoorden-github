# Méér dan Woorden

Static website for [www.meerdanwoorden.com](https://www.meerdanwoorden.com), built with plain HTML, CSS and vanilla JavaScript. There is no build step and no runtime dependency other than Google Fonts.

## Status

The site is complete for the current scope:

- Homepage, Tekst, Beeld, Blog, Over mij, Contact, Algemene voorwaarden, Privacyverklaring and 404.
- All 42 blog posts, each with local images and a blog overview card.
- The blog overview initially shows 8 posts. JavaScript reveals the remaining posts in batches with **Meer laden**; without JavaScript all 42 cards remain visible.
- Local, optimized copies of the in-scope content images and all 34 client logos.
- Local logo, TekstNet Pluslid logo and favicon set.
- Client logo carousel on the Tekst page, with pause control and a static no-JavaScript fallback.
- Contact form with validation, spam honeypot, mailto fallback and optional HTTP endpoint support.
- Shared header/footer, social SVG icons, canonical URLs, Open Graph/Twitter metadata, `robots.txt`, `sitemap.xml`, `CNAME` and `.nojekyll`.

The Fotogalerij and Aanbiedingen pages are intentionally not part of this version. Their folders and links have been removed; the Beeld page now points to Contact instead of the gallery.

## Preview locally

From the repository root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`. A local server is recommended because root-relative navigation and directory URLs should behave like GitHub Pages.

## Deployment

This is a no-build GitHub Pages site. Publish the repository contents from the branch/root configured in GitHub Pages. Keep these files at the site root:

- `CNAME` — `www.meerdanwoorden.com`
- `.nojekyll` — serve the files without Jekyll processing
- `robots.txt`
- `sitemap.xml`

No `npm install` or build command is required.

## Structure

```text
/
├── index.html
├── 404.html
├── tekst/index.html
├── beeld/index.html
├── blog/index.html
├── blog/<post-slug>/index.html       42 posts
├── over-mij/index.html
├── contact/index.html
├── algemene-voorwaarden/index.html
├── privacy-policy/index.html
├── assets/
│   ├── css/style.css
│   ├── js/blog.js
│   ├── js/client-carousel.js
│   ├── js/contact.js
│   └── images/
│       ├── heroes/                   Page hero backgrounds
│       ├── blog/                     Post images
│       ├── blog/cards/               Blog overview thumbnails
│       ├── opdrachtgevers/           34 client logos
│       ├── logo.jpg
│       ├── tekstnet-pluslid.png
│       └── favicon.* / apple-touch-icon.png
├── robots.txt
├── sitemap.xml
├── CNAME
└── .nojekyll
```

The original import working files have been removed. Only the finished static site remains.

## Blog

`blog/index.html` contains all 42 cards. Cards after the first eight have the class `blog-card--extra`. `assets/js/blog.js` hides them when JavaScript is enabled and shows them eight at a time from the **Meer laden** button.

When adding a post:

1. Create `blog/<slug>/index.html` using an existing post as the template.
2. Add a matching card to `blog/index.html`, with `blog-card--extra` if it should not be in the initial eight.
3. Add the thumbnail under `assets/images/blog/cards/` and the post image(s) under `assets/images/blog/`.
4. Add the new URL to `sitemap.xml`.

## Contact form

By default the form uses a `mailto:` fallback:

```html
<form class="contact-form" id="contact-form"
      action="mailto:info@meerdanwoorden.com"
      method="post" enctype="text/plain"
      data-endpoint-configured="false">
```

`assets/js/contact.js` validates the fields and opens the visitor's email client with a prefilled message. The honeypot field `_gotcha` is checked before validation.

To post to a form service such as Formspree or Web3Forms, change the form `action` to the service endpoint and set:

```html
data-endpoint-configured="true"
```

The script sends the form with `fetch` and treats any 2xx response as success. It falls back to the mailto link if submission fails. Do not set the flag to `true` until a real HTTP endpoint is configured.

## Images and fonts

All in-scope images are stored locally and use descriptive `alt` text where appropriate. Decorative blog thumbnails use an empty `alt`. Width and height attributes are included to reduce layout shift.

Page hero photos are CSS backgrounds in `assets/css/style.css` under the `.hero`, `.hero--page`, `.hero--beeld`, `.hero--over-mij`, `.hero--contact` and `.hero--blog` rules.

The site loads Itim and Open Sans from Google Fonts. No other external JavaScript or CSS is required.

## SEO

- Every page has a canonical URL.
- Interior pages and posts include Open Graph and Twitter card metadata.
- Blog posts use their card image for social previews.
- `sitemap.xml` lists 50 canonical URLs: 8 pages and 42 posts.
- `robots.txt` points to the sitemap.
- Update `sitemap.xml` when adding or removing a page.
