# Optimize Research Implement (ORI) Workflow

**Version:** 1.1
**Purpose:** Autonomous multi-phase workflow with intelligent model selection for researching, validating, and implementing changes with minimal user input.

---

## Workflow Overview

Execute the following phases sequentially with built-in error handling, validation, and intelligent model selection:

```
PHASE 0: STRATEGY (Opus) → PHASE 1: RESEARCH (Dynamic) → PHASE 2: VERIFY (Sonnet) → PHASE 3: IMPLEMENT (Sonnet/Haiku) → PHASE 4: DOCUMENT (Haiku)
```

---

## Model Selection Strategy

### Per-Phase Model Recommendations

The workflow uses different models optimized for each phase:

| Phase | Recommended Model | Rationale |
|-------|------------------|-----------|
| **Phase 0: Strategy** | **Opus** | Complex reasoning, strategic planning, research design |
| **Phase 1: Research** | **Dynamic** | Opus decides based on complexity; Sonnet for standard, Opus for complex |
| **Phase 2: Verify** | **Sonnet** | Balance of speed and accuracy for validation |
| **Phase 3: Implement** | **Sonnet/Haiku** | Sonnet for complex code, Haiku for simple edits |
| **Phase 4: Document** | **Haiku** | Fast, cost-effective for doc updates |

### When to Use Each Model

**Opus (claude-opus-4):**
- Strategic planning and research design
- Complex multi-step reasoning
- Novel or ambiguous problems
- High-stakes decisions requiring deep analysis
- Architectural decisions

**Sonnet (claude-sonnet-4-5):**
- Most implementation tasks
- Code generation and refactoring
- Validation and verification
- Balanced performance/cost for general tasks

**Haiku (claude-haiku-4):**
- Simple file edits
- Documentation updates
- Formatting and style fixes
- Quick, straightforward tasks

---

## Phase 0: Research Strategy (STRATEGIC PLANNING)

### Objective
Use Opus to create an optimal research strategy and select the best model for execution.

### Model: **Opus** (claude-opus-4)

### Instructions

**IMPORTANT:** This phase MUST use Opus via the Task tool:

```
Use Task tool with model="opus" to execute Phase 0.
```

1. **Analyze User Request**
   - Parse the complexity and scope
   - Identify domain and subdomain
   - Determine novelty (established pattern vs. new problem)
   - Assess information availability (well-documented vs. obscure)

2. **Design Research Strategy**
   Create a structured research plan including:
   - **Primary questions** to answer (ranked by priority)
   - **Information sources** to consult (docs, code, web)
   - **Search queries** to execute (specific keywords/phrases)
   - **Validation criteria** (how to verify findings)
   - **Success metrics** (what constitutes "enough" research)

3. **Select Research Model**
   Determine which model should execute Phase 1:

   ```
   IF task is complex OR novel OR ambiguous:
     → Recommend Opus for Phase 1
     → Reason: "Requires deep analysis and nuanced understanding"

   IF task is standard OR well-documented OR straightforward:
     → Recommend Sonnet for Phase 1
     → Reason: "Efficient for established patterns with good docs"
   ```

4. **Output Format**
   ```json
   {
     "research_strategy": {
       "primary_questions": ["Q1", "Q2", "Q3"],
       "sources": ["official docs", "codebase patterns", "web search"],
       "search_queries": ["query 1", "query 2"],
       "validation_criteria": ["criterion 1", "criterion 2"],
       "estimated_complexity": "low|medium|high"
     },
     "model_recommendation": {
       "phase_1_model": "opus|sonnet",
       "reasoning": "explanation",
       "estimated_tokens": 5000
     },
     "phase_recommendations": {
       "phase_2_model": "sonnet|haiku",
       "phase_3_model": "sonnet|haiku",
       "phase_4_model": "haiku",
       "rationale": "brief explanation"
     }
   }
   ```

5. **Transition to Phase 1**
   - Pass research strategy to selected model
   - Brief the model on context and approach
   - Monitor token usage for optimization

---

## Phase 1: Deep Research (OBSERVE & ORIENT)

### Objective
Gather comprehensive, accurate information using all available tools and sources, following the strategy from Phase 0.

### Model: **Dynamic** (Opus or Sonnet based on Phase 0 recommendation)

### Instructions

**IMPORTANT:** Use the model recommended by Phase 0:

```
If Phase 0 recommended Opus:
  Use Task tool with model="opus" to execute Phase 1

If Phase 0 recommended Sonnet:
  Use Task tool with model="sonnet" to execute Phase 1 (or execute directly if already Sonnet)
```

1. **Load Framework Context**
   - Read and parse `/Users/grandinharrison/prompts/optimized_prompts.md`
   - Apply OTA+OODA Loop principles to the user's request
   - Calculate clarity_score and identify domain
   - **Review Phase 0 strategy** and follow the research plan

2. **Execute Research Strategy from Phase 0**
   - Follow the primary questions identified
   - Use specified information sources in priority order
   - Execute the recommended search queries
   - Apply validation criteria as you gather information

3. **Execute Multi-Source Research**
   - Use WebSearch tool for current information (auto-approved)
   - Use WebFetch for documentation and official sources
   - Use Grep/Glob to search local codebase for relevant patterns
   - Use Read tool to examine existing implementations
   - Cross-reference at least 3 sources for critical facts

