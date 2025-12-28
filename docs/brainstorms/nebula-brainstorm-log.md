# Nebula Brainstorm Log

> Append-only. We fix forward, not back.

---

## Pins (Living List)

1. Workflow engine: simple state machine + postgres queues vs Temporal vs Convex workflows?
2. Pins/parking lot feature for deferred decisions
3. Steering AI mid-execution
4. Flat missions with optional grouping
5. Custom prompts + project rules + language rules
6. Code review + git provider integration + diffs UI
7. Ticket → Mission quick transition
8. Nice ticket IDs (`NBLA-123`)
9. AI personality
10. Split view
11. `NEBULA.md` repo config (like CLAUDE.md/AGENTS.md)
12. Built-in observability - metrics, traces, event drill-down ("what happened and why")
13. Terminal experience in UI - but clickable/interactive
14. Verbose/debug mode toggle for chat view
15. Data storage: git-native vs centralized? (privacy concern - can't send customer code to servers)
16. MCP for tool extensibility, AI abstraction, integrations
17. Memory/context persistence across sessions (still figuring out approach)
18. Rollback: git worktrees + commits enough? Show "committing" in chat with "roll back to" option
19. Fork this conversation feature
20. Multiple AI providers + BYOK (bring your own key) + Claude Max OAuth integration
21. Notifications system design
22. Per-repo validation config (lint, test, type-check instructions)
23. Prompt injection prevention + handling super large data
24. AI-assisted search (not just full-text)
25. Decision log as a pattern - brainstorm conversations become append-only logs with pins, decisions, refinements visible
26. Nebula exposes its own MCP server - AI can create tickets, add pins, update missions, log decisions, etc. Same primitives for UI and AI.
27. Expand MCP to include project and repo management (add repos, configure projects, etc.)
28. Model tickets as workflows too - get state transitions for free (backlog → in progress → blocked → done, etc.)
29. Provider/model selection - set per repo/project, configure providers globally, pick models for different contexts (brainstorm vs execute)
30. Terminology: not "cockpit" - prefer HUD or something cooler for the dashboard
31. Rules + Skills system:
    - Rules = guidelines (e.g. "Python uses Black, UV, these patterns")
    - Skills = procedural instructions AI follows for specific tasks
    - Rules can trigger skills (e.g. "when creating .py file, use writing-python-code skill")
    - User-editable: create custom rules, edit defaults, layer on top
    - We provide sensible defaults per language
32. Commands - how to invoke things (slash commands? natural language? pin for later)
33. Projects/missions interacting with each other - dependencies, shared context, references between work items
34. Subagents - spawn sub-agents for parallel work or specialized tasks
35. Code review step as workflow - read GitHub comments, auto-generate MR/PR, respond to feedback, iterate
36. Context counter - show tokens used, context window remaining, warn when approaching limits
37. In-app code review instead of/before GitHub - annotate diffs directly, AI sees comments immediately, faster iteration loop (connects to original annotation system!)
38. Learnings system - AI saves mistakes (wrong commands, etc.) as learnings, time-decayed so they fade if not useful, self-improving context
39. Tool visibility - show what tools/capabilities the AI has access to, inspect available tools
40. Evaluate local AI models - how good are local models (Ollama, llama.cpp, etc.) for this workflow?
41. Infrastructure decision (tentative): Keep simple - cloud hosted by us, local app connects to server, Docker compose/swarm for self-hosting, "run your own" option for enterprises. Decide details later.
42. Orgs - organizational hierarchy, invite users to orgs
43. Repo invites - invite people to specific repos, collaboration
44. Permissions - access control (who can see/edit what)
45. Marketing website - need one
46. Dogfooding - use Nebula to build Nebula once it works
47. Example projects - for demos, onboarding, showcasing
48. Auth - login system, consider Authentik or similar (self-hosted identity provider, don't build auth from scratch)
49. Naming: "Missions" and "Pins" need better names - revisit
50. Approval gates at every phase - approve, reject with feedback (AI iterates), or "not now" → ticket
51. **IMPORTANT: UI/UX vision needs proper exploration** - current description doesn't capture user's vision
52. Phase naming: Brainstorm → Design → Plan → Execute (drop "Doc" from names, cleaner)
53. GitHub/GitLab integration is LOW priority - in-app reviews are the focus, simpler
54. Team model needs more thought - capture vision but revisit the specifics
55. Parallel exploration / fork sessions - "do A and B in separate forks", view both, compare, maybe merge? Naming: "Expeditions"? Concepts should flow nicely with Mission theme
56. Caching strategy - cache generated overviews, summaries, analysis. But: invalidation when files change? What can/can't be cached? Classic hard problem.
57. Architecture: design for forkability - if "session" (context + conversation + state) is the atomic unit, parallel expeditions come free later. Component modularity matters.
58. UI clarification: Terminal-y aesthetic but mouse AND keyboard work. Chat is main interaction, other views available. Not keyboard-only.
59. Execution modes:
    - Step-by-step (pause after each step, review, continue)
    - Batch (execute N steps, then pause)
    - Full auto (execute whole plan, no pauses)
    - Need to design the review/continue flow
60. Full autonomy mode - "build me a website" and AI just goes, makes all decisions. Food for thought for later.
61. Logo: Galaxy/nebula in pixel art OR white outline on black background
62. Animations: Cool stuff like spinning nebula, ASCII art animations. Fun polish for later.
63. Review queue / inbox - "work for the human". When AI needs review, it shows up in your queue. Like GitHub PR assignments. You're "assigned" to review docs, plans, diffs. Personal task queue of stuff waiting for you.
64. Data leaks / security - think through how to prevent sensitive data escaping (code in conversations, secrets, API keys, etc.)
65. Inbox complexity - when does review go to inbox vs stay in chat? Don't want a junk drawer. Need to organize. Central place for "what needs me" but multiple ways to respond:
    - Approve/comment in chat
    - Go to UI, annotate directly
    - All paths sync up
66. Document format - Markdown vs XML vs custom?
    - XML might be better: custom components for comments, annotations with start/end positions
    - Can define our own tags
    - Maybe XML for system prompts too
    - Need to think through schema
67. Inbox scopes - per project? per repo? per user? Different levels of inbox.
68. Assign others to review - teammates can be assigned to review docs (like GitHub reviewers)
69. Comments with user attribution - who said what, tracked
70. AI as reviewer - AI can leave its own comments during review step. AI comments alongside human comments.
71. Interactive comment resolution:
    - User writes: "I don't understand this section"
    - Button next to comment: "Ask AI" / "Get AI response"
    - AI responds to that specific comment
    - AI could edit document inline to fix
    - Or AI replies in the comment thread
72. Review workflow options:
    - One by one: handle each comment interactively
    - Batch: collect all comments, send one big review to AI, AI addresses all at once
73. Doc-level vs inline comments - different granularities of feedback
74. Docs = document SETS, not single files:
    - Single docs can get huge (1000s of lines) - bad for AI context
    - Better: master doc + subdocs, or folder of related docs
    - Flexible: single doc OR many docs in folders
    - Reviewing = reviewing whole change set (like a PR, not one file)
75. Need a name for "the thing being reviewed" - like PR but for design/plan artifacts. Brainstorm this. Working name: "Doc Review" (but supports multiple docs/files). Maybe Manifest, Payload, Brief... TBD.
76. Image support in chat - paste/upload images, AI can see them (mockups, screenshots, errors, diagrams, etc.)
77. UI inspiration: Look at Spotify UI - something a little different, modern, distinctive
78. UI direction: macOS-style native app feel vs TUI? Explore what we could do with native-feeling UI
79. Achievements / gamification? Could be fun to reward milestones, streaks, missions completed, etc.
80. Swappable themes?! User picks their vibe: Space, Heist, Alchemy, Workshop, Ocean, etc. Terminology changes with theme. Hilarious and fun personalization.
81. Onboarding flow - AI walks you through setup (first-time app setup, new project setup, connecting repos, configuring rules, etc.). Guided experience.
82. Use localization/i18n system for themes! Same infrastructure that handles en/es/fr can handle space/heist/alchemy. One system, two purposes. Clever reuse. Discord has "Pirate English" as precedent - joke locales in i18n.
83. Custom component library - design in Figma first, prototype, then build components. Own the design system.
84. AI co-workers / team members for review stages - different personas with specialties:
    - "Arthur works in security" - reviews for vulnerabilities
    - "Josie is QA" - catches edge cases, test coverage
    - "Max is the Python expert but doesn't know frontend"
    - Army of specialized reviewers you can invoke
    - Each has personality + expertise + blind spots
    - Could participate in design review, code review, planning
85. Better AskUserQuestion in chat - nice UI for multiple choice questions, decision points, options with descriptions. Built into chat experience, not a separate modal. Clickable, styled, feels native.
86. Look into RAG - retrieval augmented generation for codebase context, memories, past conversations, documentation search, etc.

---

## Log

### Entry 1: The Pivot

Starting point: Sidenote was a markdown note-taking app with annotations. Pivoting to a "coder assistant" tool. Keeping the foundations (Tauri, React, Zustand, the UI design, even the name potentially).

Core idea from user's scratch pad:
- **Repos** as top-level concept
- Work happens via **projects** or **tasks**
- Projects have phases: brainstorming → design doc → review/approve → plan doc → execution
- Tasks are lighter weight (skip brainstorming, quick fixes)
- Design docs go to a review place with annotations, comments, approval
- Plan docs break down everything AI needs to do
- AI works in its own **git worktree**
- Part task manager, part JIRA
- Backend-agnostic for AI providers

Pain points driving this:
- Viewing changes that are going to happen is hard
- Claude Code is hard to use sometimes
- Want a nice UI for this workflow
- Worktree setup is painful

### Entry 2: Who's This For?

Decision: **Solo developers first, teams later**. Nail the solo experience, design data model to be extensible for collaboration.

### Entry 3: Projects vs Tasks Hierarchy

Initial thought: Projects (heavy) vs Tasks (light) as separate concepts.

Reframed: Maybe everything is a "Task" with optional phases you can skip. A "Project" is just a container of related tasks. Cleaner architecturally - one workflow with skippable phases.

### Entry 4: Superpowers Comparison

Looked at how Superpowers plugin works. It follows similar flow:
- brainstorming → design doc
- using-git-worktrees → isolated workspace
- writing-plans → detailed plan doc
- executing-plans → batch execution with review checkpoints
- finishing-a-development-branch → merge/PR/cleanup

Key insight: **Two documents** - design doc (high-level) and plan doc (granular, bite-sized steps with exact code and commands).

User's app would be a **UI for this workflow** + annotation layer for reviewing docs.

### Entry 5: Temporal SDK Question

User noted: The OpenAI/agent Temporal workflow integration library is in Python, not TypeScript. Options:
1. Port the pattern to TypeScript
2. Hybrid Python/TypeScript architecture
3. Build simpler custom solution

Pinned for later.

### Entry 6: Visibility Into AI Work

User wants: Live terminal output like Claude Code, maybe with a cleaner UI layer on top. Fundamentally you see what's happening.

Also pinned: Ability to "steer" the AI mid-execution (interrupt, redirect).

### Entry 7: The Pins Problem

User identified a real pain point: During brainstorming, things come up that need to be deferred but not forgotten. Currently they get lost in chat.

Proposed: Pins/parking lot feature - quick capture during chat, flows into "Open Questions" in design docs, reviewable/annotatable later.

### Entry 8: Repo/Project/Task Hierarchy Revisited

User was unsure about "Projects" - what level should they be?

Options discussed:
1. Repo → Workflows (flat)
2. Repo → Projects → Workflows
3. Repo → Epics → Workflows
4. Workflows with optional grouping

Decision leaning: **Flat workflows with optional grouping**. YAGNI - add hierarchy when you feel the pain.

### Entry 9: Task Tracking / JIRA-lite

Initial thought: Use same system for user-facing task board AND AI's internal todo tracking.

Refined: Actually **two models** are better:
- **Workflow todos** - internal, ephemeral, step-by-step during execution (like TodoWrite)
- **Tickets** - external, persistent, user-level work tracking, can spawn workflows or exist independently

Decided: Call them **Tickets** with nice IDs like `NBLA-123`.

### Entry 10: Custom Prompts and Rules

Pinned ideas:
- Custom system prompts
- Project-level additions (like CLAUDE.md)
- "Rules" for writing code - language defaults, user-generated, AI-assisted creation

### Entry 11: Code Review and Git Integration

Pinned: Self code reviews, GitHub/GitLab linking, diffs shown in UI.

### Entry 12: A Day Using Nebula

User painted the picture:

**Dashboard = cockpit**. The command center. See everything, jump into anything.

**Entry points:**
1. Fuzzy idea → Chat → Brainstorm with AI → Maybe mission, maybe "not now" → ticket for later
2. Concrete plan → Create ticket → Start mission from ticket (or defer)
3. Continue existing work

**Key insight:** Brainstorming can end in "not now" - that's a valid outcome, should feel first-class, not like failure.

### Entry 13: Naming - "Workflow" Sucks

User hates "workflow" and "session" as names.

With space theme (Nebula), landed on **Mission**:
- Missions have phases
- You can abort a mission
- "Mission Control" for dashboard
- Feels natural: "Start a mission for dark mode"

Light theme, not full cosplay. Mission + maybe Command Center, keep Tickets/Repos/Pins grounded.

### Entry 14: AI Personality

Pinned: Give the AI a personality that fits the space/mission theme. Maybe a mission control operator vibe.

### Entry 15: Core UX Principle - Smooth by Default, Deep on Demand

User wants the feeling of everything happening automatically and smoothly. BUT if you need to debug or dive deeper, you can.

**Built-in observability:**
- Metrics (aggregate numbers)
- Traces (individual mission flows)
- Events (detailed logs, "why did this happen")

Not external Grafana - **in the app**. Every level clickable, drill down to understand exactly what happened and why.

### Entry 16: NEBULA.md

Pinned: Repo-level config file like CLAUDE.md or AGENTS.md.

### Entry 17: Multi-Repo Model

Still open question:
1. One app, many repos (hub)
2. One instance per repo (like VS Code)
3. Hybrid

Leaning toward option 1 for the "cockpit" vision.

### Entry 18: Terminal Experience

Pinned: Terminal experience in the UI, but clickable/interactive.

### Entry 19: Verbose/Debug Mode for Chat

The chat view is the surface, but there's stuff happening behind it. Some users want a more verbose mode - see the tool calls, the reasoning, what's happening under the hood. Toggle between "clean" and "verbose" views of the same conversation.

### Entry 20: Data Storage Architecture

Critical question: Where does state live?

Options:
1. **Git-native** - `.nebula/` folder in repo with JSON/YAML. Travels with code. Version controlled.
2. **Local database** - SQLite on user's machine. Private, no server. But no cross-machine sync.
3. **Centralized cloud** - Full sync, dashboard anywhere. But: privacy nightmare, can't send customer code.
4. **Hybrid** - Metadata centralized (ticket titles, status), code/content stays local. References only.
5. **Git + local index** - Store in git, build local index for fast querying.

Privacy concern is real: enterprises won't send code to your servers. Period.

### Entry 21: Convex for Workflows?

Convex may have workflow engine capabilities built in - scheduled functions, durable jobs. If using Convex as backend anyway, might not need separate Temporal/custom solution. Worth investigating.

### Entry 22: MCP Not Yet Discussed

Haven't covered MCP (Model Context Protocol) yet. Could be relevant for:
- Tool extensibility (users add custom MCP servers)
- AI backend abstraction
- External integrations (GitHub, Jira, Slack)

Pinned for later exploration.

### Entry 23: Feedback on Critical Features

User reviewed the 5 suggested critical features via HackMD comments:

1. **Context/Memory** - "not actually sure yet.. pin it"
2. **Rollback** - Git worktrees + commits might be enough. Want to show "committing" in chat with "roll back to" option. Also: "fork this conversation" feature.
3. **Cost Tracking** - Multiple backend providers, BYOK, or Claude Max subscription with OAuth.
4. **Notifications** - "love this, we're doing notifications for sure"
5. **Export** - "don't care too much... won't actively make it hard to leave"
6. **Verification** - Per-repo config for lint/test/type-check. Validation steps. "btw pin: stop prompt injections EVERYWHERE and super large data"
7. **Search** - Full-text AND AI-assisted search

### Entry 24: Decision Log Pattern

Meta-observation: This conversation itself is the pattern. The way we've been working:
- Pins for deferred decisions
- Chronological append-only log
- Decision points with context ("considered X, Y, Z, chose Y because...")
- Refinement visible over time

This should be a core feature. Brainstorm phase produces a decision log automatically. The conversation IS the artifact.

### Entry 25: Nebula as MCP Server

Nebula exposes its own MCP server so the AI can interact with the app programmatically:
- `nebula.createTicket` / `nebula.updateTicket`
- `nebula.addPin` / `nebula.resolvePin`
- `nebula.updateMission`
- `nebula.logDecision`
- `nebula.runValidation`
- `nebula.forkConversation`

Example: "Create tickets for all pins except the last 2" → AI calls createTicket for each.

**Same primitives, two interfaces:** UI for humans, MCP for AI. Both first-class.

### Entry 26: Rules + Skills System

Two distinct concepts that work together:

**Rules** = declarative guidelines
- "Python code uses Black for formatting"
- "We use UV for package management"
- "Follow these naming conventions"
- Editable by users, can layer on defaults

**Skills** = procedural instructions
- Step-by-step processes AI follows
- Like Superpowers skills
- Triggered by rules or invoked directly

**Rules trigger skills:**
- Rule: "When creating .py files, use the writing-python-code skill"
- AI sees it's making a Python file → skill activates

**User control:**
- We provide sensible language defaults
- Users can edit, override, add custom rules
- Users can write their own skills

**Commands** - how to invoke things manually (slash commands? natural language? TBD)

### Entry 27: Settings Brainstorm

Spitballed settings categories:
- **AI/Providers:** accounts, API keys, model selection per context, cost limits
- **Repo-Level:** validation commands, worktree dir, default branch, coding rules, excluded paths
- **Workflow:** default phases, auto-commit frequency, review checkpoints, notification triggers
- **UI/UX:** theme, verbose mode, split view, terminal font, keyboard shortcuts
- **Security:** prompt injection protection, sensitive file patterns, confirm before external calls
- **Integrations:** GitHub/GitLab, Slack/Discord, MCP servers

### Entry 28: Conversation Model - The Big Gap

Identified the core UX question we haven't nailed:
- One conversation per mission or per phase?
- How does context flow between phases?
- Context limits are real - when/how to summarize?
- Resume/continuity - what does AI "remember" after closing app?
- How does messy brainstorm become clean design doc?

Instinct: Each phase is its own conversation, artifact (design doc, plan) carries forward, not raw chat.

### Entry 29: Architecture Deep Dive

Explored options given constraints (privacy, solo-first, multi-repo, git-centric):

**A) Pure Local Desktop** - Tauri + SQLite + Git, AI calls direct to APIs
**B) Git as Backend** - State in `.nebula/` folders, sync = git push/pull
**C) Local + Cloud Metadata** - Metadata syncs (titles, status), code never leaves local
**D) Local Worker + Convex** - Convex for workflows/realtime, local worker does git/AI ops
**E) Web + Local Companion** - Web UI, small local agent for file/git access

