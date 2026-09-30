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
- Edit `publications.html` and the homepage's related papers when a paper changes.
- Keep the profile markup consistent across all three pages.
- `styles.css` controls appearance; `profile.js` controls the name pronunciation note.
- `analytics.js` remains inactive until a GA4 measurement ID is configured.

Publish changes to the `main` branch. GitHub Pages serves the repository root.
Preview changes before publishing, including at a narrow screen width.
