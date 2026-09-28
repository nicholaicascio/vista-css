# vista.css

A design system for building faithful recreations of the Windows Vista
**Aero** interface. It takes semantic HTML and makes it look like 2007.

- **No JavaScript.** Compatible with any framework, or none.
- **One self-contained stylesheet.** Icons are inlined as data URIs; the type
  stack uses the system's Segoe UI, so nothing else needs bundling.
- **Same markup as [98.css](https://jdan.github.io/98.css/) and
  [XP.css](https://botoxparty.github.io/XP.css/).** Existing `.window`,
  `.title-bar` and `.window-body` markup restyles instantly.

Source: [github.com/nicholaicascio/vista-css](https://github.com/nicholaicascio/vista-css) ·
Docs: [nicholaicascio.github.io/vista-css](https://nicholaicascio.github.io/vista-css/)

## Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="https://unpkg.com/vista.css" />
  </head>
  <body>
    <div class="window" style="width: 320px">
      <div class="title-bar">
        <div class="title-bar-text">My First Vista Program</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div class="window-body">
        <p>Hello, Aero!</p>
      </div>
    </div>
  </body>
</html>
```

Or install it:

```
npm install vista.css
```

The built file lives at `dist/Vista.css`. Publishing to npm is optional — you
can also drop the file in directly or load it from a jsDelivr GitHub URL.

## How the glass works

The window frame is translucent Aero glass: it blurs whatever is behind it with
`backdrop-filter`. That means two things:

1. **Windows need a backdrop.** Put them over a wallpaper, a gradient, or
   another window. On a flat white page the glass has nothing to show.
2. **It needs a modern browser.** `backdrop-filter` is supported everywhere
   current; `autoprefixer` emits the `-webkit-` prefix for Safari 15+ at build
   time.

The client area (`.window-body`) stays opaque, exactly as Vista rendered it.

## Components

| Component | Class / markup |
| --- | --- |
| Window | `.window` |
| Title bar | `.title-bar`, `.title-bar-text` |
| Window controls | `.title-bar-controls button[aria-label="Minimize\|Maximize\|Restore\|Help\|Close"]` |
| Status bar | `.status-bar`, `.status-bar-field` |
| Buttons | `button`, `.default` |
| Form controls | `input`, `textarea`, `select`, `input[type=checkbox\|radio\|range]`, `.field-row` |
| Tabs | `menu[role=tablist]`, `[role=tabpanel]` |
| Group box | `fieldset`, `legend`, `.group` |
| Tree view | `ul.tree-view.has-container` |
| Progress bar | `[role=progressbar]` |
| Scrollbar | `.has-scrollbar` |
| Menus | `ul[role=menubar]`, `ul[role=menu]` |
| Toolbar | `.toolbar`, `.toolbar-divider` |
| Balloon tooltip | `[role=tooltip]` |
| Taskbar | `.taskbar`, `.start-orb`, `.taskbar-button`, `.tray-clock` |
| List view | `table.list-view`, `.highlighted`, `.indicator` |
| Search box | `input[type=search]`, `.searchbox` |
| Spinner | `.spinner`, `.loader`, `.animate` |

## Themes

Two themes ship today, both driven by the same custom properties:

- `dist/Vista.css` — **Aero** (default). Translucent glass frame.
- `dist/Vista-Basic.css` — **Vista Basic**. Opaque frame, solid title bar, no
  blur; for when you can't rely on `backdrop-filter`.

```html
<link rel="stylesheet" href="https://unpkg.com/vista.css/dist/Vista-Basic.css" />
```

Add your own under `themes/<name>/`, importing `../../gui/index.scss` and then
overriding the variables and component partials.

## Reference

- [`AGENTS.md`](./AGENTS.md) — the full component, markup and theming
  reference (handy for AI agents).
- [`components.json`](./components.json) — machine-readable manifest with
  copy-paste markup per component.
- Docs site — [nicholaicascio.github.io/vista-css](https://nicholaicascio.github.io/vista-css/)

## Developing

```
npm install
npm run build      # dist/Vista.css, dist/Vista-Basic.css, dist/GUI.css, dist/index.html
npm start          # watch + live-reloading docs at http://localhost:8080
```

Sources live in `gui/` (theme-agnostic structure and the custom-property
contract) and `themes/` (the skins). `build.js` is a small PostCSS pipeline;
`svg-load("./icon/x.svg")` inlines an icon as a data URI.

Pushing to `master` builds and deploys the docs site to GitHub Pages via
`.github/workflows/docs.yml`. Set **Settings → Pages → Source → GitHub Actions**
once; `.github/workflows/ci.yml` just runs the build on pushes and pull
requests.

## Acknowledgements

Inspired by and in the spirit of:

- [98.css](https://github.com/jdan/98.css) by Jordan Scales
- [XP.css](https://github.com/botoxparty/XP.css) by Adam Hammad
- [7.css](https://github.com/khang-nd/7.css) by Khang Nguyen Duy (khang-nd)

All three are MIT licensed, vista.css is too.
