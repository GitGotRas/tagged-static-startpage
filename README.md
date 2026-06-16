# Tagged Static Startpage

**Language:** English | [Русский](README.ru.md)

Static browser start page inspired by [Jump](https://github.com/daledavies/jump). It is plain HTML/CSS/JS and can be hosted on any static hosting: GitHub Pages, Netlify, Cloudflare Pages, Nginx, Apache, or opened locally as `index.html`.

## Features

- Tag-based filtering for links: `home`, `tools`, `media`, `social`, `dev`, `cloud`, `docs`.
- Chrome-style top-right tag popover.
- Per-tag local background images.
- Local Nerd Fonts icon font, no CDN required.
- 33 separate CSS theme files in `assets/css/themes/`.
- Theme chooser page: `choose-theme.html`.
- Static hash routes like `index.html#tag/dev`.
- Clock in the footer.
- Keyboard-friendly buttons, skip link, focus styles, and Popover API fallback.

## Screenshots

### Startpage

![Home](screenshots/index_home.png)

![Dev](screenshots/index_dev.png)

![Tools](screenshots/index_tools.png)

### Theme Chooser

![Choose Theme - Home, Amber](screenshots/choose-theme_home_amber.png)

![Choose Theme - Dev, Arctic](screenshots/choose-theme_dev_arctic.png)

![Choose Theme - Media, Solar](screenshots/choose-theme_media_solar.png)

![Choose Theme - Tools, Copper](screenshots/choose-theme_tools_copper.png)

## Quick Start

1. Open `index.html` in a browser.
2. Edit links, tags, icons, and backgrounds in `assets/data/config.js`.
3. Open `choose-theme.html` to preview themes.
4. To apply a theme, change the theme stylesheet in `index.html`:

```html
<link rel="stylesheet" href="assets/css/themes/mono.css">
```

## Project Structure

```text
index.html                    Main start page
choose-theme.html             Theme preview and chooser
favicon.svg
assets/
  css/
    styles.css                Base layout and components
    choose-theme.css          Theme chooser styles
    webfont.css               Local Nerd Fonts classes
    themes/                   33 theme CSS files
  data/
    config.js                 Sites, tags, icons, backgrounds
  fonts/
    Symbols-2048-em Nerd Font Complete.woff2
  js/
    app.js                    Main page logic
    backgrounds.js            Background selection and preload helpers
    choose-theme.js           Theme chooser logic
images/                       Local background images
```

## Configuration

All start page data lives in `assets/data/config.js`.

Example site:

```js
{
  name: "GitHub",
  url: "https://github.com/",
  description: "Code hosting & collaboration",
  tags: ["home", "dev"],
  iconClass: "nf-dev-github"
}
```

Example backgrounds:

```js
tagBackgrounds: {
  home: { url: "images/andreas-gucklhorn-EDxp0LDjKAM-unsplash.jpg" },
  tools: { url: "images/anton-darius-gWXyJ9k5ak8-unsplash.jpg" },
  dev: { url: "images/marek-piwnicki-wOOe-GLA_YU-unsplash.jpg" }
}
```

## Tags

- `home` is the default page.
- Sites with `home` appear on the home page.
- Any other tag filters the site list.
- The current tag is stored in the URL as `#tag/dev`.
- Tag labels are displayed uppercase without `#`.

## Icons

Icons use the local [Nerd Fonts](https://www.nerdfonts.com/cheat-sheet) font. The bundled
`assets/css/webfont.css` is generated from `assets/fonts/Symbols-2048-em Nerd Font Complete.woff2`
and includes classes for the glyphs available in that font.

Set the icon with `iconClass`, for example:

```js
iconClass: "nf-dev-github_full"
```

## Themes

Each theme is a standalone CSS file in `assets/css/themes/`. The current default is:

```html
<link rel="stylesheet" href="assets/css/themes/mono.css">
```

Use `choose-theme.html` to preview all themes. Clicking the active theme again cycles through available backgrounds.

## Hosting Notes

The page is fully static. Hash routes such as `#tag/dev` need no server configuration.

If you want clean paths like `/tag/dev/`, configure your server to serve `index.html` for all routes.

## Image Credits

Background photos in `images/` are from [Unsplash](https://unsplash.com). Photographer profiles:

- [Abolfazl Ranjbar](https://unsplash.com/@ranjbarpic)
- [Alim](https://unsplash.com/@apyfz)
- [Andreas Gücklhorn](https://unsplash.com/de/@draufsicht)
- [Anton Darius](https://unsplash.com/@thesollers)
- [Ben Carless](https://unsplash.com/@bencarless)
- [Cash Macanaya](https://unsplash.com/@cashmacanaya)
- [Damian Markutt](https://unsplash.com/@wildandfree_photography)
- [Jan Stýblo](https://unsplash.com/@janstyblo)
- [Jonathan Bean](https://unsplash.com/@jonathanbean)
- [Marek Piwnicki](https://unsplash.com/@marekpiwnicki)
- [Maud Bocquillod](https://unsplash.com/@maud_boc)
- [Michelle Spollen](https://unsplash.com/@micki)
- [NASA](https://unsplash.com/@nasa)
- [Philipp Düsel](https://unsplash.com/@philipp_dice)
- [Tropic Alizé](https://unsplash.com/@tropicalize)

## Compatibility

- Popover API is used when available.
- Older browsers fall back to a class-based dropdown toggle.
- View Transitions are used when available; otherwise content updates immediately.
- Motion is reduced when `prefers-reduced-motion: reduce` is enabled.

## Acknowledgements

Built with help from Codex, opencode, and the `modern-web-guidance` skill.
