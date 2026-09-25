# wh-skills

Skills that make life easier. Free and open source agent skills by [Kevin Lim](https://www.limwaihong.com), for Claude Code, Codex and the Claude app.

[![npm version](https://img.shields.io/npm/v/wh-skills.svg)](https://www.npmjs.com/package/wh-skills)
[![npm downloads](https://img.shields.io/npm/dm/wh-skills.svg)](https://www.npmjs.com/package/wh-skills)
[![GitHub stars](https://img.shields.io/github/stars/limwaihong/wh-skills.svg?style=social)](https://github.com/limwaihong/wh-skills)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Install

```bash
npx wh-skills
```

Choose Claude Code, Codex or both. Then choose the current project or all projects, and pick the skills you want. You can rename a skill during install, or install one skill directly:

```bash
npx wh-skills wh-company-brief
```

**Using the Claude app (desktop, web or mobile)?** Download [wh-company-brief.zip](https://github.com/limwaihong/wh-skills/releases/latest/download/wh-company-brief.zip). In Claude, go to **Customize → Skills → + → Create skill → Upload a skill**, and upload the ZIP.

## Skills

| Skill | What it does |
|---|---|
| `wh-company-brief` | Turns a company name, job link or job description into a sourced quick brief: how the company makes money, recent news, growth and caution signals, competitors, talking points and stories to prepare. Covers the US, Malaysia, Singapore, China and Southeast Asia. |

## Use it

Claude Code:

```
/wh-company-brief Grab — Senior Product Designer interview next week
```

Codex (turn on web search, so the brief can use live sources):

```
$wh-company-brief Grab — Senior Product Designer interview next week
```

Claude app: type `/wh-company-brief Grab`, or ask "brief me on Grab".

Add a job link or your resume for a more personal brief. In Claude Code and Codex, briefs are saved to `company-briefs/<company>-<date>.md` in your current folder, so you build a library of briefs over time.

### What a brief contains

- **Quick Summary** and **Signal** (Healthy, Mixed or Caution)
- Snapshot: founded, HQ, listing or funding, size, latest numbers
- How they make money
- Recent news from the last 90 days
- Signals to know: growth and caution
- Competitors
- Culture themes from employee reviews
- Talking points
- Your stories to prepare
- Sources, with a link and a date for every fact

## Options

| Option | Effect |
|---|---|
| `--claude` | Install for Claude Code (`.claude/skills`) |
| `--codex` | Install for Codex (`.agents/skills`) |
| `--both` | Install for both |
| `-g`, `--global` | Install in your home folder (all projects) |
| `-p`, `--project` | Install in this project only |
| `--as <name>` | Install one skill under a new name |
| `-y`, `--yes` | Overwrite existing skills without asking |
| `-l`, `--list` | Show available skills |

## Feedback

Did a brief help you in an interview? Did something go wrong? Send feedback to **[waihonglim@icloud.com](mailto:waihonglim@icloud.com)**, or [open an issue](https://github.com/limwaihong/wh-skills/issues).

If a skill saves you time, a ⭐ on this repo helps other people find it.

## License

[MIT](LICENSE) © 2026 Kevin Lim (TableForTwo Design Studio)
