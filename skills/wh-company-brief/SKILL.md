---
name: wh-company-brief
description: Makes a sourced quick brief on a company from a name, job link or job description. Use for /wh-company-brief or 'brief me on [company]'
---

# Company Brief

Produce a brief that a candidate can read in 2 minutes and use in an interview the same day. The brief must be specific, recent, and sourced. A short brief with 10 verified facts beats a long brief with 30 guesses.

Use this skill when a job seeker wants to research a company before an interview, an application or an offer. Triggers include "/wh-company-brief", "brief me on <company>", "research <company> before my interview", "what should I know about <company>", "is <company> stable", "did <company> have layoffs", or a pasted job post link or job description with a question about the company.

## 1. Read the input

Accept any of these, alone or together:

- **Company name** (for example "Grab").
- **Job post URL.** Fetch it. Extract the company, role title, team, location, seniority, pay range (if shown), and the 3–5 main responsibilities.
- **Job description text.** Extract the same fields.
- **Role title only.** Search for the live posting on the company careers page, Greenhouse, Lever, Ashby, Workday, LinkedIn or JobStreet. If found, use it as a job post. If not found, say "posting not found; role context is inferred" in the brief.
- **Resume** (pasted text or an attached file). Optional.
- **Stage** (apply, interview, offer). Optional. Default to "interview".

Then settle two things that shape the Talking points and Your stories sections:

- **Target role**: the role from the job post, job description or the user's message. If none is given, there is no target role.
- **Candidate background**: the resume if given. If not, use what you already know about the user: their memory or profile, earlier messages in this conversation, and files they shared. Use only work-relevant facts (roles, companies, skills, projects, location). Never use sensitive personal details. If you know nothing about the user, there is no candidate background.

Ask one short question before research only when the company is ambiguous (two companies share the name, or the brand differs from the legal entity). For every other gap, make a sensible choice and state it in the brief. If a job post URL fails to load, ask the user to paste the job description.

## 2. Identify the company

Before researching, fix these facts and use them in every search:

- Brand name, legal name, main website domain
- HQ country and the country of the role
- Public or private; if public, the exchange and ticker
- Approximate size (employees) and year founded
- Parent company, if any

The domain is the anchor. It prevents mixing up companies with similar names.

## 3. Research

Pick sources by the company's country and listing status. Use the "Sources by region" section below for the source list per region and for fallbacks. Run searches in this order and stop a thread once it is answered:

1. **Business model**: how it makes money, main products, main customers, pricing model. Use the company site, investor pages, or the latest annual report.
2. **Numbers**: latest revenue, growth, profit or loss. Public: latest quarterly release and earnings-call transcript. Private: the metrics the company discloses (see "Private companies" below).
3. **News, last 90 days**: launches, leadership changes, partnerships, lawsuits, regulation, earnings. Take the 3 most relevant to the role.
4. **Role and team context**: news, launches, talks, or executive quotes about the product area or team the role sits in. Earnings-call and conference transcripts are often the richest source. For product, design and engineering roles, also check the app store rating and review themes, and the latest competitor product launches.
5. **Risk signals, last 12 months**: layoffs (date, count, % if known, which teams), hiring freezes, executive exits, down rounds, missed guidance, restructuring, regulatory action.
6. **Growth signals, last 12 months**: new funding, strong results, new markets, new offices, hiring in the role's team.
7. **Competitors**: the top 3, how this company is different, and any recent competitor move that affects the role.
8. **Culture signals**: recurring themes from at least 2 review platforms (see "Sources by region" below).

Open the pages that numbers and dates come from. A search snippet is not a source.

### Time windows

- News: last 90 days by default. An item up to 6 months old may be included if it is clearly the most relevant item for the role. Its date shows its age.
- Signals: last 12 months. A major older event (layoffs, a failed IPO, a scandal) may be listed under Caution as "Earlier: <event> — <date>". Include it only when the candidate would likely be asked about it or should ask about it.

### Private companies

- If revenue is not disclosed, write "Revenue not disclosed". Use what the company does publish: GMV, EBITDA, gross profit, units, users, or ARR.
- Funding: show the last round (date, amount, lead) and the last disclosed valuation (date) as separate facts. They are often years apart.
- Headcount: use the newest sourced figure and its date. If it is more than 12 months old, add "(no newer figure found)". A LinkedIn employee count is acceptable if you label it "LinkedIn, approx."

## 4. Verification rules

- Every fact in the brief has a source link and a date. If there is no source, leave the fact out.
- Any claim that could hurt or mislead needs a primary source or a named major outlet. This covers risk, competitor, financial and leadership claims. If only one weak source exists, write "reported by <outlet>, not confirmed".
- Paywalled source: confirm the fact through a source you can open (a transcript, a filing, another outlet) and cite that source. If you cannot confirm it, leave the fact out.
- Official sources that conflict (for example the website and a press release): use the newest dated primary document. If the difference is material, mention it in one line.
- Use the newest data. Give the period for every number ("FY2025 revenue", "Q2 2026").
- Mark estimates as estimates. Never invent numbers, names or dates.
- Report risk as **signals with reasons**, never as a verdict about the company. Write "3 signals to ask about", not "this company is dying".
- If data is thin (small private company, little press), say so in one line and give the best available facts. Thin data is useful information for the candidate.

