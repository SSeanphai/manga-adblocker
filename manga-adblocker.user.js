// ==UserScript==
// @name         Manga Sites Ad Cleaner
// @namespace    https://github.com/SSeanphai/manga-adblocker
// @version      1.4.0
// @description  Remove verified ad containers from supported Thai manga sites.
// @author       SSeanphai
// @match        https://animeruka.com/*
// @match        https://www.animeruka.com/*
// @match        https://seriedayz.com/*
// @match        https://www.seriedayz.com/*
// @match        https://dark-manga.com/*
// @match        https://www.dark-manga.com/*
// @match        https://go-manga.com/*
// @match        https://www.go-manga.com/*
// @match        https://nano-manga.com/*
// @match        https://www.nano-manga.com/*
// @match        https://mangapdf-online.com/*
// @match        https://www.mangapdf-online.com/*
// @run-at       document-start
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/SSeanphai/manga-adblocker/main/manga-adblocker.user.js
// @updateURL    https://raw.githubusercontent.com/SSeanphai/manga-adblocker/main/manga-adblocker.user.js
// ==/UserScript==

(() => {
  "use strict";

  const hostname = location.hostname.replace(/^www\./, "");
  const SITE_CONFIG = {
    "animeruka.com": {
      selector: '[id^="ad-group-"]',
      getRemovalTarget: (element) => element.closest(".code-block") || element
    },
    "seriedayz.com": {
      // .adlf is also used by the real category menu, so it is excluded.
      selector: "aside.ad, div.adcen, div.adhl, div.adl, div.adrg",
      getRemovalTarget: (element) => element
    },
    "dark-manga.com": {
      selector: [
        ".center_darkmangaza",
        ".center_darkmanga",
        ".center_darkmangasolo",
        "#sticky-bottom",
        "#sticky-bottom2",
        "#sticky-bottom3"
      ].join(", "),
      getRemovalTarget: (element) => element
    },
    "go-manga.com": {
      selector: [
        ".center_gomangaza",
        ".center_gomanga",
        ".center_gomangasolo",
        "#sticky-bottom",
        "#sticky-bottom2",
        "#sticky-bottom3"
      ].join(", "),
      getRemovalTarget: (element) => element
    },
    "nano-manga.com": {
      selector: [
        "#block-5",
        "#sticky-ads-bottom",
        "#sticky-ads-bottom2",
        "#sticky-ads-bottom3"
      ].join(", "),
      getRemovalTarget: (element) => element
    },
    "mangapdf-online.com": {
      // Preserve .gridshow-post-ad-two because it contains real manga links.
      selector: [
        "#custom_html-3",
        'iframe[data-aa="2062619"][src*="ad.a-ads.com"]'
      ].join(", "),
      getRemovalTarget: (element) =>
        element.closest(".widget_custom_html") || element
    }
  };

  const config = SITE_CONFIG[hostname];

  if (!config) {
    return;
  }

  if (hostname === "mangapdf-online.com") {
    const allowedPopupHosts = new Set([
      "mangapdf-online.com",
      "dl.mangapdf-online.com",
      "drive.google.com",
      "docs.google.com"
    ]);

    // MangaPDF's ad network opens unrelated pop-under tabs from normal clicks.
    // Keep scripted windows only for the site's own download flow and GDrive.
    const guardedWindowOpen = (url, target, features) => {
      if (!url) {
        return null;
      }

      let destination;

      try {
        destination = new URL(String(url), location.href);
      } catch {
        return null;
      }

      if (!allowedPopupHosts.has(destination.hostname)) {
        return null;
      }

      return Reflect.apply(nativeWindowOpen, window, [url, target, features]);
    };

    const nativeWindowOpen = window.open;

    try {
      Object.defineProperty(window, "open", {
        value: guardedWindowOpen,
        writable: false,
        configurable: false
      });
    } catch {
      window.open = guardedWindowOpen;
    }

    document.addEventListener("click", (event) => {
      const link = event.target instanceof Element
        ? event.target.closest("a[href]")
        : null;

      if (!link || !link.target || link.target.toLowerCase() !== "_blank") {
        return;
      }

      let destination;

      try {
        destination = new URL(link.href, location.href);
      } catch {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      if (!allowedPopupHosts.has(destination.hostname)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }

  const style = document.createElement("style");
  style.textContent = `${config.selector} { display: none !important; }`;
  (document.head || document.documentElement).append(style);

  const removedNodes = new WeakSet();

  function removeAdElement(element) {
    if (!(element instanceof Element) || removedNodes.has(element)) {
      return;
    }

    removedNodes.add(element);
    const target = config.getRemovalTarget(element);

    if (target.isConnected) {
      target.remove();
    }
  }

  function clean(root) {
    if (root instanceof Element && root.matches(config.selector)) {
      removeAdElement(root);
      return;
    }

    if (root instanceof Document || root instanceof DocumentFragment || root instanceof Element) {
      root.querySelectorAll(config.selector).forEach(removeAdElement);
    }
  }

  clean(document);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        clean(node);
      }
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
})();
