# MCP Prompt Optimizer

> An MCP server that automatically analyzes and optimizes AI prompts using the OTA (Optimize-Then-Answer) Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io/)

## 🎯 What It Does

This MCP server provides an `optimize_prompt` tool that:

- **📊 Analyzes prompts** - Calculates clarity score (0-100%) and identifies domain
- **🔍 Detects risks** - Flags security, privacy, policy, safety, and compliance concerns
- **❓ Asks smart questions** - Generates 1-3 targeted questions when clarity < 60%
- **✨ Enhances prompts** - Adds domain-specific requirements (tests for code, accessibility for UX, etc.)
- **📋 Provides structure** - Returns optimized prompts ready for AI processing

## 🚀 Quick Start

### Installation

**For Claude Code:**

```bash
# Clone the repository
git clone https://github.com/grandinh/mcp-prompt-optimizer.git
cd mcp-prompt-optimizer

# Install dependencies
npm install

# Build
npm run build
```

**Add to `.mcp.json`:**

```json
{
  "mcpServers": {
    "prompt-optimizer": {
      "command": "node",
      "args": ["/path/to/mcp-prompt-optimizer/dist/index.js"],
      "description": "Optimizes prompts using the OTA Framework"
    }
  }
}
```

**Restart your MCP client** (Claude Code, Cursor, etc.)

### Usage

**Option 1: Use the MCP tool directly**

Once installed, use the `optimize_prompt` tool:

```
Use the optimize_prompt tool to analyze: "build a dashboard"
```

**Option 2: Use the `/ori` slash command (Claude Code)**

The `/ori` (Optimize-Research-Implement) command provides an autonomous workflow:

```bash
/ori add JWT authentication to the Express API
```

This will:
1. **Research** - Automatically search docs, best practices, and your codebase
2. **Verify** - Cross-validate findings and check for risks
3. **Implement** - Apply changes with error handling
4. **Document** - Update README, CHANGELOG, and other docs

See [/ori command documentation](.claude/commands/ori.md) for details.

**Output:**
```
[OPTIMIZED] Domain: code | Clarity: 30% | Risks: none

⚠️ Clarification Needed (Clarity: 30%)

Please answer these questions before I proceed:
1. What programming language or framework are you using?
2. What specific features or components are you building?
3. Do you need tests, validation, or specific security considerations?
```

After answering:

```
Use optimize_prompt tool: "build a React dashboard with user analytics,
chart visualizations using Chart.js, and real-time data updates.
Need responsive design and accessibility compliance."
```

**Output:**
```
[OPTIMIZED] Domain: code | Clarity: 85% | Risks: none

✓ Ready to Process (Clarity: 85%)

[Shows enhanced prompt with code-specific requirements including
security, testing, accessibility, and structured output format]
```

## 📊 Features

### Domain Detection

Automatically identifies the domain of your request:

- **code** - Programming, APIs, debugging
- **UX** - UI design, interfaces, accessibility
- **data** - Analytics, statistics, calculations
- **writing** - Content, documentation, articles
- **research** - Studies, investigations, analysis
- **finance** - ROI, budgets, pricing
- **product** - Features, roadmaps, strategy

### Clarity Scoring

Calculates a 0-1 clarity score based on:

| Factor | Weight | Measures |
|--------|--------|----------|
| Goal clarity | 30% | Is objective explicit and measurable? |
| Context completeness | 25% | Are inputs/constraints provided? |
| Format specification | 15% | Is output format defined? |
| Success criteria | 20% | Are acceptance criteria stated? |
| Technical detail | 10% | Stack, versions, specifics included? |

### Risk Detection

Flags potential concerns:

- **security** - auth, passwords, tokens, vulnerabilities
- **privacy** - PII, email, phone, GDPR
- **policy** - fake, bypass, illegal activities
- **safety** - harm, dangerous content
- **compliance** - medical/legal/financial advice

### Smart Questions

When clarity < 60%, generates targeted questions:

**Code domain:**
- What programming language or framework?
- What specific feature/component?
- Testing/security needs?

**UX domain:**
- Who are the target users?
- What platform (web/mobile)?

**Data domain:**
- What's the data structure?
- What specific metrics?

### Domain-Specific Enhancement

Adds requirements based on domain:

**Code:**
```
- Include code summary and complexity notes
- Add security considerations
- Provide test plan and example I/O
- Include error handling
```

