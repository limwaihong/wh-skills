#!/usr/bin/env node
// wh-skills — install Claude skills into a project or globally.
// No dependencies. Node 18+.

const fs = require("fs");
const os = require("os");
const path = require("path");
const readline = require("readline");

const SKILLS_DIR = path.join(__dirname, "..", "skills");
const PKG = require(path.join(__dirname, "..", "package.json"));

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

// ---------- skills catalog ----------

function readFrontmatter(file) {
  const text = fs.readFileSync(file, "utf8");
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

function listSkills() {
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(SKILLS_DIR, d.name, "SKILL.md")))
    .map((d) => {
      const fm = readFrontmatter(path.join(SKILLS_DIR, d.name, "SKILL.md"));
      return { id: d.name, name: fm.name || d.name, description: fm.description || "" };
    });
}

// ---------- args ----------

function parseArgs(argv) {
  const opts = { skills: [], scope: null, agents: null, as: null, yes: false, list: false, help: false, version: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-g" || a === "--global") opts.scope = "global";
    else if (a === "-p" || a === "--project") opts.scope = "project";
    else if (a === "--claude") opts.agents = ["claude"];
    else if (a === "--codex") opts.agents = ["codex"];
    else if (a === "--both") opts.agents = ["claude", "codex"];
    else if (a === "--as") opts.as = argv[++i];
    else if (a === "-y" || a === "--yes") opts.yes = true;
    else if (a === "-l" || a === "--list") opts.list = true;
    else if (a === "-h" || a === "--help") opts.help = true;
    else if (a === "-v" || a === "--version") opts.version = true;
    else if (a.startsWith("-")) fail(`Unknown option: ${a}`);
    else opts.skills.push(a);
  }
  return opts;
}

function help() {
  console.log(`
${c.bold("wh-skills")} ${c.dim("v" + PKG.version)} — install agent skills for Claude Code and Codex

${c.bold("Usage")}
  npx wh-skills                      Pick skills and where to install them
  npx wh-skills <skill> [<skill>…]   Install specific skills
  npx wh-skills --list               Show available skills

${c.bold("Options")}
  --claude         Install for Claude Code   (.claude/skills)
  --codex          Install for Codex         (.agents/skills)
  --both           Install for both
  -g, --global     Install in your home folder (all projects)
  -p, --project    Install in this project only
  --as <name>      Install one skill under a new name
  -y, --yes        Overwrite existing skills without asking
  -h, --help       Show this help

${c.bold("Examples")}
  npx wh-skills wh-company-brief --claude --global
  npx wh-skills wh-company-brief --codex --global
  npx wh-skills wh-company-brief --both --as company-brief
`);
}

function fail(msg) {
  console.error(c.red("✖ " + msg));
  process.exit(1);
}

// ---------- prompts ----------

// Line-buffered prompt: works in a terminal and with piped answers.
let rl;
const lines = [];
const waiting = [];
let ended = false;
function initPrompt() {
  if (rl) return;
  rl = readline.createInterface({ input: process.stdin, terminal: false });
  rl.on("line", (l) => (waiting.length ? waiting.shift()(l) : lines.push(l)));
  rl.on("close", () => {
    ended = true;
    while (waiting.length) waiting.shift()("");
  });
}
function ask(q) {
  initPrompt();
  process.stdout.write(q);
  return new Promise((res) => {
    const done = (a) => {
      if (!process.stdin.isTTY) process.stdout.write(a + "\n");
      res(a.trim());
    };
    if (lines.length) done(lines.shift());
    else if (ended) done("");
    else waiting.push(done);
  });
}
function closePrompt() {
  if (rl) rl.close();
}

const AGENTS = {
  claude: { label: "Claude Code", dir: ".claude", invoke: (n) => `/${n}` },
  codex: { label: "Codex", dir: ".agents", invoke: (n) => `$${n}` },
};

async function chooseAgents() {
  const hasClaude = fs.existsSync(path.join(os.homedir(), ".claude"));
  const hasCodex = fs.existsSync(path.join(os.homedir(), ".codex"));
  const def = hasClaude && hasCodex ? "3" : hasCodex ? "2" : "1";
  console.log(`\n${c.bold("Which tool?")}`);
  console.log(`  1) Claude Code`);
  console.log(`  2) Codex`);
  console.log(`  3) Both`);
  const a = (await ask(c.dim(`Choose 1, 2 or 3 [${def}]: `))) || def;
  return a === "3" ? ["claude", "codex"] : a === "2" ? ["codex"] : ["claude"];
}

async function chooseScope(agents) {
  console.log(`\n${c.bold("Where do you want to install?")}`);
  const dirs = agents.map((a) => AGENTS[a].dir);
  console.log(`  1) Globally        ${c.dim(dirs.map((d) => `~/${d}/skills`).join(", ") + "  — every project")}`);
  console.log(`  2) This project    ${c.dim(dirs.map((d) => `./${d}/skills`).join(", ") + "  — " + process.cwd())}`);
  const a = await ask(c.dim("Choose 1 or 2 [1]: "));
  return a === "2" ? "project" : "global";
}

