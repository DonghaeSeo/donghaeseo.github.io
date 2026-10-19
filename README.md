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
- Keep news in reverse chronological order. Group university talks on the same topic only within the same month, and explicitly say that they were talks. The July 2026 MIT/Yale talks share one item; the October 2026 Berkeley talk stays in October. Keep distinct research visits and conference/award news separate.
- Combine awards received in the same month into one news item, retaining each award's name and awarding institution. The two February 2026 POSTECH paper awards share one item.
- Keep preprint announcements linked to arXiv, even after acceptance or publication. Acceptance and publication news use the DOI when available.
- Edit `publications.html` and the homepage's related papers when a paper changes.
- Link accepted and published papers to their DOI when available; omit their arXiv numbers from the website's paper lists. Keep arXiv numbers for preprints.
- Keep the profile markup consistent across all three pages.
- The portrait toggles a plain caption, “San Francisco · 2026,” on click, tap, Enter, or Space. Native details/summary supplies this interaction without JavaScript; the caption sits below the photo and wraps onto two lines on narrow screens. The portrait uses the front-facing crop selected from the Google Scholar profile candidates on October 18, 2026, extended vertically to 4:5 at the owner's request. It preserves candidate 2's face scale and displays the full image without additional cropping or enlargement.
- The homepage begins directly with News; research descriptions stay in the Research section.
- `styles.css` and `kaist-theme.css` control appearance with self-hosted STIX Two Text. Soft sand and affiliation-colored gradients at the top edges fade into the plain warm background. The background is static CSS and prints white.
- `themes.js` defines affiliation history and KAIST/POSTECH color themes. The interface uses subdued blue and burgundy on a warm off-white background; the official emblems retain their original colors. Add future affiliations there and keep the HTML fallback consistent across all three pages. Theme selection does not change career facts.
- Mobile shows the current affiliation first; More opens the vertical history. Desktop shows the full history.
- `motion.js` controls the restrained entrance effect; theme transitions honor reduced-motion preferences.
- `profile.js` controls the name pronunciation note and email disclosure. The heart after ORCID is a native link that goes directly to the wife’s homepage on click or Enter, without a disclosure. It follows the vertical desktop or horizontal mobile profile-links layout and retains a 44 px target.
- The pronunciation note retains “dong-heh” and “suh,” with memory hints for hae (“head” without d) and Seo (“sun” without n). These are approximate English cues.
- `locations-data.js` lists affiliations and visited institutions. Visits are alphabetized by their displayed English names and show only institution and location. `locations.js` provides the compact Equal Earth map and rotatable globe; map assets and licenses are stored locally in `assets/map/`.
- On 2026-10-11, the user confirmed visits to Caltech, UC Berkeley, The Ohio State University, Princeton University, and Harvard University, bringing the map to 14 visited institutions. Markers use approximate campus positions. Dates and purposes are omitted.
- On 2026-10-15, the user confirmed a visit to Stanford University, bringing the map to 15 visited institutions.
- Later on 2026-10-15, the user added Seoul National University, Yonsei University, Korea University, UNIST, Kyung Hee University (Seoul Campus), and the University of Oxford, bringing the map to 21 visited institutions. Campus-area markers use Gwanak for SNU, Sinchon for Yonsei, Seoul for Korea University, and the explicitly requested Seoul Campus for Kyung Hee.
- On 2026-10-15, the user requested university-level naming for Cambridge. Its entry is University of Cambridge, with an approximate central university-area marker.
- On 2026-10-15, the user added Hokkaido University, bringing the map to 22 visited institutions. Its marker uses the approximate Sapporo campus area.
- The map has four zoom levels, controlled by +/− and World view. The user prefers dots at their actual map positions, so markers are never replaced by numbers or moved apart. `locations-layout.js` identifies nearby dots in screen space solely to offer institution-name buttons when they overlap. Selecting an institution recenters the map and preserves the current detail level. The map panel opens beside the trigger where space allows and stays within the viewport, with scrolling on short screens.
- Update the institutional email in `profile.js` and the `<noscript>` fallback in all three pages when it changes.
- `analytics.js` uses basic GA4 measurement with analytics cookies for Home, News, and Publications without an entry prompt, as selected by the owner on October 18, 2026. It uses fixed public page paths/titles and an empty referrer, excluding URL queries and fragments. Advertising consent and Google Signals remain disabled; saved refusals and browser privacy signals are respected. GA cookies persist between measured visits and are cleared when measurement is disabled. Local previews and unrecognized paths do not load Google Analytics. Keep Enhanced Measurement and granular location/device collection disabled in GA Admin. No custom interaction events or site-defined visitor identifiers are added; GA's own cookie identifiers and automatic session/engagement events apply.
- The public CV is a separate email-free build. Keep its publication entries concise, join authors and journal with a comma, and use full journal names.

Publish changes to the `main` branch. GitHub Pages serves the repository root.
Preview changes before publishing, including at a narrow screen width.

## Color references

The warm neutral base and restrained accents draw on [Adobe’s neutral-first palette guidance](https://www.adobe.com/express/learn/blog/3-easy-steps-to-picking-your-brand-colors) and [warm/cool complementary colors](https://www.adobe.com/uk/creativecloud/design/discover/complementary-colors.html). The blue and burgundy interface shades are designed adaptations, not official university specifications. Original emblems follow [KAIST identity](https://www.kaist.ac.kr/en/html/kaist/011901.html) and [POSTECH symbols](https://postech.ac.kr/eng/about/symbol.do).
