(async function () {
  const config = window.STARTPAGE_CONFIG || {};
  const bg = window.STARTPAGE_BACKGROUNDS;
  if (!bg) return;
  const sites = Array.isArray(config.sites) ? config.sites : [];
  const state = {
    tag: readTagFromLocation()
  };

  const elements = {
    bg: document.querySelector(".background"),
    greeting: document.querySelector("#greeting"),
    sites: document.querySelector("#sites"),
    clock: document.querySelector("#clock"),
    tagToggle: document.querySelector("#tagToggle"),
    tagDropdown: document.querySelector("#tagDropdown")
  };

  document.title = config.siteName || "Startpage";
  const supportsPopover = typeof elements.tagDropdown.showPopover === "function";

  if (!supportsPopover) {
    elements.tagToggle.removeAttribute("popovertarget");
    elements.tagToggle.removeAttribute("popovertargetaction");
    elements.tagToggle.addEventListener("click", () => {
      setFallbackPopoverOpen(!popoverOpen());
      if (popoverOpen()) {
        positionDropdown();
        focusActiveTagOption();
      }
    });

    document.addEventListener("click", (event) => {
      if (!popoverOpen()) return;
      if (event.target.closest(".tag-menu")) return;
      setFallbackPopoverOpen(false);
    });
  }

  function popoverOpen() {
    return elements.tagDropdown.matches(":popover-open, .\\:popover-open");
  }

  function setFallbackPopoverOpen(open) {
    elements.tagDropdown.classList.toggle(":popover-open", open);
    elements.tagToggle.setAttribute("aria-expanded", String(open));
  }

  function closeTagDropdown() {
    if (supportsPopover && popoverOpen()) {
      elements.tagDropdown.hidePopover();
    } else if (!supportsPopover) {
      setFallbackPopoverOpen(false);
    }
  }

  function positionDropdown() {
    const rect = elements.tagToggle.getBoundingClientRect();
    elements.tagDropdown.style.position = "fixed";
    elements.tagDropdown.style.top = rect.bottom + 8 + "px";
    elements.tagDropdown.style.right = window.innerWidth - rect.right + "px";
    elements.tagDropdown.style.left = "auto";
    elements.tagDropdown.style.bottom = "auto";
  }

  elements.tagDropdown.addEventListener("toggle", () => {
    const open = popoverOpen();
    elements.tagToggle.setAttribute("aria-expanded", String(open));
    if (open) {
      positionDropdown();
      focusActiveTagOption();
    }
  });

  window.addEventListener("resize", () => {
    if (popoverOpen()) positionDropdown();
  });

  elements.tagDropdown.addEventListener("keydown", handleMenuKeydown);
  elements.tagToggle.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    if (!popoverOpen()) {
      openTagDropdown();
    }

    focusTagOptionForKey(event.key);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popoverOpen()) {
      closeTagDropdown();
      elements.tagToggle.focus();
    }
  });

  function handleMenuKeydown(event) {
    const items = [...elements.tagDropdown.querySelectorAll(".tag-option")];
    if (!items.length) return;

    const current = document.activeElement;
    let index = items.indexOf(current);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      index = index < items.length - 1 ? index + 1 : 0;
      items[index].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      index = index > 0 ? index - 1 : items.length - 1;
      items[index].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    }
  }

  function openTagDropdown() {
    if (supportsPopover) {
      elements.tagDropdown.showPopover();
    } else {
      setFallbackPopoverOpen(true);
    }

    positionDropdown();
  }

  function focusActiveTagOption() {
    requestAnimationFrame(() => {
      const active = elements.tagDropdown.querySelector(".tag-option.active");
      const first = elements.tagDropdown.querySelector(".tag-option");
      (active || first)?.focus();
    });
  }

  function focusTagOptionForKey(key) {
    requestAnimationFrame(() => {
      const items = [...elements.tagDropdown.querySelectorAll(".tag-option")];
      if (!items.length) return;

      if (key === "ArrowUp" || key === "End") {
        items[items.length - 1].focus();
      } else {
        items[0].focus();
      }
    });
  }

  function focusMainHeading() {
    elements.greeting.setAttribute("tabindex", "-1");
    elements.greeting.focus({ preventScroll: true });
  }

  function transitionRender() {
    const update = () => render();

    if (document.startViewTransition) {
      document.documentElement.style.viewTransitionName = "none";
      const t = document.startViewTransition(update);
      t.finished.finally(() => {
        document.documentElement.style.viewTransitionName = "";
        focusMainHeading();
      });
    } else {
      update();
      focusMainHeading();
    }
  }

  window.addEventListener("popstate", () => {
    state.tag = readTagFromLocation();
    transitionRender();
  });

  renderTags();
  tick();
  setInterval(tick, 1000);
  render();

  function render() {
    applyBackground();
    elements.greeting.textContent = greetingText(state.tag);
    elements.sites.innerHTML = sites
      .filter((site) => isVisibleOnTag(site, state.tag))
      .map(siteCard)
      .join("");

    elements.tagDropdown.querySelectorAll(".tag-option").forEach((button) => {
      const isActive = button.dataset.tag === state.tag;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function siteCard(site) {
    const opensNewTab = site.newtab ?? config.defaultNewTab;
    const target = opensNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
    const iconClass = site.iconClass || "nf-md-link_variant";

    return `
      <a class="site-card" href="${escapeAttr(site.url)}"${target} title="${escapeAttr(site.description || site.url)}">
        <span class="icon-tile">
          <i class="nf ${escapeAttr(iconClass)}" aria-hidden="true"></i>
        </span>
        <span class="site-name">${escapeHtml(site.name)}</span>
      </a>
    `;
  }

  function renderTags() {
    const tags = ["home", ...allTags().filter((tag) => tag !== "home")];
    elements.tagDropdown.innerHTML = tags.map((tag) => {
      const isActive = tag === state.tag;
      const label = tagLabel(tag);
      return `<button class="tag-option${isActive ? " active" : ""}" type="button" data-tag="${escapeAttr(tag)}" aria-pressed="${isActive ? "true" : "false"}"><span>${escapeHtml(label)}</span><span class="tag-check" aria-hidden="true">&#10003;</span></button>`;
    }).join("");

    elements.tagDropdown.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        closeTagDropdown();
        setTag(button.dataset.tag);
        elements.tagToggle.focus();
      });
    });
  }

  function setTag(tag) {
    state.tag = tag || "home";
    const url = state.tag === "home" ? `${location.pathname}${location.search}` : `#tag/${encodeURIComponent(state.tag)}`;
    history.pushState({ tag: state.tag }, "", url);
    transitionRender();
  }

  function applyBackground() {
    const background = bg.forTag(config, state.tag);
    const url = background.url || "";
    elements.bg.style.setProperty("--bg-image", url ? `url("${bg.assetUrl(url)}")` : "none");
    bg.updatePreload(url);
  }

  function readTagFromLocation() {
    const hashMatch = location.hash.match(/^#tag\/(.+)$/);
    if (hashMatch) return decodeURIComponent(hashMatch[1]);
    const pathMatch = location.pathname.match(/\/tag\/([^/]+)/);
    if (pathMatch) return decodeURIComponent(pathMatch[1]);
    return "home";
  }

  function isVisibleOnTag(site, tag) {
    const tags = site.tags || [];
    if (tag === "home") return tags.length === 0 || tags.includes("home");
    return tags.includes(tag);
  }

  function allTags() {
    return [...new Set(sites.flatMap((site) => site.tags || []))].sort((a, b) => a.localeCompare(b));
  }

  function greetingText(tag) {
    return tagLabel(tag || "home");
  }

  function tagLabel(tag) {
    if (tag === "home") return "HOME";
    return String(tag || "").replace(/[-_]/g, " ").toUpperCase();
  }

  function tick() {
    const now = new Date();
    elements.clock.textContent = new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(now);
    elements.clock.dateTime = now.toISOString();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }
})();
