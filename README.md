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
- The portrait toggles a plain caption, “Paris · May 2024,” on click, tap, Enter, or Space. Native details/summary supplies this interaction without JavaScript; the caption sits in the existing space below the photo.
- `styles.css` and `kaist-theme.css` control appearance with self-hosted STIX Two Text.
- `themes.js` defines affiliation history and KAIST/POSTECH color themes. Add future affiliations there and keep the HTML fallback consistent across all three pages. Theme selection does not change career facts.
- Mobile shows the current affiliation first; More opens the vertical history. Desktop shows the full history.
- `motion.js` controls the restrained entrance effect; theme transitions honor reduced-motion preferences.
- `profile.js` controls the name pronunciation note and email disclosure. The heart after ORCID is a native link that goes directly to the wife’s homepage on click or Enter, without a disclosure. It follows the vertical desktop or horizontal mobile profile-links layout and retains a 44 px target.
- The pronunciation note retains “dong-heh” and “suh,” with memory hints for hae (“head” without d) and Seo (“sun” without n). These are approximate English cues.
- `locations-data.js` lists affiliations and visited institutions. Visits are alphabetized by their displayed English names and show only institution and location. `locations.js` provides the compact Equal Earth map and rotatable globe; map assets and licenses are stored locally in `assets/map/`.
- Update the institutional email in `profile.js` and the `<noscript>` fallback in all three pages when it changes.
- `analytics.js` starts cookieless Google consent-mode signals on the production hostname without an entry prompt. Storage and advertising consent remain denied; saved refusals and browser privacy signals are respected. Local previews do not load Google Analytics.
- The public CV is a separate email-free build. Keep its publication entries concise, join authors and journal with a comma, and use full journal names.

Publish changes to the `main` branch. GitHub Pages serves the repository root.
Preview changes before publishing, including at a narrow screen width.