4. **Research Scope**
   - Technical specifications and best practices
   - Security considerations and vulnerabilities
   - Performance implications
   - Edge cases and error scenarios
   - Related dependencies and breaking changes

5. **Output Format**
   Create internal research summary (not shown to user):
   ```json
   {
     "findings": ["key fact 1", "key fact 2"],
     "sources": ["source 1", "source 2"],
     "confidence": "high|medium|low",
     "risks": ["risk 1", "risk 2"],
     "implementation_approach": "summary",
     "strategy_adherence": "how well we followed Phase 0 plan"
   }
   ```

---

## Phase 2: Verification & Optimization (DECIDE)

### Objective
Validate research accuracy, eliminate drift, and optimize for token efficiency.

### Model: **Sonnet** (claude-sonnet-4-5)

Sonnet provides the optimal balance of accuracy and speed for validation tasks.

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

### Model: **Sonnet or Haiku** (dynamic based on complexity)

**Selection Criteria:**
- Use **Sonnet** for: Complex code, multi-file changes, architectural modifications
- Use **Haiku** for: Simple edits, single-file changes, documentation-only updates

**Implementation:**
```
If Phase 0 or Phase 2 flagged as complex implementation:
  Use Task tool with model="sonnet"

If straightforward single-file edit or doc update:
  Use model="haiku" (via Task tool or directly)
```

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

### Model: **Haiku** (claude-haiku-4)

Haiku is optimal for fast, cost-effective documentation updates that don't require complex reasoning.

**Use Haiku via:**
```
Use Task tool with model="haiku" for Phase 4 documentation updates
```

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
0. **Strategy (Opus)**: Analyzes JWT + Express auth, determines research strategy, recommends Sonnet for Phase 1
1. **Research (Sonnet)**: JWT best practices, Express middleware patterns, security considerations
2. **Verify (Sonnet)**: Check findings against OWASP, official Express docs, validate approach
3. **Implement (Sonnet)**: Create auth middleware, add to routes, handle errors (complex multi-file)
4. **Document (Haiku)**: Update README with auth setup, add to CHANGELOG, update package.json

### Example 2: Investigate and fix a bug
```
User: /ori fix the memory leak in the data processing pipeline
```

**What happens:**
0. **Strategy (Opus)**: Complex debugging, recommends Opus for deep investigation in Phase 1
1. **Research (Opus)**: Deep analysis of memory leak patterns, profiling techniques, root cause investigation
2. **Verify (Sonnet)**: Cross-check findings, validate diagnostic approach
3. **Implement (Sonnet)**: Apply fixes with proper cleanup, add error handling
4. **Document (Haiku)**: Note the fix in CHANGELOG, add comments explaining the solution

### Example 3: Optimize performance
```
User: /ori optimize database queries for the user dashboard
```

**What happens:**
0. **Strategy (Opus)**: Analyzes query optimization scope, recommends Sonnet (well-documented problem)
1. **Research (Sonnet)**: SQL optimization techniques, indexing strategies, caching patterns
2. **Verify (Sonnet)**: Validate query improvements, check for side effects
3. **Implement (Sonnet)**: Refactor queries, add indexes, implement caching
4. **Document (Haiku)**: Update docs with performance notes, add to CHANGELOG

### Example 4: Simple documentation update
```
User: /ori update the README to include the new config options
```

**What happens:**
0. **Strategy (Opus)**: Simple doc task, recommends Haiku throughout
1. **Research (Haiku)**: Quick scan of config files and existing README
2. **Verify (Sonnet)**: Ensure accuracy and completeness (brief check)
3. **Implement (Haiku)**: Update README with new config options
4. **Document (Haiku)**: Update CHANGELOG entry (single phase)

---

## Multi-Model Benefits

### Why Use Different Models Per Phase?

**Cost Optimization:**
- Opus only for strategic planning (~5% of tokens)
- Haiku for documentation (~20% of tokens at 1/50th the cost)
- Result: **~40% cost reduction** vs. all-Opus

**Speed Optimization:**
- Haiku is 3-5x faster for simple tasks
- Parallel execution possible (doc updates while implementing)
- Overall workflow **~30% faster**

**Quality Optimization:**
- Opus for complex reasoning where it excels
- Sonnet for balanced implementation work
- Each model used in its optimal zone

**Example Cost Comparison (100K token project):**
```
All Opus:     100K tokens × $15/MTok = $1.50
Multi-Model:  5K Opus + 50K Sonnet + 45K Haiku
              = $0.075 + $1.50 + $0.09 = ~$0.90
              Savings: 40%
```

---

## Configuration (Optional)

Users can customize behavior by creating `.claude/ori-config.json`:

```json
{
  "auto_approve_low_risk": true,
  "research_depth": "thorough",
  "max_sources": 5,
  "require_confirmation_for": ["breaking_changes", "external_api_calls"],
  "model_selection": {
    "always_use_opus_for_strategy": true,
    "allow_dynamic_phase1": true,
    "prefer_haiku_for_docs": true,
    "min_complexity_for_opus": "high"
  },
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
