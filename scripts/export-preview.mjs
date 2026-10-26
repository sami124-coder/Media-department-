import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Export the actual production app as a single HTML file for offline review.
// Images, fonts, CSS and JavaScript are embedded; no server or credentials needed.
const root = process.cwd();
const dist = path.join(root, "dist");
const types = {
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};
const dataUrl = async (relative) => {
  const file = path.join(dist, relative.replace(/^\//, ""));
  return `data:${types[path.extname(file)] || "application/octet-stream"};base64,${(await readFile(file)).toString("base64")}`;
};
let html = await readFile(path.join(dist, "index.html"), "utf8");
const scriptMatch = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
const styleMatch = html.match(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/);
if (!scriptMatch || !styleMatch)
  throw new Error("Expected one bundled production script and stylesheet.");
let script = await readFile(path.join(dist, scriptMatch[1]), "utf8");
for (const image of new Set(
  script.match(/identity\/[a-z0-9-]+\.(?:jpg|png|webp)/g) || [],
)) {
  script = script.replaceAll(image, await dataUrl(image));
}
let css = await readFile(path.join(dist, styleMatch[1]), "utf8");
for (const match of [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)]) {
  const asset = match[1];
  if (asset.startsWith("data:")) continue;
  const relative = asset.startsWith("/")
    ? asset
    : path.posix.join(path.posix.dirname(styleMatch[1]), asset);
  css = css.replaceAll(match[0], `url("${await dataUrl(relative)}")`);
}
html = html.replace(
  scriptMatch[0],
  () =>
    `<script type="module">${script.replaceAll("</script", "<\\/script")}</script>`,
);
html = html.replace(styleMatch[0], () => `<style>${css}</style>`);
html = html.replace(/(?:\.\/|\/)favicon\.svg/, await dataUrl("/favicon.svg"));
const output = path.join(root, "preview", "HSIYC-Media-Preview.html");
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, html);
console.log(
  `Created ${output} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(1)} MB). Open it directly in a browser.`,
);
