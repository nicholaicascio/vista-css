#!/usr/bin/env node
/**
 * vista.css build
 *
 * Compiles the `gui/` core plus the `themes/aero/` skin into self-contained
 * stylesheets in `dist/`, and renders the docs site from `docs/index.html.ejs`.
 *
 * The pipeline is deliberately small and modern:
 *   postcss-import  -> inline the partials into a single file
 *   postcss-nested  -> allow nested selectors while authoring
 *   svg-load()      -> inline local SVG icons as data URIs (custom plugin below)
 *   autoprefixer    -> vendor prefixes for backdrop-filter, appearance, etc.
 *
 * Output is intentionally left unminified: `dist/Vista.css` is meant to be a
 * readable, drop-in stylesheet.
 */

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const postcssImport = require("postcss-import");
const postcssNestedModule = require("postcss-nested");
const autoprefixer = require("autoprefixer");

const postcssNested =
  typeof postcssNestedModule === "function"
    ? postcssNestedModule
    : postcssNestedModule.default;
const ejs = require("ejs");
const hljs = require("highlight.js");
const dedent = require("dedent");

const pkg = require("./package.json");
const { version, homepage } = pkg;
const ROOT = __dirname;

/* -------------------------------------------------------------------------- *\
   svg-load("path/to/icon.svg") -> url("data:image/svg+xml,...")
   Paths resolve relative to the file that contains the declaration, so a theme
   partial can reference "./icon/foo.svg" from its own directory.
\* -------------------------------------------------------------------------- */

const SVG_LOAD_RE =
  /svg-load\(\s*(?:"([^"]+)"|'([^']+)')\s*(?:,\s*(?:"([^"]+)"|'([^']+)')\s*)?\)/g;

function svgLoadPlugin(options = {}) {
  const fallbackDir = options.dir || ROOT;

  return {
    postcssPlugin: "svg-load",
    Declaration(decl) {
      if (!decl.value || decl.value.indexOf("svg-load(") === -1) return;

      decl.value = decl.value.replace(SVG_LOAD_RE, (_match, q1, q2, c1, c2) => {
        const file = q1 || q2;
        const color = c1 || c2;

        const fromFile = decl.source && decl.source.input && decl.source.input.file;
        const baseDir = fromFile ? path.dirname(fromFile) : fallbackDir;

        let svgPath = path.resolve(baseDir, file);
        if (!fs.existsSync(svgPath)) svgPath = path.resolve(fallbackDir, file);

        let svg = fs.readFileSync(svgPath, "utf8");
        if (color) svg = svg.replace(/currentColor/g, color);

        return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
      });
    },
  };
}
svgLoadPlugin.postcss = true;

/* -------------------------------------------------------------------------- *\
   CSS build
\* -------------------------------------------------------------------------- */

const processors = [
  postcssImport(),
  postcssNested(),
  svgLoadPlugin(),
  autoprefixer(),
];

async function buildCSS({ from, to, banner }) {
  const fromPath = path.join(ROOT, from);
  const toPath = path.join(ROOT, to);
  const source = fs.readFileSync(fromPath, "utf8");

  const result = await postcss(processors).process(`${banner}\n${source}`, {
    from: fromPath,
    to: toPath,
    map: { inline: false, annotation: path.basename(to) + ".map" },
  });

  fs.mkdirSync(path.dirname(toPath), { recursive: true });
  fs.writeFileSync(toPath, result.css);
  if (result.map) fs.writeFileSync(toPath + ".map", result.map.toString());

  return toPath;
}

/* -------------------------------------------------------------------------- *\
   Docs build
\* -------------------------------------------------------------------------- */

function makeExample() {
  let id = 0;

  function example(code) {
    const magicBrackets = /\[\[(.*?)\]\]/g;
    const dedented = dedent(code);
    const inline = dedented.replace(magicBrackets, "$1");
    const escaped = hljs.highlight(dedented.replace(magicBrackets, ""), {
      language: "html",
    }).value;

    return `<div class="docs-example">
      <div class="docs-example-render">${inline}</div>
      <details class="docs-example-code">
        <summary>Show code</summary>
        <pre><code class="hljs">${escaped}</code></pre>
      </details>
    </div>`;
  }

  return {
    example,
    getNewId: () => ++id,
    getCurrentId: () => id,
  };
}

async function buildDocs() {
  const docsDir = path.join(ROOT, "docs");
  const outDir = path.join(ROOT, "dist");
  fs.mkdirSync(outDir, { recursive: true });

  for (const file of fs.readdirSync(docsDir)) {
    if (file.endsWith(".ejs")) continue;
    fs.copyFileSync(path.join(docsDir, file), path.join(outDir, file));
  }

  const template = fs.readFileSync(path.join(docsDir, "index.html.ejs"), "utf8");
  const cacheBust = `${version}.${Date.now().toString(36)}`;
  const html = ejs.render(template, { ...makeExample(), version, cacheBust });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
}

/* -------------------------------------------------------------------------- *\
   Entry point
\* -------------------------------------------------------------------------- */

async function build() {
  await buildCSS({
    from: "themes/aero/index.scss",
    to: "dist/Vista.css",
    banner: `/*! Vista.css v${version} - ${homepage} */`,
  });

  await buildCSS({
    from: "themes/vista-basic/index.scss",
    to: "dist/Vista-Basic.css",
    banner: `/*! Vista-Basic.css v${version} - ${homepage} */`,
  });

  await buildCSS({
    from: "gui/index.scss",
    to: "dist/GUI.css",
    banner: `/*! GUI.css v${version} - ${homepage} */`,
  });

  await buildDocs();

  console.log(
    "Built dist/Vista.css, dist/Vista-Basic.css, dist/GUI.css and dist/index.html"
  );
}

if (require.main === module) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = build;
