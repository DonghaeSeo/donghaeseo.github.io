(() => {
  "use strict";

  // All storage/advertising consent stays denied. This uses
  // Google's cookieless consent-mode signals, not ordinary cookie-based GA4.
  // https://developers.google.com/tag-platform/security/guides/consent
  if (window.__visitMeasurementLoaded) return;
  window.__visitMeasurementLoaded = true;

  const measurementId = "G-DH060W1ZBT";
  const productionHost = "donghaeseo.github.io";
  const production = /^G-[A-Z0-9]+$/.test(measurementId) &&
    location.protocol === "https:" && location.hostname === productionHost;
  const preferenceKey = "analytics-measurement-v2";
  const legacyKey = "analytics-consent-v1";
  const disableKey = "ga-disable-" + measurementId;
  const browserOptOut = navigator.globalPrivacyControl === true ||
    [navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack]
      .some(value => value === "1" || value === "yes");
  let started = false;
  let optedOut = readPreference();

  // The v2 preference only controls cookieless measurement. It never grants
  // cookie consent, including when a visitor previously allowed analytics.
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

  function clearLegacyCookies() {
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

  function referrerOrigin() {
    try {
      const source = new URL(document.referrer);
      return source.protocol === "https:" || source.protocol === "http:" ? source.origin : "";
    } catch (_) { return ""; }
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
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("set", "ads_data_redaction", true);
    window.gtag("set", "url_passthrough", false);
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      page_referrer: referrerOrigin()
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.referrerPolicy = "origin";
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.append(tag);
  }

  function applyPreference() {
    const off = !production || browserOptOut || optedOut;
    window[disableKey] = off;
    if (!off) startAnalytics();
  }

  clearLegacyCookies();
  applyPreference();

  // Update already-open pages when this browser's saved preference changes.
  window.addEventListener("storage", event => {
    if (event.key !== preferenceKey && event.key !== legacyKey && event.key !== null) return;
    optedOut = readPreference();
    applyPreference();
  });
})();
