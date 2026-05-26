window.STARTPAGE_BACKGROUNDS = (function () {
  function collect(config) {
    const entries = [];
    const backgrounds = config?.tagBackgrounds || {};
    for (const key in backgrounds) {
      const bg = backgrounds[key];
      if (bg?.url && !entries.some((entry) => entry.url === bg.url)) {
        entries.push(bg);
      }
    }
    return entries;
  }

  function pickRandom(config) {
    const pool = collect(config);
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : {};
  }

  function forTag(config, tag) {
    return config?.tagBackgrounds?.[tag] || pickRandom(config);
  }

  function assetUrl(path) {
    if (!path) return "";
    return new URL(path, document.baseURI).href;
  }

  function updatePreload(path) {
    const link = document.getElementById("bgPreload");
    if (!link || !path) return;
    const href = assetUrl(path);
    if (link.getAttribute("href") !== href) {
      link.setAttribute("href", href);
    }
  }

  return { collect, forTag, assetUrl, updatePreload };
})();
