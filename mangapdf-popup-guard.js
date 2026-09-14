(() => {
  "use strict";

  const allowedPopupHosts = new Set([
    "mangapdf-online.com",
    "dl.mangapdf-online.com",
    "drive.google.com",
    "docs.google.com"
  ]);
  const nativeWindowOpen = window.open;

  function isAllowedDestination(value) {
    if (!value) {
      return false;
    }

    try {
      return allowedPopupHosts.has(new URL(String(value), location.href).hostname);
    } catch {
      return false;
    }
  }

  function guardedWindowOpen(url, target, features) {
    if (!isAllowedDestination(url)) {
      return null;
    }

    return Reflect.apply(nativeWindowOpen, window, [url, target, features]);
  }

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

    if (!isAllowedDestination(link.href)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
