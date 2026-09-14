(() => {
  "use strict";

  const hostname = location.hostname.replace(/^www\./, "");
  const SITE_CONFIG = {
    "animeruka.com": {
      selector: '[id^="ad-group-"]',
      getRemovalTarget: (element) => element.closest(".code-block") || element
    },
    "seriedayz.com": {
      // Do not remove .adlf: SerieDayz also uses it for the real category menu.
      selector: "aside.ad, div.adcen, div.adhl, div.adl, div.adrg",
      getRemovalTarget: (element) => element
    },
    "dark-manga.com": {
      // Exact banner groups and floating ads. Manga pages use .entry-content,
      // which is deliberately outside this selector.
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
      // Exact Go Manga banner groups and floating ads. Reader images live in
      // .entry-content and do not overlap these selectors.
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
      // #block-5 is the dedicated banner widget. Reader pages use
      // .reading-content, which is deliberately outside this selector.
      selector: [
        "#block-5",
        "#sticky-ads-bottom",
        "#sticky-ads-bottom2",
        "#sticky-ads-bottom3"
      ].join(", "),
      getRemovalTarget: (element) => element
    }
  };

  const config = SITE_CONFIG[hostname];

  if (!config) {
    return;
  }

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