async function chooseSkills(all) {
  console.log(`\n${c.bold("Which skills?")}`);
  all.forEach((s, i) => {
    const desc = s.description.length > 90 ? s.description.slice(0, 87) + "…" : s.description;
    console.log(`  ${i + 1}) ${c.bold(s.id)}\n     ${c.dim(desc)}`);
  });
  const a = await ask(c.dim(`Enter numbers separated by commas, or "all" [all]: `));
  if (!a || a.toLowerCase() === "all") return all.map((s) => s.id);
  const picked = a
    .split(/[,\s]+/)
    .map((n) => parseInt(n, 10) - 1)
    .filter((i) => i >= 0 && i < all.length)
    .map((i) => all[i].id);
  if (!picked.length) fail("No valid skills selected.");
  return [...new Set(picked)];
}

// ---------- install ----------

function validName(n) {
  return /^[a-z0-9][a-z0-9-]{0,63}$/.test(n);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function renameInSkillFile(file, oldName, newName) {
  let text = fs.readFileSync(file, "utf8");
  text = text.replace(/^(---\n[\s\S]*?^name:\s*).*$/m, `$1${newName}`);
  text = text.split(`/${oldName}`).join(`/${newName}`);
  fs.writeFileSync(file, text);
}

async function installOne(id, targetName, baseDir, overwrite) {
  const src = path.join(SKILLS_DIR, id);
  const dest = path.join(baseDir, targetName);
  if (fs.existsSync(dest)) {
    let ok = overwrite;
    if (!ok) {
      const a = await ask(c.yellow(`? ${targetName} already exists. Overwrite? (y/N) `));
      ok = /^y(es)?$/i.test(a);
    }
    if (!ok) {
      console.log(c.dim(`  skipped ${targetName}`));
      return false;
    }
    fs.rmSync(dest, { recursive: true, force: true });
  }
  copyDir(src, dest);
  if (targetName !== id) renameInSkillFile(path.join(dest, "SKILL.md"), id, targetName);
  console.log(`${c.green("✔")} ${c.bold(targetName)} ${c.dim("→ " + dest)}`);
  return true;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const all = listSkills();

  if (opts.version) return console.log(PKG.version);
  if (opts.help) return help();
  if (opts.list) {
    console.log(c.bold("\nAvailable skills\n"));
    for (const s of all) console.log(`  ${c.bold(s.id)}\n  ${c.dim(s.description)}\n`);
    return;
  }

  console.log(`\n${c.bold("wh-skills")} ${c.dim("v" + PKG.version)}`);

  // Which skills
  let chosen = opts.skills;
  if (chosen.length) {
    const unknown = chosen.filter((s) => !all.find((a) => a.id === s));
    if (unknown.length) fail(`Unknown skill: ${unknown.join(", ")}. Run "npx wh-skills --list" to see all skills.`);
  } else {
    chosen = await chooseSkills(all);
  }

  if (opts.as && chosen.length !== 1) fail("--as works with exactly one skill.");
  if (opts.as && !validName(opts.as)) fail("Skill names use lowercase letters, numbers and hyphens only.");

  // Which tool and where
  const agents = opts.agents || (await chooseAgents());
  const scope = opts.scope || (await chooseScope(agents));
  const root = scope === "global" ? os.homedir() : process.cwd();
  const targets = agents.map((a) => ({ agent: a, dir: path.join(root, AGENTS[a].dir, "skills") }));
  for (const t of targets) fs.mkdirSync(t.dir, { recursive: true });

  // Names (rename during install)
  const interactive = !opts.skills.length && !opts.as;
  const plan = [];
  for (const id of chosen) {
    let target = opts.as || id;
    if (interactive) {
      const a = await ask(c.dim(`Name for ${c.bold(id)} [${id}]: `));
      if (a) {
        if (!validName(a)) fail("Skill names use lowercase letters, numbers and hyphens only.");
        target = a;
      }
    }
    plan.push([id, target]);
  }

  console.log("");
  let count = 0;
  const done = new Set();
  for (const t of targets) {
    console.log(c.dim(`${AGENTS[t.agent].label}:`));
    for (const [id, target] of plan)
      if (await installOne(id, target, t.dir, opts.yes)) {
        count++;
        done.add(t.agent);
      }
  }
  closePrompt();

  if (count) {
    const first = plan[0][1];
    const n = plan.length;
    const tools = [...done].map((a) => AGENTS[a].label).join(" and ");
    console.log(`\n${c.green("Done.")} Installed ${n} skill${n > 1 ? "s" : ""} for ${tools}.`);
    for (const a of done) {
      const cmd = AGENTS[a].invoke(first);
      console.log(`${AGENTS[a].label}: type ${c.bold(cmd)} — for example:`);
      console.log(c.dim(`  ${cmd} Grab — Senior Product Designer interview next week`));
    }
    console.log("");
  }
}

main().catch((e) => {
  closePrompt();
  fail(e.message || String(e));
});
