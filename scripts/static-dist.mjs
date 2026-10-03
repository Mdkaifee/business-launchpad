// Collects the prerendered static site into ./dist for static hosts like Render.
import { cpSync, existsSync, renameSync, rmSync } from "node:fs";

if (existsSync(".output/public")) {
  rmSync("dist", { recursive: true, force: true });
  cpSync(".output/public", "dist", { recursive: true });
} else if (existsSync("dist/client")) {
  rmSync(".static-tmp", { recursive: true, force: true });
  renameSync("dist/client", ".static-tmp");
  rmSync("dist", { recursive: true, force: true });
  renameSync(".static-tmp", "dist");
} else {
  console.error("No build output found");
  process.exit(1);
}
if (!existsSync("dist/index.html")) {
  console.error("dist/index.html missing — prerender failed");
  process.exit(1);
}
console.log("Static site ready in dist/");
