import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateScenarios } from "../src/data/generate";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "src", "data", "scenarios");
mkdirSync(outDir, { recursive: true });

for (const scenario of generateScenarios()) {
  const file = join(outDir, `${scenario.id}.json`);
  writeFileSync(file, `${JSON.stringify(scenario, null, 2)}\n`);
  console.log(`wrote ${file}`);
}
