(function () {
  var themes = [
    "amber", "aqua", "arctic", "cedar", "clay", "copper", "coral", "ember",
    "forest", "frost", "glass", "graphite", "indigo", "ink", "jade", "lagoon",
    "midnight", "mint", "mono", "moss", "obsidian", "olive", "orchid", "paper",
    "pearl", "plum", "rosewood", "sage", "sand", "slate", "solar", "steel",
    "wine"
  ];

  var list = document.querySelector("#themeList");
  var stylesheet = document.querySelector("#themeStylesheet");
  var bgEl = document.querySelector(".background");
  var config = window.STARTPAGE_CONFIG || {};
  var bg = window.STARTPAGE_BACKGROUNDS;

  var backgrounds = bg.collect(config);
  var bgIndex = 0;
  var active = "mono";

  list.innerHTML = themes.map(function (t) {
    return (
      '<button class="choose-chip" type="button" data-theme="' +
      t +
      '"><span>' +
      label(t) +
      '</span><span>.css</span></button>'
    );
  }).join("");

  list.addEventListener("click", function (e) {
    var chip = e.target.closest(".choose-chip");
    if (!chip) return;
    var theme = chip.dataset.theme;
    if (theme === active) {
      cycleBackground();
    } else {
      setTheme(theme);
    }
  });

  setTheme("mono");

  function setTheme(theme) {
    active = themes.indexOf(theme) !== -1 ? theme : "mono";
    stylesheet.href = "assets/css/themes/" + active + ".css";

    var chips = list.querySelectorAll(".choose-chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.toggle("active", chips[i].dataset.theme === active);
    }
  }

  function cycleBackground() {
    if (backgrounds.length === 0) return;
    bgIndex = (bgIndex + 1) % backgrounds.length;
    var entry = backgrounds[bgIndex];
    bgEl.style.setProperty("--bg-image", 'url("' + bg.assetUrl(entry.url) + '")');
    bg.updatePreload(entry.url);
  }

  function label(theme) {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }
})();