**The Convex Problem:** If conversations stored in Convex, AI mentions code, code ends up in cloud. Privacy blown.

**Out-of-box ideas:**
1. iCloud/Dropbox as backend - files in synced folder
2. Dedicated "nebula-data" git repo for all state
3. Local-first CRDTs (Automerge/Yjs) - conflict-free, transport-agnostic
4. P2P sync between own devices
5. Split data model - safe stuff to cloud, sensitive stays local
6. Bring your own Supabase/Firebase
7. "Everything is a conversation" - Claude context as persistence

Favorite combo: Dedicated Nebula repo + split data model. User hasn't revealed their idea yet.

### Entry 30: Learnings System

AI saves mistakes as learnings:
- Wrong command → save as learning with timestamp
- Include in context for next N days
- If keeps preventing mistakes, refresh
- If never referenced, decay and drop

Self-pruning, time-decayed memory. AI improves but doesn't hoard stale context.

### Entry 31: Interview Summary

Ran through major areas with user verification:
- **Core concept**: Confirmed (value prop needs to be broader than just "AI coding")
- **Entities**: Repos, Tickets solid; Missions/Pins need better names
- **Workflow**: Brainstorm → Design → Plan → Execute (drop "Doc" from names)
- **Approval gates**: At every phase - approve, reject with feedback, or "not now"
- **UI/UX**: NEEDS PROPER EXPLORATION - not captured yet
- **AI system**: Confirmed (providers, rules, skills, learnings, steerability)
- **Observability**: Confirmed (metrics, traces, logs, context counter, cost)
- **Git/Code**: Confirmed (worktrees, in-app review, diffs). GitHub integration LOW priority.
- **Teams**: Needs more thought, capture for later
- **Extensibility**: Confirmed (MCP, NEBULA.md, rules/skills)

