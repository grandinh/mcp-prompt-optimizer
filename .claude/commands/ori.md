# Optimize Research Implement (ORI) Workflow

**Version:** 1.0
**Purpose:** Autonomous three-phase workflow for researching, validating, and implementing changes with minimal user input.

---

## Workflow Overview

Execute the following phases sequentially with built-in error handling and validation:

```
PHASE 1: RESEARCH → PHASE 2: VERIFY → PHASE 3: IMPLEMENT → PHASE 4: DOCUMENT
```

---

## Phase 1: Deep Research (OBSERVE & ORIENT)

### Objective
Gather comprehensive, accurate information using all available tools and sources.

### Instructions

1. **Load Framework Context**
   - Read and parse `/Users/grandinharrison/prompts/optimized_prompts.md`
   - Apply OTA+OODA Loop principles to the user's request
   - Calculate clarity_score and identify domain

2. **Execute Multi-Source Research**
   - Use WebSearch tool for current information (auto-approved)
   - Use WebFetch for documentation and official sources
   - Use Grep/Glob to search local codebase for relevant patterns
   - Use Read tool to examine existing implementations
   - Cross-reference at least 3 sources for critical facts

3. **Research Scope**
   - Technical specifications and best practices
   - Security considerations and vulnerabilities
   - Performance implications
   - Edge cases and error scenarios
   - Related dependencies and breaking changes

4. **Output Format**
   Create internal research summary (not shown to user):
   ```json
   {
     "findings": ["key fact 1", "key fact 2"],
     "sources": ["source 1", "source 2"],
     "confidence": "high|medium|low",
     "risks": ["risk 1", "risk 2"],
     "implementation_approach": "summary"
   }
   ```

---

## Phase 2: Verification & Optimization (DECIDE)

### Objective
Validate research accuracy, eliminate drift, and optimize for token efficiency.

### Instructions

1. **Cross-Validation Checklist**
   - [ ] All facts verified against multiple sources
   - [ ] No conflicting information found
   - [ ] Security implications assessed
   - [ ] Performance impact evaluated
   - [ ] Breaking changes identified

2. **Accuracy Review**
   - Compare findings across sources
   - Flag any inconsistencies for re-research
   - If confidence < high: perform additional research
   - Verify version numbers, API signatures, and syntax

3. **Optimize for Conciseness**
   - Remove redundant information
   - Consolidate similar findings
   - Prioritize high-impact insights
   - Keep only actionable details
   - Target: <500 tokens for research summary

4. **Risk Assessment**
   - Security: auth, data exposure, injection risks
   - Safety: breaking changes, data loss potential
   - Compliance: license compatibility, policy adherence
   - If high-risk: require user confirmation before Phase 3

5. **Decision Matrix**
   ```
   IF confidence = high AND risk = low:
     → Proceed to Phase 3 automatically

   IF confidence = high AND risk = medium:
     → Show user 1 yes/no confirmation with risk summary

   IF confidence < high OR risk = high:
     → Show user findings and ask for guidance
   ```

---

## Phase 3: Implementation (ACT)

### Objective
Execute changes with comprehensive error handling and minimal user input.

### Instructions

1. **Pre-Implementation Safety Checks**
   - Verify file paths exist and are writable
   - Check for git repository (offer to initialize if missing)
   - Backup critical files if modifications are destructive
   - Validate syntax before writing files

2. **Implementation Strategy**
   Based on domain from Phase 1, apply appropriate template:

   **For Code Changes:**
   - Use Edit tool for modifications (preserves history)
   - Use Write tool only for new files
   - Include error handling in all new code
   - Add inline comments for non-obvious logic
   - Follow existing code style patterns

   **For Configuration Changes:**
   - Validate JSON/YAML/TOML syntax before writing
   - Preserve existing settings not being modified
   - Add comments explaining changes
   - Keep backup of original config

   **For Documentation Changes:**
   - Update README, CHANGELOG, package.json as needed
   - Maintain consistent formatting
   - Update version numbers if applicable
   - Add examples for new features

3. **Error Handling Protocol**
   ```
   TRY:
     Execute implementation steps

   CATCH FileNotFoundError:
     - Create parent directories
     - Retry operation
     - If still fails: inform user and suggest manual path

   CATCH PermissionError:
     - Inform user of permission issue
     - Suggest: chmod command or manual edit

   CATCH SyntaxError (for code):
     - Show error details
     - Offer corrected version
     - Do not write invalid code

   CATCH ValidationError (for config):
     - Show validation error
     - Revert to last valid state
     - Ask user for clarification
   ```

4. **Rollback Mechanism**
   - If any step fails after 2 retries:
     - Halt implementation
     - Revert any partial changes
     - Present findings to user with error details
     - Offer manual implementation guidance

5. **Execution Sequence**
   For each file to be created/modified:
   - a) Validate operation is safe
   - b) Perform operation with error handling
   - c) Verify operation succeeded
   - d) Log success or failure
   - e) Continue to next file

---

## Phase 4: Documentation Updates (FINALIZE)

### Objective
Ensure all project documentation reflects the changes made.

### Instructions

1. **Identify Documentation Files**
   - Check for: README.md, CHANGELOG.md, docs/, package.json, tsconfig.json
   - Use Glob to find all .md files in project root
   - Identify any project-specific doc patterns

