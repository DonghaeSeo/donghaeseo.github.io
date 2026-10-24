# Donghae Seo

Personal academic website: <https://donghaeseo.github.io>.

A static site with research interests, publications, news, and a public CV.
No build step or package installation is required.

## Preview

Open `index.html` in VS Code. For its integrated browser preview, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000> in VS Code's integrated browser. Use VS Code for HTML review, as requested by the owner on October 20, 2026.

## Update

- Edit `news.html` for the full archive and copy selected entries to `index.html`.
- Keep news in reverse chronological order. Group university talks on the same topic only within the same month, and explicitly say that they were talks. The July 2026 MIT/Yale talks share one item; the October 2026 Berkeley/Ohio State/Princeton/Harvard talks share another. Keep distinct research visits and conference/award news separate.
- Combine awards received in the same month into one news item, retaining each award's name and awarding institution. The two February 2026 POSTECH paper awards share one item.
- Keep preprint announcements linked to arXiv, even after acceptance or publication. Acceptance and publication news use the DOI when available.
- On 2026-10-20, added arXiv:2610.24633 to News and Preprints. The owner requested a brief, understated participation announcement. Use “A study I contributed to…” without highlighting the result or claiming a specific individual contribution.
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
- On 2026-10-19, the user requested university-level naming for YITP. Its entry is Kyoto University, retaining the approximate Kyoto campus-area marker and the official YITP location source. The visit count remains 22.
- The map has four zoom levels, controlled by +/− and World view. The user prefers dots at their actual map positions, so markers are never replaced by numbers or moved apart. `locations-layout.js` identifies nearby dots in screen space solely to offer institution-name buttons when they overlap. Selecting an institution recenters the map and preserves the current detail level. The map panel opens beside the trigger where space allows and stays within the viewport, with scrolling on short screens.
- Update the institutional email in `profile.js` and the `<noscript>` fallback in all three pages when it changes.
- `analytics.js` uses basic GA4 measurement with analytics cookies for Home, News, and Publications without an entry prompt, as selected by the owner on October 18, 2026. It uses fixed public page paths/titles and an empty referrer, excluding URL queries and fragments. Advertising consent and Google Signals remain disabled; saved refusals and browser privacy signals are respected. GA cookies persist between measured visits and are cleared when measurement is disabled. Local previews and unrecognized paths do not load Google Analytics. Keep Enhanced Measurement disabled in GA Admin. Granular location/device collection is enabled in all regions, as explicitly requested by the owner on October 18, 2026, to restore city-level reporting. No custom interaction events or site-defined visitor identifiers are added; GA's own cookie identifiers and automatic session/engagement events apply.
- The public CV is a separate email-free build. Keep its publication entries concise, join authors and journal with a comma, and use full journal names.
- On 2026-10-20, rebuilt the public CV with arXiv:2610.24633 as preprint [9], matching the updated canonical CV in `../Job Application/CV/main.tex`. The public source and validation record are in `../Job Application/CV/build/kagome_preprint_2026_10_20/`. Both PDFs remain two pages; all pages were visually checked.
- Later on 2026-10-20, added the October 19 OSU Quantum Matter Seminar to both CVs as talk [9], using the official advertised title “Wavefunctions for Anyon Superconductors.” The current public source and validation record are in `../Job Application/CV/build/osu_seminar_2026_10_20/`. Both PDFs remain two pages and retain the new kagome preprint.
- On 2026-10-21, the owner confirmed his Princeton talk and clarified that the actual OSU talk used the same title as Princeton and Berkeley: “A Unified Approach to Anyon Superconductivity and Quantum Hall Hierarchy.” Princeton is included in the existing October news item on both Home and News. Both CVs group these three talks under that title, retaining each venue and month. The identical-title July MIT/Yale talks are also grouped. This delivered-title confirmation supersedes the advertised OSU title in the current CV; the October 20 build remains a historical record.
- The October 21 public CV source and validation record are preserved in `../Job Application/CV/build/princeton_talk_2026_10_21/`. Both CVs retained two pages with the original typography and spacing. All four PDF pages were visually checked, and both builds were warning-free.
- On 2026-10-24, the owner confirmed completing his October 23 Harvard talk and the October talk schedule. Home and News group Harvard with Berkeley, Ohio State, and Princeton in the first October news item. Both CVs retain one shared presentation title and separate venue/month rows.
- The latest public CV source and validation record are in `../Job Application/CV/build/harvard_talk_2026_10_24/`. Both CVs remain two pages with unchanged typography and spacing. All four PDF pages were visually checked, and both builds are warning-free.

Publish changes to the `main` branch. GitHub Pages serves the repository root.
Preview changes before publishing, including at a narrow screen width.

The Google tag initializer is placed immediately after `<head>` on all three
pages. `analytics.js` loads Google's asynchronous tag and configures
`G-DH060W1ZBT` once, using the measurement preferences described above. Do not
add a second standalone Google tag snippet alongside this initializer.

## Color references

The warm neutral base and restrained accents draw on [Adobe’s neutral-first palette guidance](https://www.adobe.com/express/learn/blog/3-easy-steps-to-picking-your-brand-colors) and [warm/cool complementary colors](https://www.adobe.com/uk/creativecloud/design/discover/complementary-colors.html). The blue and burgundy interface shades are designed adaptations, not official university specifications. Original emblems follow [KAIST identity](https://www.kaist.ac.kr/en/html/kaist/011901.html) and [POSTECH symbols](https://postech.ac.kr/eng/about/symbol.do).