### Entry 32: Infrastructure Decision (Tentative)

Keep it simple for now:
- Cloud hosted by us
- Local app connects to server
- Docker compose/swarm for self-hosting option
- "Run your own" for enterprises who need it
- Details TBD - don't over-engineer yet

### Entry 33: Parallel Exploration / Expeditions

New concept: fork sessions to explore multiple paths:
- "Do A and B in separate forks"
- View both side by side
- Compare, pick winner, maybe merge learnings
- Naming: "Expeditions" fits space theme
- Architecture: if "session" is atomic unit, parallel comes free

### Entry 34: Execution Modes

Spectrum of control vs autonomy:
- **Step-by-step**: Pause after each step, review, continue
- **Batch**: Execute N steps, then pause for review
- **Full auto**: Execute whole plan, no pauses
- **Full autonomy**: "Build me a website" - AI makes all decisions

Need to design the review/continue flow for all modes.

### Entry 35: Review System Deep Dive

The review system is becoming a major feature:

**Review queue/inbox**: Central place for "work waiting on human"
- Like GitHub PR assignments
- Scopes: per user? per project? per repo?
- Multiple ways to respond (chat, UI annotation, etc.)
- All paths sync up

**Assign others**: Teammates can be assigned to review (like GitHub reviewers)

**AI as reviewer**: AI can leave its own comments alongside humans
- AI reviews the doc, leaves comments
- Human can respond to AI comments
- AI can respond to human comments

