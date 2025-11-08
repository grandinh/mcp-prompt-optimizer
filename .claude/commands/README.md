# Custom Slash Commands

This directory contains custom Claude Code slash commands for the MCP Prompt Optimizer project.

## Available Commands

### `/ori` - Optimize Research Implement

**Purpose:** Autonomous workflow for researching, validating, and implementing changes with minimal user input.

**Usage:**
```bash
/ori <your request>
```

**Examples:**
```bash
# Add a new feature
/ori add JWT authentication to the Express API

# Fix a bug
/ori fix the memory leak in the data processing pipeline

# Optimize performance
/ori optimize database queries for the user dashboard

# Research and implement best practices
/ori add rate limiting to all API endpoints using industry standards
```

**What it does:**
1. **Phase 1: Research** - Automatically searches web, docs, and codebase
2. **Phase 2: Verify** - Cross-validates findings and checks for risks
3. **Phase 3: Implement** - Applies changes with error handling
4. **Phase 4: Document** - Updates README, CHANGELOG, and other docs

**Configuration:**
Edit `.claude/ori-config.json` to customize behavior:
- Auto-approve low-risk changes
- Research depth and source count
- Documentation update preferences
- Error handling settings

**Full Documentation:** See [ori.md](ori.md)

---

## Creating Custom Commands

To create a new slash command:

1. Create a new `.md` file in this directory: `.claude/commands/your-command.md`
2. Write the command specification/prompt
3. Use the command: `/your-command <args>`

**Example:**
```bash
# Create .claude/commands/test.md with content:
# "Run all tests in the project and report results"

# Then use it:
/test
```

---

## Command Best Practices

1. **Be specific** - Clear commands get better results
2. **Provide context** - Include tech stack, constraints when relevant
3. **Review output** - Check implementation before committing
4. **Use config** - Customize behavior via config files
5. **Iterate** - Refine commands based on results

---

**Last updated:** 2025-11-08