## 5. Write the brief

Follow the exact structure in the "Brief template" section below. Key rules:

- **Length:** 450–700 words, not counting the Sources list and link URLs. It must be readable in 2 minutes.
- **When space is tight**, keep the items that are most recent and most relevant to the role's team. Cut general company history first.
- Use short sentences, plain words and no hype. Write dates as "5 Aug 2026", except the "Prepared" line (YYYY-MM-DD).
- **Talking points** are about the company. Each one names a real launch, number, quote or strategy. Write each one as a line the candidate could say, starting with "You could say:".
    - With a target role: link each point to the role's team, product area or responsibilities.
    - Without a target role: keep the points general, about the company's strategy, growth and direction, so any candidate can use them.
- **Your stories to prepare** links the candidate's real experience to the company's current challenges. Give 2–3 stories.
    - With a target role, pick the challenges that role would own.
    - Use the candidate background: the resume first, then what you know about the user.
    - If you used what you know about the user and not a resume, start the section with one line: "Based on what I know about you. Add your resume for better matches."
    - If there is no candidate background, write exactly 2 sentences of general guidance instead of stories. Sentence 1 names the 1–2 company challenges a strong story should match. Sentence 2 names the kind of experience that fits them.
    - Do not invent experience. Do not repeat these in Talking points.

## 6. Deliver

File name for every brief: `<company>-<YYYY-MM-DD>.md`. Write the company in lowercase, with hyphens for spaces (for example `carsome-2026-09-25.md`, `grab-holdings-2026-09-25.md`).

Use the first option that fits:

1. **Document tool available** (for example Claude Docs): create the brief as a document titled "Company Brief: <Company>", so the user can share it.
2. **Working folder available** (for example Claude Code or Codex): save the brief to `company-briefs/<company>-<YYYY-MM-DD>.md` in the current working folder. Create the `company-briefs` folder if it does not exist. Never overwrite an existing brief: if the file name is already used, add `-2`, `-3` and so on.
3. **Neither**: create the Markdown file with the same file name and send it to the user.

In the chat reply, write one line: the overall signal (for example "Mixed: strong growth, 2 leadership exits to ask about") and the link or file path. Do not repeat the brief in chat.

---

## Brief template

Use this structure exactly. Headings in this order. Leave out a section only if there is no sourced data for it, and say so in one line.

```markdown
# Company Brief: <Company>

Prepared <2026-09-25>

**Quick Summary:** <What the company does + its current situation, one sentence.>

**Signal:** <Healthy | Mixed | Caution> — <one short reason>

## Snapshot
| | |
|---|---|
| Founded / HQ | <year> · <city, country> |
| Status | <Public: exchange:ticker | Private: last round (date, amount); last disclosed valuation (date)> |
| Size | <employees> (<source>, <date>) |
| Latest numbers | <revenue / growth / profit, with period — or the disclosed metrics and "Revenue not disclosed"> |

## How they make money
- <Revenue stream 1 — who pays, how (seat, usage, take-rate, ads, etc.)>
- <Revenue stream 2>
- <The one metric the business lives on, if clear (e.g. GMV, net revenue retention, gross profit per unit)>

## Recent news (last 90 days)
1. **<5 Aug 2026> — <Headline in plain words>.** <Why it matters for the target role, or for a candidate if there is no role, one sentence.> [source](url)
2. ...
3. ...

## Signals to know
**Growth**
- <Signal> — <date> [source](url)

**Caution**
- <Signal> — <date> [source](url)
- Earlier: <major older event, only if relevant> — <date> [source](url)

## Competitors
| Competitor | How <Company> is different | Source |
|---|---|---|
| <Name> | <one line; include a recent competitor move if it matters for the role> | [source](url) |
| <Name> | <one line> | [source](url) |
| <Name> | <one line> | [source](url) |

## Culture themes
- <Theme> (<platform>, <rating>, <number of reviews>)
- <Theme>
- <Which roles most reviews come from, if it is not the candidate's function>

## Talking points
1. You could say: "<A line that ties a real company fact to the target role, or a general point if there is no role.>" [source](url)
2. ...
3. ...

## Your stories to prepare
<With a candidate background:>
<"Based on what I know about you. Add your resume for better matches." — only when no resume was given>
- **<Company challenge>** → <candidate's real experience> → Story to tell: <one line>

<With no candidate background: exactly 2 sentences of general guidance — the challenges to match, then the kind of experience that fits.>

## Sources
- [Title](url) — <date>
- ...
```

### Signal rules

Pick one label:

- **Healthy**: growth signals present, and no caution signals in the last 6 months.
- **Caution**: caution signals in the last 6 months (layoffs, down round, widening losses, several executive exits, missed guidance), and few or weak growth signals.
- **Mixed**: strong growth signals and recent caution signals are both present. Use Mixed when you are not sure.

The reason after the label names the strongest signal on each side.

### Style notes

- Dates: "Prepared" line uses YYYY-MM-DD (for example 2026-09-25). All other dates use "5 Aug 2026" format.
- Never call a company "bad", "dying" or "safe". Describe signals.

---

## Sources by region

Use the region of the company's HQ and the region of the role. For multinational companies, use both.

### All regions

| Need | Sources |
|---|---|
| Business model | Company website, "About", investor relations page, annual report |
| Numbers and strategy (public) | Quarterly earnings release, earnings-call transcript (Motley Fool, Seeking Alpha, Investing.com), investor conference transcripts. Transcripts often hold the best quotes for talking points. |
| Layoffs | News search first (see patterns below). layoffs.fyi and TrueUp are US-leaning; use them as a cross-check, not the main source. |
| Funding (private) | Company press releases or newsroom, TechCrunch, Crunchbase News, DealStreetAsia (Asia) |
| Culture | At least 2 of: Glassdoor, Indeed, Blind (tech staff), Comparably, JobStreet (Asia). Note which roles the reviews come from. |
| Leadership | Company leadership page, press releases, earnings-call remarks |
| Product news | Company newsroom or blog (dated posts). Changelog pages often have no dates when fetched; do not rely on them. |
| Product quality (product, design, engineering roles) | Google Play and Apple App Store listing: rating, review count, top complaint themes |
| Competitor moves | Competitor newsroom and tech press for the last 90 days |
| Job posting | Company careers page, Greenhouse, Lever, Ashby, Workday, LinkedIn Jobs, JobStreet |

### Fallbacks when a source is blocked

- **SEC EDGAR pages blocked**: use the company investor relations "SEC filings" page, the earnings release on Business Wire or PR Newswire, or a named aggregator (StockAnalysis, MacroTrends). Cite the aggregator and the filing date it reports.
- **Paywalled outlet** (Bloomberg, The Information, WSJ, The Edge): find the same fact in a free rewrite (Reuters, Yahoo Finance, TNGlobal, Techmeme summary) or in a transcript. Cite the page you opened. Write "reported by <original outlet>" if needed.
- **Review sites that do not render**: use the rating and review count shown in search results, and label the section "thin data".

### United States

- **SEC EDGAR**: 10-K (annual), 10-Q (quarterly), 8-K (material events: layoffs, exec exits, restructuring), S-1 (IPO), Form D (private raises).
- **WARN notices**: state labor department WARN lists (CA, NY, TX, WA, etc.) or WARNTracker.com.
- **News**: Reuters, CNBC, Fast Company, TechCrunch, The Verge, Business Insider. Bloomberg, WSJ and The Information are often paywalled; see fallbacks.

### Malaysia

- **Bursa Malaysia** company announcements (bursamalaysia.com) for listed companies: quarterly reports, annual reports, board changes.
- **Private companies** often publish results only in their own newsroom. Cross-check with TNGlobal, The Star or NST.
- **News**: The Edge Malaysia, The Star Business, New Straits Times, Free Malaysia Today, Malay Mail, BusinessToday, Digital News Asia.
- **Startups and tech**: TNGlobal (TechNode Global), e27, Tech in Asia, DealStreetAsia, Vulcan Post, KrASIA.
- **Autos, gadgets, consumer tech**: Paultan, Lowyat.NET, SoyaCincau.
- **Culture**: Glassdoor, JobStreet company reviews, Indeed Malaysia.

### Singapore

- **SGX** announcements (sgx.com) for listed companies.
- **News**: The Business Times, The Straits Times, CNA, DealStreetAsia, Tech in Asia, e27, TNGlobal.

### China and Hong Kong

- **Exchanges**: HKEX news (hkexnews.hk), SSE, SZSE; for US-listed Chinese companies, SEC 20-F and 6-K.
- **News**: Caixin, SCMP, 36Kr, LatePost, Reuters China, KrASIA.

### Other Southeast Asia

- **Indonesia**: IDX announcements; Kontan, Bisnis Indonesia, DealStreetAsia.
- **Philippines / Thailand / Vietnam**: PSE, SET, HOSE announcements; Rappler, Bangkok Post, VnExpress International; Tech in Asia.

### Search patterns that work

- `"<company>" layoffs OR retrenchment OR "job cuts" OR restructuring <year>` (Malaysian and Singaporean press often say "retrenchment")
- `"<company>" funding OR raises OR "Series" <year>`
- `"<company>" CEO OR CFO OR CPO OR "steps down" OR appoints <year>`
- `"<company>" results OR earnings OR EBITDA <year>`
- `"<company>" earnings call transcript <quarter> <year>`
- `"<company>" <team or product area> <year>` (for role context)
- `site:<company domain> blog OR newsroom OR press`