2. **Update Checklist**
   - [ ] README.md: Add new features/commands to usage section
   - [ ] CHANGELOG.md: Add entry with date, version, and changes
   - [ ] package.json: Bump version if applicable (semantic versioning)
   - [ ] Code comments: Ensure inline docs are complete
   - [ ] Examples: Add usage examples for new functionality
   - [ ] Tests: Note if tests need updating (don't write tests unless requested)

3. **Documentation Standards**
   - Use consistent markdown formatting
   - Include code blocks with syntax highlighting
   - Add links to related sections
   - Keep language clear and concise
   - Follow existing documentation style

4. **Verification**
   - Ensure all links work
   - Verify code examples are syntactically correct
   - Check that version numbers are consistent across files

---

## Integration with OTA+OODA Framework

### Mapping to Framework Steps

**OBSERVE (Phase 1: Research)**
- Parse user query components
- Extract key elements
- Flag ambiguities
- Compute clarity_score

**ORIENT (Phase 1: Research)**
- Classify domain
- Assess complexity
- Identify safety/policy concerns
- Determine research scope

**DECIDE (Phase 2: Verify)**
- Choose implementation path
- Select appropriate templates
- Generate risk assessment
- Determine if user confirmation needed

**ACT (Phase 3: Implement)**
- Internal prompt rewriting
- Apply domain-specific enhancements
- Execute with error handling
- Follow Plan of Attack

**OUTPUT (Phase 4: Document)**
- Deliver primary changes
- Update documentation
- List assumptions made
- Provide next steps

---

## Output Format

Present results to user in this structure:

```markdown
## [OPTIMIZED] [Brief description of what was accomplished]

### Research Summary
- [Key finding 1]
- [Key finding 2]
- [Key finding 3]

### Changes Implemented
1. **[File/Component 1]**: [Description of change]
2. **[File/Component 2]**: [Description of change]
3. **[Documentation]**: [What was updated]

### Verification
- [x] Research validated across multiple sources
- [x] Security considerations addressed
- [x] Error handling implemented
- [x] Documentation updated

---

**Assumptions:**
1. [Assumption 1 if any]
2. [Assumption 2 if any]

**Next Steps:**
1. [Action user should take, if any]
2. [Testing recommendation]
3. [Verification command to run]

**Sources:**
- [Source 1]
- [Source 2]
```

---

## Usage Examples

### Example 1: Research and implement a new feature
```
User: /ori add JWT authentication to the Express API
```

**What happens:**
1. Research: JWT best practices, Express middleware patterns, security considerations
2. Verify: Check findings against OWASP, official Express docs, validate approach
3. Implement: Create auth middleware, add to routes, handle errors
4. Document: Update README with auth setup, add to CHANGELOG, update package.json

### Example 2: Investigate and fix a bug
```
User: /ori fix the memory leak in the data processing pipeline
```

**What happens:**
1. Research: Common Node.js memory leak patterns, profiling techniques, best practices
2. Verify: Cross-check against official docs, validate diagnostic approach
3. Implement: Apply fixes with proper cleanup, add error handling
4. Document: Note the fix in CHANGELOG, add comments explaining the solution

### Example 3: Optimize performance
```
User: /ori optimize database queries for the user dashboard
```

**What happens:**
1. Research: SQL optimization techniques, indexing strategies, caching patterns
2. Verify: Validate query improvements, check for side effects
3. Implement: Refactor queries, add indexes, implement caching
4. Document: Update docs with performance notes, add to CHANGELOG

---

## Configuration (Optional)

Users can customize behavior by creating `.claude/ori-config.json`:

```json
{
  "auto_approve_low_risk": true,
  "research_depth": "thorough",
  "max_sources": 5,
  "require_confirmation_for": ["breaking_changes", "external_api_calls"],
  "documentation_updates": {
    "auto_update_readme": true,
    "auto_update_changelog": true,
    "auto_bump_version": false
  },
  "error_handling": {
    "max_retries": 2,
    "rollback_on_failure": true
  }
}
```

---

## Error Messages

### Common Issues and Solutions

**Issue: "Insufficient information to proceed"**
- Solution: Command will ask 1-3 targeted questions
- Example: "Which authentication library should I use: Passport.js, jsonwebtoken, or Auth0?"

**Issue: "High-risk change detected"**
- Solution: Command pauses and shows risk summary
- User confirms with yes/no before proceeding

**Issue: "Research confidence too low"**
- Solution: Command presents findings and asks for user guidance
- Recommendation: User provides additional context or approves research

**Issue: "Implementation failed"**
- Solution: Rollback attempted, present error details and manual steps
- Fallback: Show what would have been done, let user do it manually

---

## Best Practices

1. **Be Specific in Requests**
   - Good: `/ori add rate limiting to the API using express-rate-limit`
   - Poor: `/ori make API better`

2. **Trust the Research Phase**
   - Command will automatically search web, docs, and codebase
   - No need to provide links unless you want a specific source prioritized

3. **Review High-Risk Changes**
   - Breaking changes will always require confirmation
   - Security-related changes will show risk assessment

4. **Verify After Implementation**
   - Run tests if available
   - Check that documentation matches implementation
   - Review git diff before committing

---

## Limitations

- Cannot execute interactive tools (rebase -i, add -i)
- Cannot install packages (but will suggest npm/pip commands)
- Cannot run tests (but will suggest test commands)
- Cannot access external APIs without user approval (except web search/fetch)
- Cannot modify files outside the current project directory

---

## Feedback and Improvements

This workflow is designed to be iterative. Suggestions for improvement:
- Adjust research depth based on complexity
- Cache research findings for similar requests
- Learn from user corrections and preferences
- Build domain-specific research templates
- Track success rate and optimize accordingly

---

**End of /ori command specification**
