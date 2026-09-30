(() => {
  "use strict";

  // GA4 web stream for the public academic website.
  const measurementId = "G-DH060W1ZBT";
  const productionHost = "donghaeseo.github.io";

  // Never load Google Analytics for an unconfigured site or a local preview.
  if (!/^G-[A-Z0-9]+$/.test(measurementId) ||
      location.protocol !== "https:" || location.hostname !== productionHost) return;

  const storageKey = "analytics-consent-v1";
  const consentLifetime = 180 * 24 * 60 * 60 * 1000;
  let started = false;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && saved.expires > Date.now() && typeof saved.allowed === "boolean") {
        return saved.allowed;
      }
    } catch (_) { /* Storage may be unavailable in private browsing. */ }
    return null;
  }

  function saveChoice(allowed) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        allowed, expires: Date.now() + consentLifetime
      }));
      return true;
    } catch (_) { return false; }
  }

  function startAnalytics() {
    window["ga-disable-" + measurementId] = false;
    if (started) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
      return;
    }
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: productionHost,
      cookie_expires: consentLifetime / 1000,
      page_location: location.origin + location.pathname
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.append(tag);
  }

  function stopAnalytics(reload = true) {
    window["ga-disable-" + measurementId] = true;
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.trim().split("=")[0];
      if (name === "_ga" || name.startsWith("_ga_")) {
        const expired = name + "=; Max-Age=0; Path=/; SameSite=Lax; Secure";
        document.cookie = expired;
        document.cookie = expired + "; Domain=" + productionHost;
      }
    }
    // Reload to remove the already-loaded tag after consent is withdrawn.
    if (started && reload) location.reload();
  }

  const banner = document.createElement("section");
  banner.className = "analytics-banner";
  banner.setAttribute("aria-label", "Analytics preferences");
  const message = document.createElement("p");
  message.textContent = "Allow Google Analytics cookies to measure visits, approximate location, and referral sources? You can change your choice using Analytics settings below. ";
  const details = document.createElement("a");
  details.href = "https://policies.google.com/technologies/partner-sites";
  details.textContent = "How Google uses data";
  message.append(details);
  const buttons = document.createElement("div");
  buttons.className = "analytics-actions";

  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "analytics-settings";
  settings.textContent = "Analytics settings";
  settings.addEventListener("click", () => {
    banner.hidden = false;
    decline.focus();
  });

  function choose(allowed) {
    const saved = saveChoice(allowed);
    banner.hidden = true;
    if (allowed) startAnalytics();
    else stopAnalytics(saved);
    settings.focus();
  }

  const decline = document.createElement("button");
  decline.type = "button";
  decline.textContent = "Decline";
  decline.addEventListener("click", () => choose(false));
  const allow = document.createElement("button");
  allow.type = "button";
  allow.textContent = "Allow analytics";
  allow.addEventListener("click", () => choose(true));
  buttons.append(decline, allow);
  banner.append(message, buttons);
  document.body.append(banner);
  const footer = document.querySelector("footer");
  (footer || document.body).append(settings);

  const choice = readChoice();
  banner.hidden = choice !== null;
  if (choice === true) startAnalytics();

  // Apply preference changes made in another open page of this site.
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    const updated = readChoice();
    banner.hidden = updated !== null;
    if (updated === true) startAnalytics();
    else stopAnalytics();
  });
})();
