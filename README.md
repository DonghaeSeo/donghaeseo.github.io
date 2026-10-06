# Donghae Seo

Personal academic website: <https://donghaeseo.github.io>.

A static site with research interests, publications, news, and a public CV.
No build step or package installation is required.

## Preview

Open `index.html`, or run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit <http://127.0.0.1:8000>.

## Update

- Edit `news.html` for the full archive and copy selected entries to `index.html`.
- Keep preprint announcements linked to arXiv, even after acceptance or publication. Acceptance and publication news use the DOI when available.
- Edit `publications.html` and the homepage's related papers when a paper changes.
- Link accepted and published papers to their DOI when available; omit their arXiv numbers from the website's paper lists. Keep arXiv numbers for preprints.
- Keep the profile markup consistent across all three pages.
- `styles.css` controls appearance; `profile.js` controls the name pronunciation note and email disclosure.
- Update the institutional email in `profile.js` and the `<noscript>` fallback in all three pages when it changes.
- `analytics.js` loads Google Analytics only after a visitor allows analytics.

Publish changes to the `main` branch. GitHub Pages serves the repository root.
Preview changes before publishing, including at a narrow screen width.