**Interactive comments**:
- User: "I don't understand this"
- Button: [Ask AI]
- AI explains or fixes inline
- Or: batch all comments, send one big review

**Doc Review = document SETS**:
- Single docs get huge (bad for AI context)
- Better: master doc + subdocs
- Reviewing = reviewing whole change set (like PR)
- Working name: "Doc Review" - real name TBD (Manifest? Payload? Brief?)

### Entry 36: Document Format

Considering format for design/plan docs:
- Markdown: simple but limited
- XML: custom components for comments, annotations with start/end positions
- Can define our own tags
- Maybe use XML for system prompts too
- Need to think through schema

### Entry 37: Branding & Polish

- **Logo**: Galaxy/nebula in pixel art OR white outline on black
- **Animations**: Spinning nebula, ASCII art, etc. Fun polish.
- **UI**: Terminal-y aesthetic but mouse AND keyboard work. Not keyboard-only.

### Entry 38: Image Support

Support images in chat - paste/upload:
- Mockups
- Screenshots
- Error images
- Diagrams
- Reference designs

### Entry 39: Session Wrap-Up Notes (For Future Claude)

**What is Nebula?**
A developer HUD/cockpit for AI-assisted coding. Pivoting from the original Sidenote markdown annotation app - keeping the Tauri/React/Zustand foundation.

