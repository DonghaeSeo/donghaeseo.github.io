(() => {
  "use strict";

  // Basic GA4 measurement with analytics cookies, as selected by the owner.
  // Advertising remains disabled. Saved refusals and privacy signals win.
  // https://developers.google.com/tag-platform/security/guides/consent
  if (window.__visitMeasurementLoaded) return;
  window.__visitMeasurementLoaded = true;

  const measurementId = "G-DH060W1ZBT";
  const productionHost = "donghaeseo.github.io";
  const pages = new Map([
    ["/", { path: "/", title: "Home" }],
    ["/index.html", { path: "/", title: "Home" }],
    ["/news.html", { path: "/news.html", title: "News" }],
    ["/publications.html", { path: "/publications.html", title: "Publications" }]
  ]);
  const page = pages.get(location.pathname);
  const production = /^G-[A-Z0-9]+$/.test(measurementId) &&
    location.protocol === "https:" && location.hostname === productionHost && Boolean(page);
  const preferenceKey = "analytics-measurement-v2";
  const legacyKey = "analytics-consent-v1";
  const disableKey = "ga-disable-" + measurementId;
  const browserOptOut = navigator.globalPrivacyControl === true ||
    [navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack]
      .some(value => value === "1" || value === "yes");
  let started = false;
  let optedOut = readPreference();

  // Preserve refusals from either previous analytics implementation.
  function readPreference() {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey));
      if (saved && saved.expires > Date.now() && typeof saved.disabled === "boolean") {
        return saved.disabled;
      }
      const legacy = JSON.parse(localStorage.getItem(legacyKey));
      return Boolean(legacy && legacy.expires > Date.now() && legacy.allowed === false);
    } catch (_) {
      // Do not lose an earlier opt-out if preference storage cannot be read.
      return true;
    }
  }

  function clearAnalyticsCookies() {
    if (!production) return;
    try {
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.trim().split("=")[0];
        if (name === "_ga" || name.startsWith("_ga_")) {
          const expired = name + "=; Max-Age=0; Path=/; SameSite=Lax; Secure";
          document.cookie = expired;
          document.cookie = expired + "; Domain=" + productionHost;
        }
      }
    } catch (_) { /* Cookies may be inaccessible in a restricted browser. */ }
  }

  function startAnalytics() {
    // Preview hosts must never load GA, including after a storage event.
    if (!production || browserOptOut || optedOut) return;
    window[disableKey] = false;
    if (started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("set", "ads_data_redaction", true);
    window.gtag("set", "url_passthrough", false);
    window.gtag("js", new Date());
    // Enhanced Measurement is disabled in the GA stream. Keep the standard
    // page view with fixed public metadata; add no custom interaction events.
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: "https://" + productionHost + page.path,
      page_title: page.title,
      page_referrer: ""
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.referrerPolicy = "no-referrer";
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.append(tag);
  }

  function applyPreference() {
    const off = !production || browserOptOut || optedOut;
    const changed = window[disableKey] !== off;
    window[disableKey] = off;
    if (started && changed) {
      window.gtag("consent", "update", {
        analytics_storage: off ? "denied" : "granted"
      });
    }
    if (off) clearAnalyticsCookies();
    else startAnalytics();
  }

  applyPreference();

  // Update already-open pages when this browser's saved preference changes.
  window.addEventListener("storage", event => {
    if (event.key !== preferenceKey && event.key !== legacyKey && event.key !== null) return;
    optedOut = readPreference();
    applyPreference();
  });
})();