**UX:**
```
- Evaluate against usability heuristics
- Include accessibility checklist (WCAG 2.1 AA)
- Consider mobile responsiveness
- Address error and loading states
```

**Data:**
```
- Describe dataset shape and structure
- Show calculation steps explicitly
- Validate data and identify edge cases
- Make results reproducible
```

## 📖 Examples

### Example 1: Vague Request

**Input:**
```
optimize_prompt: "help me with my app"
```

**Output:**
```
[OPTIMIZED] Domain: code | Clarity: 25% | Risks: none

⚠️ Clarification Needed

1. What programming language or framework are you using?
2. What specific feature or component are you building?
```

### Example 2: Clear Request with Security

**Input:**
```
optimize_prompt: "Create a REST API for user authentication in Express.js.
Need endpoints for register, login, logout. Use JWT tokens with refresh
token rotation. Store passwords with bcrypt."
```

**Output:**
```
[OPTIMIZED] Domain: code | Clarity: 90% | Risks: security

✓ Ready to Process

**Domain:** code

**Requirements:**
- Include code summary and complexity notes
- **CRITICAL:** Address security concerns (auth, validation, token storage)
- Provide test plan and example I/O
- Include error handling

**Risk Flags:** security
Please address these concerns in your response.
```

### Example 3: UX Request

**Input:**
```
optimize_prompt: "Review my checkout flow for usability issues"
```

**Output:**
```
[OPTIMIZED] Domain: UX | Clarity: 70% | Risks: none

✓ Ready to Process

**Requirements:**
- Evaluate against usability heuristics
- Include accessibility checklist (WCAG 2.1 AA)
- Consider mobile responsiveness
- Address error and loading states
```

## 🔧 Configuration

### Adjust Clarity Threshold

Edit `src/index.ts`:

```typescript
const needsClarification = clarityScore < 0.6; // Change to 0.7 for stricter
```

### Change Question Limit

In `generateQuestions()`:

```typescript
return questions.slice(0, 3); // Change to 2 for fewer questions
```

### Add Custom Domain

Add to `detectDomain()`:

```typescript
if (/(your|custom|keywords)/i.test(prompt)) {
  return 'your_domain';
}
```

Then add handling in `generateQuestions()` and `createOptimizedPrompt()`.

## 🏗️ Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Project Structure

```
mcp-prompt-optimizer/
├── src/
│   └── index.ts          # Main server code
├── dist/                 # Built output (git-ignored)
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
└── .gitignore
```

## 🎓 How It Works

### The OTA (Optimize-Then-Answer) Loop

```
1. Parse & Classify
   ├── Detect domain
   ├── Calculate clarity score
   └── Identify risk flags

2. Generate Questions (if clarity < 60%)
   └── Max 3 targeted questions

3. Create Optimized Prompt
   ├── Add domain-specific requirements
   ├── Include risk warnings
   └── Specify output format

4. Return Analysis
   ├── Optimization header
   ├── Questions (if needed)
   └── Enhanced prompt (if ready)
```

### Keyword-Based Detection

The server uses keyword matching for:
- **Domain classification** - Fast, deterministic
- **Clarity scoring** - Heuristic-based
- **Risk detection** - Pattern matching

**Note:** This is intentionally simple and fast. No ML models, no API calls, works offline.

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] ML-based domain classification
- [ ] Multi-language support
- [ ] Learning from user feedback
- [ ] Integration with custom knowledge bases
- [ ] Automatic prompt rewriting (not just enhancement)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Related

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Optimized Prompts Framework Documentation](https://github.com/grandinh/mcp-prompt-optimizer/blob/main/docs/framework.md) *(coming soon)*

## ⭐ Support

If this tool helps you get better AI responses, give it a star!

## 📝 Changelog

### v1.1.0 (2025-11-08)

- Added `/ori` slash command for autonomous research-implement workflow
- Integrated OODA framework with OTA Loop in optimized_prompts.md
- Added automatic web search and documentation research
- Implemented error handling and rollback mechanisms
- Added automatic documentation updates (README, CHANGELOG)
- Created configurable workflow via `.claude/ori-config.json`

### v1.0.0 (2025-11-08)

- Initial release
- Domain detection (7 domains)
- Clarity scoring (0-1 scale)
- Risk detection (5 categories)
- Smart question generation (max 3)
- Domain-specific prompt enhancement

---

**Made with ❤️ for better AI interactions**