**The Core Workflow:**
Brainstorm → Design → Plan → Execute (phases skippable, each has approval gates)

**Key Entities:**
- **Repos** - codebases you work on
- **Tickets** - JIRA-lite with IDs like `NBLA-123`
- **Missions** (name TBD) - the workflow cycle
- **Pins** (name TBD) - deferred decisions captured during brainstorming

**Big Themes:**
1. **Space theme** - Missions, Expeditions, maybe Payloads/Manifests (but swappable themes via i18n!)
2. **AI as teammate** - Not just a tool. AI co-workers like "Arthur (security)", "Josie (QA)" with personalities
3. **Review system** - Central inbox, AI + human reviewers, interactive comments, doc sets not single files
4. **Terminal-y but accessible** - Mouse AND keyboard, chat-first, Spotify/Warp-inspired UI
5. **Observable** - Metrics, traces, drill-down, context counter, cost tracking
6. **Extensible** - Nebula exposes MCP server, custom rules/skills, NEBULA.md config

**Critical Open Items:**
- Pin 51: UI/UX vision needs proper exploration (not captured yet!)
- Naming: "Missions" and "Pins" need better names
- Architecture: Cloud hosted + local app + Docker self-host option
- Document format: Markdown vs XML for design/plan docs

**User Preferences:**
- Not "cockpit" - prefer HUD or something cooler
- Terminal aesthetic but not keyboard-only
- Wants to design in Figma first, build custom component library
- Loves the i18n-for-themes idea (Discord's Pirate English as precedent)

**86 pins captured.** This log is append-only - we fix forward, not back.

**Next steps when resuming:**
1. Explore the UI/UX vision properly (Pin 51)
2. Naming session for Missions, Pins, the PR-like review thing
3. Start Figma prototyping
4. Look into document format schema

---

## Open Questions

- Multi-repo: hub or per-instance?
- What do phases actually look like in the UI?
- How does the chat interface work during brainstorming?
- What's the data model for missions, tickets, pins?
- How do AI co-workers actually work technically?
- RAG implementation for codebase/memory search?

---
