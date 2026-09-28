# AGENTS.md

Reference for anyone (human or AI agent) implementing or extending **vista.css** —
a Windows Vista **Aero** design system in the spirit of
[98.css](https://github.com/jdan/98.css), [XP.css](https://github.com/botoxparty/XP.css)
and [7.css](https://github.com/khang-nd/7.css).

## The essentials

- **No JavaScript.** Pure CSS over semantic HTML.
- **One self-contained stylesheet**: `dist/Vista.css`. All icons are inlined as
  data URIs and the type stack uses the system's Segoe UI, so nothing else
  needs bundling.
- **Markup-compatible with 98.css / XP.css** for windows, buttons and form
  controls. Existing `.window` / `.title-bar` / `.window-body` markup restyles
  as-is.
- **The frame is translucent Aero glass** (`backdrop-filter`). It needs
  something behind it — a wallpaper, gradient or another window. On a flat
  white page the glass has nothing to show.
- **`backdrop-filter` is required** for the glass and taskbar. It is supported
  in all current browsers; `autoprefixer` emits `-webkit-` for Safari 15+.

## Install / use

```html
<link rel="stylesheet" href="https://unpkg.com/vista.css" />
```

```js
import "vista.css";            // or: import "vista.css/dist/Vista.css";
```

The build entry (`dist/Vista.css`) is the Aero theme. `dist/GUI.css` is the
theme-less core (structure + variable defaults only).

## Quick reference

| Area | Selector(s) | Notes |
| --- | --- | --- |
| Window | `.window` | The glass frame. |
| Title bar | `.title-bar`, `.title-bar-text`, `.title-bar-controls` | Controls keyed by `aria-label`. |
| Window controls | `button[aria-label="Minimize\|Maximize\|Restore\|Help\|Close"]` | |
| Client area | `.window-body` | Opaque, unlike the frame. |
| Status bar | `.status-bar`, `.status-bar-field` | |
| Buttons | `button`, `.default` | `.active` / `.focused` mirror `:active` / `:focus-visible`. |
| Fields | `input[type=text\|password\|email\|search\|url\|tel\|number]`, `textarea`, `select` | |
| Choice | `input[type=checkbox\|radio]` **+ adjacent `<label>`** | The input is hidden; the label draws the control. |
| Row helpers | `.field-row`, `.field-row-stacked` | |
| Tabs | `menu[role=tablist]` › `button[aria-selected]`, `[role=tabpanel]`, `.justified` | |
| Group box | `fieldset` › `legend`, `.group` | |
| Tree view | `ul.tree-view`, `.has-container`, `.has-collapse-button`, `.has-connector` | Collapsing via native `<details>`. |
| Progress bar | `[role=progressbar]` › `div`, `.animate`, `.marquee`, `.paused`, `.error` | |
| Scrollbar | `.has-scrollbar` | On the scrolling container. |
| Menu bar | `ul[role=menubar]` › `li[role=menuitem][aria-haspopup]` | |
| Menu | `ul[role=menu]` › `li[role=menuitem]`, `.can-hover`, `.has-divider`, `[aria-disabled]` | |
| Toolbar | `.toolbar`, `.toolbar-divider`, `button[aria-pressed]` | |
| Balloon | `[role=tooltip]`, `.is-top`, `.is-left`, `.is-right` | |
| Taskbar | `.taskbar`, `.start-orb`, `.taskbar-tasks`, `.taskbar-button`, `.taskbar-button-icon`, `.taskbar-button-text`, `.taskbar-tray`, `.tray-clock` | |
| List view | `table.list-view`, `.highlighted`, `.indicator` (`.up`), `.has-shadow` | |
| Search box | `input[type=search]`, `.searchbox` | |
| Spinner | `.spinner`, `.loader`, `.animate` | |

A machine-readable version of this table, with copy-paste markup per component,
lives in [`components.json`](./components.json).

## Components

### Window

The frame is glass; the client area (`.window-body`) is opaque. Controls are
keyed off `aria-label`, so order is free. Use `Restore` instead of `Maximize`
on a maximized window; `Help` renders a "?" button.

```html
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
  <div class="status-bar">
    <p class="status-bar-field">Ready</p>
    <p class="status-bar-field">3 objects</p>
  </div>
</div>
```

### Buttons

```html
<button>OK</button>
<button class="default">Apply</button>
<button disabled>Disabled</button>
```

`.default` adds the aqua "default button" glow, as does `:focus-visible`.

### Form controls

Text-like inputs, `textarea`, and `select` all share the Aero field: white
background, `--field-border` hairline, blue focus glow.

```html
<div class="field-row">
  <label for="name">Name</label>
  <input id="name" type="text" value="Nick" />
</div>
<div class="field-row">
  <label for="theme">Color scheme</label>
  <select id="theme">
    <option>Windows Aero</option>
    <option>Windows Vista Basic</option>
  </select>
</div>
<textarea rows="3"></textarea>
```

**Checkbox / radio** — the real `<input>` is hidden and the **immediately
following `<label>`** draws the control. The `input` and `label` must be
adjacent siblings:

```html
<div class="field-row">
  <input id="cb1" type="checkbox" checked />
  <label for="cb1">Show hidden files</label>
</div>

<div class="field-row">
  <input id="rb1" type="radio" name="scheme" checked />
  <label for="rb1">Windows Aero</label>
</div>
```

Range: `<input type="range" />`.

### Tabs

```html
<menu role="tablist">
  <button aria-selected="true">General</button>
  <button>Security</button>
  <button>Details</button>
</menu>
<div role="tabpanel">
  <p>Content of the General tab.</p>
</div>
```

Selected tab goes flat and merges into the panel. Add `justified` to the
tablist to stretch the tabs.

### Group box

```html
<fieldset>
  <legend>Startup</legend>
  <div class="group">
    <div class="field-row">
      <input id="gb1" type="checkbox" checked />
      <label for="gb1">Run at startup</label>
    </div>
  </div>
</fieldset>
```

### Tree view

Collapsing uses native `<details>`; no JS.

```html
<ul class="tree-view has-container has-collapse-button" style="width: 220px">
  <li>
    <details open>
      <summary>Desktop</summary>
      <ul>
        <li>Documents</li>
        <li>
          <details>
            <summary>Network</summary>
            <ul>
              <li>Server</li>
            </ul>
          </details>
        </li>
      </ul>
    </details>
  </li>
</ul>
```

`.has-container` = white list surface + border. `.has-collapse-button` = the
▸/▾ disclosure triangles. `.has-connector` = optional dotted guide lines.
`.selected` (or `[aria-selected="true"]`) on an `<li>` highlights it.

### Progress bar

The inner element is the fill; give it a width.

```html
<div role="progressbar" style="width: 260px">
  <div style="width: 60%"></div>
</div>

<!-- indeterminate -->
<div role="progressbar" class="marquee" style="width: 260px"></div>
```

Variants: `.animate` (sheen sweep), `.marquee`, `.paused` (yellow),
`.error` (red).

### Scrollbar

Add `has-scrollbar` to the scrolling container. WebKit/Blink get the full Aero
treatment; Firefox falls back to `scrollbar-color`.

```html
<div class="has-scrollbar" style="height: 130px; overflow-y: scroll">
  <!-- content -->
</div>
```

### Menus

No JS: submenus open on focus, or on hover when an ancestor has `can-hover`.
Use `has-divider` for a separator, `aria-disabled` to disable an item,
`aria-haspopup="true"` for a caret, a nested `<span>` for a shortcut, and
`<img>` for an icon in the gutter. Checked items use a `checkbox`/`radio`
input plus an adjacent `<label>`.

```html
<ul role="menubar" class="can-hover">
  <li role="menuitem" tabindex="0" aria-haspopup="true">
    File
    <ul role="menu">
      <li role="menuitem"><a href="#">Open <span>Ctrl+O</span></a></li>
      <li role="menuitem" class="has-divider"><a href="#">Save As...</a></li>
      <li role="menuitem" aria-disabled="true"><a href="#">Print</a></li>
      <li role="menuitem">
        <input type="checkbox" id="m1" checked />
        <label for="m1">Show hidden files</label>
      </li>
    </ul>
  </li>
</ul>
```

A standalone dropdown is the same, rooted at `ul[role="menu"]`.

### Toolbar

```html
<div class="toolbar">
  <button>Organize</button>
  <button aria-pressed="true">Share with</button>
  <div class="toolbar-divider"></div>
  <button>New folder</button>
</div>
```

### Balloon tooltip

```html
<div role="tooltip">A balloon is better known as a tooltip.</div>
<div role="tooltip" class="is-top">This one sits above its control.</div>
```

Default tail points up (balloon below the control); `.is-top` points it down;
`.is-left` / `.is-right` move it sideways.

### Taskbar

```html
<div class="taskbar">
  <button class="start-orb" aria-label="Start"></button>
  <div class="taskbar-tasks">
    <button class="taskbar-button" aria-pressed="true">
      <span class="taskbar-button-icon"></span>
      <span class="taskbar-button-text">Windows Explorer</span>
    </button>
  </div>
  <div class="taskbar-tray">
    <div class="tray-clock">
      <span>8:00 PM</span>
      <span>9/27/2026</span>
    </div>
  </div>
</div>
```

### List view

The Details view, as a table. Add the `list-view` class to a `<table>`:

```html
<table class="list-view">
  <thead>
    <tr>
      <th>Name</th>
      <th class="highlighted indicator">Tags</th>
    </tr>
  </thead>
  <tbody>
    <tr class="highlighted"><td>Dock</td><td>Sample; Ocean</td></tr>
  </tbody>
</table>
```

`.highlighted` on a `<th>` or `<tr>` gives the blue selection gradient.
`.indicator` adds the sort caret; add `.up` to flip it. `.has-shadow` adds a
drop shadow. (It is opt-in so ordinary content tables are never touched.)

### Search box

`input[type="search"]` shows a magnifier while it is empty. For a
button-triggered search, wrap the input and a button in `.searchbox`:

```html
<input type="search" placeholder="Search" />

<div class="searchbox">
  <input type="search" placeholder="Search" />
  <button aria-label="search"></button>
</div>
```

### Spinner

A raster-free loading ring. `loader` is an alias for `spinner`; add `animate`
to rotate it.

```html
<span class="spinner" aria-label="Loading"></span>
<span class="loader animate" aria-label="Processing"></span>
```

## Theming

Everything is driven by custom properties on `:root`. Override them to
recolor without touching the components.

Key knobs (see `themes/aero/_variables.scss` for the full set):

| Variable | Default | Controls |
| --- | --- | --- |
| `--surface` | `#f0f0f0` | Client area, panels, menus. |
| `--text` / `--text-muted` | `#0a0a0a` / `#5a5a5a` | |
| `--accent` | `#3d8bd4` | Accent blue. |
| `--glass-blur` / `--glass-saturate` | `30px` / `1.7` | Frame glass. |
| `--glass-tint` | `rgba(22,32,44,.44)` | Frame tint (raise the alpha for a smokier frame). |
| `--window-radius` / `--radius` | `7px` / `3px` | |
| `--button-face` / `--button-border` / `--button-glow` | `#f2f2f2` / `#8e8f8f` / `rgba(120,195,255,.9)` | Push buttons. |
| `--field-border` / `--field-border-focus` | `#7f9db9` / `#3d7bad` | Text fields. |
| `--control-box-bg` / `--control-box-border-hover` | `#f6f6f6` / `#3c7fb1` | Checkbox / radio. |
| `--progress-bar` | `#0bd82c` | Vista green. |
| `--menu-gutter` / `--menu-highlight-border` | `28px` / `#aaddfa` | Menus. |
| `--taskbar-bg` / `--taskbar-edge` | dark glass | Taskbar. |

Two themes ship: `aero` (default, translucent) and `vista-basic` (opaque, no
blur). The Basic theme is a thin override — it imports `../aero/index.scss` and
then overrides `_variables.scss`, `_window.scss` and `_taskbar.scss`. To add
your own, create `themes/<name>/index.scss` the same way and give it a build
target in `build.js`.

## Working on the project

```
npm install
npm run build      # dist/Vista.css, dist/Vista-Basic.css, dist/GUI.css, dist/index.html
npm start          # watch + live-reloading docs at http://localhost:8080
npm publish        # builds via prepublishOnly, then publishes
```

CI (`.github/workflows/ci.yml`) runs the build on pushes and pull requests.
`.github/workflows/docs.yml` deploys `dist/` to GitHub Pages on pushes to
`master` (set Settings → Pages → Source → GitHub Actions).

### Architecture

- `gui/` — theme-agnostic component structure and the custom-property
  contract. `gui/index.scss` imports the partials.
- `themes/aero/` — the Vista skin: imports `gui/index.scss`, then overrides
  variables and component partials. This is where nearly all visuals live.
- `docs/` — an EJS doc site. `build.js` renders `docs/index.html.ejs` into
  `dist/index.html` using an `example()` helper (dedent + highlight.js +
  magic `[[ ]]` brackets for markup that shouldn't appear in the code sample).
- `build.js` — a small PostCSS pipeline:
  `postcss-import` → `postcss-nested` → a custom `svg-load()` inliner →
  `autoprefixer`. Output is intentionally **unminified** so the stylesheet is
  readable.

### Conventions

- **Structure in `gui/`, looks in `themes/`.** A component's colors, gradients,
  shadows and icons belong in the theme partial; its layout/reset belongs in
  `gui/`.
- **Icons are local SVGs** referenced with `svg-load("./icon/name.svg")`,
  resolved relative to the file containing the call. They are inlined as data
  URIs at build time. Hardcode colors in the SVG (background images cannot use
  `currentColor`).
- **Prefer custom properties** over hardcoded colors so the component stays
  themeable.
- **Keep markup stable** — changing a class or required structure is a breaking
  change for 98.css / XP.css users.
- Scoping note: `.title-bar-controls button`, `.toolbar button`,
  `.taskbar .taskbar-button`, `[role="menu"] button` etc. intentionally
  out-specify the generic `button` rule. Keep that in mind when adding button
  styles.
