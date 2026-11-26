// Makes the recorded voice clips. Run again after you change any text:   node build-audio.js
// It lists every line the assistant can say, then gen_audio.py records the lines that are missing.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

global.window = globalThis;
require("./strings.js");
require("./data.js");
require("./speech.js");
const { UI, TASKS, Speech } = globalThis;

const SPOKEN_UI = ["welcome", "finished", "lost", "noHear", "blocked", "noSupport", "first", "langNow"];
const clips = new Map(); // audio path -> text to speak

for (const lang of Object.keys(UI)) {
  const add = (text) => clips.set(Speech.audioPath(lang, text), { lang, text: Speech.pronounce(text, lang) });
  SPOKEN_UI.forEach((k) => add(UI[lang][k]));
  for (const task of TASKS) {
    add(task.name[lang]);
    // must match the line app.js speaks for a step
    task.steps.forEach((s, i) => add(`${UI[lang].step} ${i + 1}. ${s[lang]}`));
  }
}

const manifest = path.join(__dirname, "audio", "manifest.json");
fs.mkdirSync(path.dirname(manifest), { recursive: true });
fs.writeFileSync(manifest, JSON.stringify([...clips].map(([file, v]) => ({ file, ...v })), null, 1));
console.log(`${clips.size} lines to record`);

const r = spawnSync("python", ["gen_audio.py"], { stdio: "inherit", cwd: __dirname });
process.exit(r.status ?? 1);
