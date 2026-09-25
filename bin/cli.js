#!/usr/bin/env node
// wh-skills — install agent skills for Claude Code and Codex, in a project or globally.
// Node 20.12+. The interactive menu uses @clack/prompts.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

const tildify = (p) => (p.startsWith(os.homedir()) ? "~" + p.slice(os.homedir().length) : p);

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

The menu needs a terminal. In scripts, pass a skill, a tool and a place.

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

// Every prompt returns a cancel symbol on Ctrl+C or Esc.
function orExit(value) {
  if (p.isCancel(value)) {
    p.cancel("Install cancelled.");
    process.exit(0);
  }
  return value;
}

const AGENTS = {
  claude: { label: "Claude Code", dir: ".claude", invoke: (n) => `/${n}` },
  codex: { label: "Codex", dir: ".agents", invoke: (n) => `$${n}` },
};

async function chooseSkills(all) {
  const short = (s) => (s.length > 70 ? s.slice(0, 67) + "…" : s);
  return orExit(
    await p.multiselect({
      message: "Which skills do you want?",
      options: all.map((s) => ({ value: s.id, label: s.id, hint: short(s.description) })),
      initialValues: all.map((s) => s.id),
      required: true,
    })
  );
}

async function chooseAgents() {
  const hasClaude = fs.existsSync(path.join(os.homedir(), ".claude"));
  const hasCodex = fs.existsSync(path.join(os.homedir(), ".codex"));
  const choice = orExit(
    await p.select({
      message: "Which tool do you use?",
      options: [
        { value: "claude", label: "Claude Code" },
        { value: "codex", label: "Codex" },
        { value: "both", label: "Both" },
      ],
      initialValue: hasClaude && hasCodex ? "both" : hasCodex ? "codex" : "claude",
    })
  );
  return choice === "both" ? ["claude", "codex"] : [choice];
}

async function chooseScope() {
  return orExit(
    await p.select({
      message: "Where do you want to install these skills?",
      options: [
        { value: "global", label: "Globally", hint: "every project" },
        { value: "project", label: "This project", hint: tildify(process.cwd()) },
      ],
      initialValue: "global",
    })
  );
}

async function wantsRename(count) {
  return orExit(
    await p.confirm({ message: `Do you want to rename the skill${count > 1 ? "s" : ""}?`, initialValue: false })
  );
}

async function chooseName(id) {
  const name = orExit(
    await p.text({
      message: `New name for ${id}`,
      placeholder: `${id}  (press Return to keep)`,
      defaultValue: id,
      validate: (v) => (!v || validName(v) ? undefined : "Use lowercase letters, numbers and hyphens only."),
    })
  );
  return name || id;
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

async function installOne(id, targetName, baseDir, agent, { overwrite, tty }) {
  const src = path.join(SKILLS_DIR, id);
  const dest = path.join(baseDir, targetName);
  const label = AGENTS[agent].label;
  if (fs.existsSync(dest)) {
    let ok = overwrite;
    if (!ok && tty) {
      ok = orExit(
        await p.confirm({ message: `${targetName} already exists in ${tildify(baseDir)}. Overwrite it?`, initialValue: false })
      );
    }
    if (!ok) {
      p.log.warn(`${label}: skipped ${targetName}${tty ? "" : " (it exists; add --yes to overwrite)"}`);
      return false;
    }
    fs.rmSync(dest, { recursive: true, force: true });
  }
  copyDir(src, dest);
  if (targetName !== id) renameInSkillFile(path.join(dest, "SKILL.md"), id, targetName);
  p.log.success(`${label}: ${c.bold(targetName)} ${c.dim("→ " + tildify(dest))}`);
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

  if (opts.skills.length) {
    const unknown = opts.skills.filter((s) => !all.find((a) => a.id === s));
    if (unknown.length) fail(`Unknown skill: ${unknown.join(", ")}. Run "npx wh-skills --list" to see all skills.`);
  }
  if (opts.as && opts.skills.length !== 1) fail("--as works with exactly one skill.");
  if (opts.as && !validName(opts.as)) fail("Skill names use lowercase letters, numbers and hyphens only.");

  // The menu needs a real terminal. Without one, every choice must come from flags.
  const tty = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  if (!tty && (!opts.skills.length || !opts.agents || !opts.scope)) {
    fail(
      "No terminal for the menu. Pass a skill, a tool and a place, for example:\n" +
        "  npx wh-skills wh-company-brief --claude --global"
    );
  }

  p.intro(`${c.cyan("wh-skills")} installer ${c.dim("v" + PKG.version)}`);

  const chosen = opts.skills.length ? opts.skills : await chooseSkills(all);
  const agents = opts.agents || (await chooseAgents());
  const scope = opts.scope || (await chooseScope());
  const root = scope === "global" ? os.homedir() : process.cwd();
  const targets = agents.map((a) => ({ agent: a, dir: path.join(root, AGENTS[a].dir, "skills") }));

  // Names (rename during install) only when the skills came from the menu.
  const askNames = tty && !opts.skills.length && (await wantsRename(chosen.length));
  const plan = [];
  for (const id of chosen) plan.push([id, opts.as || (askNames ? await chooseName(id) : id)]);

  for (const t of targets) fs.mkdirSync(t.dir, { recursive: true });
  let count = 0;
  const done = new Set();
  for (const t of targets)
    for (const [id, target] of plan)
      if (await installOne(id, target, t.dir, t.agent, { overwrite: opts.yes, tty })) {
        count++;
        done.add(t.agent);
      }

  if (!count) return p.outro("Nothing installed.");

  const first = plan[0][1];
  const n = plan.length;
  const tools = [...done].map((a) => AGENTS[a].label).join(" and ");
  p.note(
    [...done].map((a) => `${AGENTS[a].label}: ${c.bold(AGENTS[a].invoke(first))} Grab — Senior Product Designer`).join("\n"),
    "Try it"
  );
  p.outro(`Done. Installed ${n} skill${n > 1 ? "s" : ""} for ${tools}.`);
}

main().catch((e) => fail(e.message || String(e)));
