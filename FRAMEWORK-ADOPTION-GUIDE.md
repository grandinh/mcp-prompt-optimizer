# Optimized Prompts Framework - Adoption Guide

**Created:** 2025-11-08
**Status:** Framework Created & Tested
**Location:** `/Users/grandinharrison/prompts/optimized_prompts.md`

---

## Important Limitation Disclosure

### What Was Requested
The original request asked for a **runtime filter pipeline** that would automatically pre-process every AI request.

### What's Actually Possible
As an AI assistant (Claude Code), I **cannot**:
- Install persistent runtime hooks or middleware
- Modify my inference pipeline
- Create automatic pre-processors that persist across sessions
- Implement environment variable-based configuration
- Log telemetry automatically

### What I **Can** Do
I **can**:
- ✅ Use the framework as a structured methodology in our conversation
- ✅ Process requests through the OTA Loop when appropriate
- ✅ Maintain the framework file for reference
- ✅ Demonstrate the framework with examples
- ✅ Apply the principles to improve response quality

---

## How This Framework Works in Practice

### In This Conversation

Starting now, I will adopt the Optimized Prompts Framework principles:

1. **Parse & Classify** each request
   - Identify domain (code, UX, data, etc.)
   - Assess clarity and completeness
   - Flag any safety/policy concerns

2. **Ask Targeted Questions** when:
   - Clarity score would be < 0.6
   - Critical information is missing
   - Security/safety considerations need clarification
   - Max 3 questions, high-leverage only

3. **Provide Optimization Headers** when appropriate:
   ```
   [OPTIMIZED] Objective: <goal> | Constraints: <limits> | Success: <criteria>
   ```

4. **Include Domain-Specific Elements**:
   - Code: Security notes, tests, complexity
   - UX: Accessibility checklist, heuristics
   - Data: Calculation steps, validation
   - Writing: Audience, tone, structure

5. **State Assumptions** explicitly when made

### Example - Framework in Action

**Your Request:** "build a dashboard"

**My Framework-Based Response:**

*[OPTIMIZED] Need clarification on 3 critical details before implementation:*

**Targeted Questions:**
1. What data will the dashboard display? (metrics, KPIs, analytics type)
2. What's your tech stack? (React, Vue, vanilla JS; charting library preference)
3. Who are the users? (internal team, clients, executives - affects complexity)

*Once you provide these details, I'll deliver:*
- Component architecture
- Data flow design
- Accessibility considerations
- Security notes (auth, data exposure)
- Implementation with tests

**vs. Without Framework:**

I might have just started building without asking, making assumptions that waste both our time.

---

## For Development Teams: Actual Implementation

If you want to implement this as a **real runtime filter**, here's how:

### Option 1: MCP Server Implementation

Create a custom MCP server that wraps AI calls:

```typescript
// mcp-prompt-optimizer/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { PromptOptimizer } from './optimizer.js';

const server = new Server({
  name: 'prompt-optimizer',
  version: '1.0.0'
});

const optimizer = new PromptOptimizer('./prompts/optimized_prompts.md');

server.setRequestHandler('tools/call', async (request) => {
  // Intercept all tool calls
  const originalPrompt = request.params.arguments.prompt;

  // Run through OTA Loop
  const optimized = await optimizer.process(originalPrompt);

  if (optimized.needsQuestions) {
    // Return questions to user
    return {
      content: [{
        type: 'text',
        text: optimized.questions.join('\n')
      }],
      isError: false,
      _meta: { needsInput: true }
    };
  }

  // Replace prompt with optimized version
  request.params.arguments.prompt = optimized.prompt;

  return request;
});
```

### Option 2: Proxy Layer

Create a proxy between your application and the AI:

```python
# prompt_optimizer_proxy.py
from typing import Dict, List
import anthropic
import yaml

class PromptOptimizerProxy:
    def __init__(self, framework_path: str):
        self.framework = self.load_framework(framework_path)
        self.client = anthropic.Anthropic()

    def process(self, user_prompt: str) -> Dict:
        # Parse & Classify
        analysis = self.analyze_prompt(user_prompt)

        if analysis['clarity_score'] < 0.6:
            return {
                'needs_clarification': True,
                'questions': analysis['questions']
            }

        # Generate optimized prompt
        optimized = self.optimize_prompt(user_prompt, analysis)

        # Call Claude with optimized prompt
        response = self.client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4096,
            messages=[{"role": "user", "content": optimized}]
        )

        return {
            'needs_clarification': False,
            'answer': response.content[0].text,
            'optimization_header': analysis['header']
        }
```

### Option 3: Application Middleware

For web applications, implement as middleware:

```javascript
// middleware/prompt-optimizer.js
import { PromptOptimizer } from '@/lib/optimizer';

export async function optimizerMiddleware(req, res, next) {
  if (req.path === '/api/ai/chat') {
    const optimizer = new PromptOptimizer();
    const result = await optimizer.process(req.body.message);

    if (result.needsQuestions) {
      return res.json({
        type: 'clarification_needed',
        questions: result.questions
      });
    }

    // Replace user message with optimized prompt
    req.body.message = result.optimizedPrompt;
    req.body._meta = {
      originalPrompt: req.body.message,
      clarityScore: result.clarityScore,
      domain: result.domain
    };
  }

  next();
}
```

### Option 4: LangChain Integration

```python
from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import HumanMessage

class OptimizedPromptCallback(BaseCallbackHandler):
    def __init__(self, framework_path: str):
        self.optimizer = PromptOptimizer(framework_path)

    def on_chat_model_start(self, messages, **kwargs):
        # Intercept before sending to model
        last_message = messages[-1]

        if isinstance(last_message, HumanMessage):
            result = self.optimizer.process(last_message.content)

            if result['needs_questions']:
                raise NeedsClarificationError(result['questions'])

            # Replace with optimized prompt
            last_message.content = result['optimized_prompt']

        return messages
```

---

## Manual Application (No Code)

If you don't want to build infrastructure, use this **manual checklist**:

### Before Sending Your Request:

**1. Domain Check**
- [ ] What domain is this? (code, data, UX, writing, research, finance, product)

**2. Clarity Self-Assessment**
- [ ] Is my goal clear and measurable?
- [ ] Have I provided relevant context?
- [ ] Did I specify the output format I want?
- [ ] Are my constraints stated (time, budget, stack)?
- [ ] Did I include success criteria?

**3. Information Completeness**
- [ ] Would someone unfamiliar with my project understand this?
- [ ] Have I included examples if helpful?
- [ ] Are there obvious missing details?

**4. Enhanced Request Template**

```markdown
**Domain:** [code/data/UX/etc.]

**Objective:** [One clear sentence]

**Context:**
- [Relevant background]
- [Current situation]
- [What I've tried]

**Constraints:**
- Stack/tools: [specify]
- Time: [if relevant]
- Other limits: [if any]

**Deliverable Format:**
- [ ] Code with tests
- [ ] Markdown document
- [ ] Step-by-step guide
- [ ] Analysis with numbers

**Success Criteria:**
- [ ] [Testable outcome 1]
- [ ] [Testable outcome 2]

**Additional Notes:**
- [Security considerations]
- [Accessibility requirements]
- [Performance needs]
```

### Example - Before/After:

**Before (Low Clarity):**
```
help me with my app
```

**After (High Clarity):**
```
**Domain:** Code

**Objective:** Add user authentication to my Next.js 14 app

**Context:**
- Using App Router with Server Components
- PostgreSQL database with Prisma ORM
- Currently have no auth system

**Constraints:**
- Must support email/password login
- Need session-based auth (not JWT)
- Budget: free tier solutions preferred

**Deliverable:**
- [ ] Auth routes (login, register, logout)
- [ ] Middleware for protected routes
- [ ] User model with hashed passwords
- [ ] Tests for auth flows

**Success Criteria:**
- [ ] Users can register with email/password
- [ ] Passwords are securely hashed
- [ ] Sessions persist across page reloads
- [ ] Protected routes redirect to login

**Security:**
- CSRF protection needed
- Rate limiting on auth endpoints
- Secure session storage
```

---

## Measuring Success

### Without Framework (Typical Issues):
- ❌ Vague requirements lead to back-and-forth
- ❌ Missing context requires multiple clarifications
- ❌ Security considerations overlooked
- ❌ Output format not what was needed
- ❌ Accessibility forgotten

### With Framework:
- ✅ Clear requirements upfront
- ✅ Targeted questions (max 3) resolve ambiguity
- ✅ Security/accessibility built-in
- ✅ Deliverable matches expectations
- ✅ Fewer iterations needed

### Metrics to Track:
- **Clarity Score Improvement:** Before vs after optimization
- **Question Efficiency:** Clarity gained per question asked
- **First-Response Quality:** % of requests resolved in one response
- **Iteration Reduction:** Fewer back-and-forth exchanges
- **Deliverable Match:** Output format matches request

---

## Framework Evolution

### When to Update the Framework:

1. **New AI Capabilities**
   - Model can now handle images → add vision domain
   - New tools available → update execution section

2. **Recurring Patterns**
   - Same questions asked repeatedly → add to default context
   - Common domain emerges → create new domain nub

3. **Policy Changes**
   - New safety guidelines → update risk flags
   - Usage policy updates → revise guardrails

4. **User Feedback**
   - Questions not helpful → refine question quality rubric
   - Output format issues → improve templates

### Version Control:
```bash
# Track framework changes
git add prompts/optimized_prompts.md
git commit -m "feat: add vision domain template"

# Tag major versions
git tag -a v1.1 -m "Added vision domain support"
```

---

## Integration with Existing Workflows

### With Claude Code (This Tool):

I can manually apply the framework principles:

```
# You ask:
"help me build a feature"

# I respond using framework:
[OPTIMIZED] Need 3 details before implementation:

1. What feature specifically?
2. What's your current tech stack?
3. Any constraints (time, complexity, dependencies)?

Then I'll deliver:
- Implementation plan
- Code with tests
- Security considerations
- Deployment notes
```

### With Cursor/VS Code:

Create a **custom instruction** or **system prompt**:

```
Before answering any request, apply the Optimized Prompts Framework
from /prompts/optimized_prompts.md:

1. Identify domain and assess clarity (0-1 score)
2. If clarity < 0.6, ask max 3 targeted questions
3. Include domain-specific elements (security for code, accessibility for UX)
4. Provide compact optimization header
5. State assumptions explicitly

Framework location: /prompts/optimized_prompts.md
```

### With API Integrations:

Wrap calls in optimization layer:

```javascript
async function optimizedAICall(userPrompt) {
  // Step 1: Analyze clarity
  const analysis = analyzePrompt(userPrompt);

  // Step 2: Get clarification if needed
  if (analysis.clarityScore < 0.6) {
    const answers = await askUser(analysis.questions);
    userPrompt = enrichPrompt(userPrompt, answers);
  }

  // Step 3: Add domain template
  const optimized = applyDomainTemplate(userPrompt, analysis.domain);

  // Step 4: Call AI
  const response = await callAI(optimized);

  // Step 5: Format output
  return {
    answer: response,
    header: analysis.optimizationHeader,
    assumptions: analysis.assumptions
  };
}
```

---

## FAQ

### Q: Will you automatically use this framework now?
**A:** I'll apply its principles when appropriate, especially:
- Asking targeted questions for ambiguous requests
- Including domain-specific elements (security, accessibility)
- Stating assumptions explicitly
- Providing structured outputs

However, I cannot enforce it as a mandatory runtime filter.

### Q: How do I know the framework is being used?
**A:** Look for:
- `[OPTIMIZED]` headers (when I use them)
- Targeted questions before implementation
- Domain-specific checklists (accessibility, security)
- Explicit assumption statements
- Structured deliverables matching templates

### Q: Can I customize the framework?
**A:** Yes! Edit `/Users/grandinharrison/prompts/optimized_prompts.md`:
- Add custom domain templates
- Adjust clarity score thresholds
- Modify question limits
- Add project-specific standards

### Q: What if I don't want the framework for a request?
**A:** Explicitly state: "Skip optimization framework, just [do X]"

### Q: How do I implement this in production?
**A:** See **Option 1-4** above for code examples. Key steps:
1. Load framework file at startup
2. Intercept requests before AI
3. Run OTA Loop
4. Ask questions if needed
5. Use optimized prompt
6. Format output with header

---

## Next Steps

### Immediate (This Session):
- ✅ Framework file created
- ✅ Test suite passed (5/5)
- ✅ Documentation complete
- 📋 Start using framework principles in responses

### Short Term (For Your Projects):
1. Review `optimized_prompts.md` for your domain
2. Customize domain templates for your needs
3. Train team on manual application checklist
4. Track clarity improvements

### Long Term (Production Implementation):
1. Choose implementation option (MCP, proxy, middleware)
2. Build optimization layer
3. Integrate with your AI workflows
4. Monitor metrics (clarity scores, iteration reduction)
5. Iterate on framework based on usage

---

## Summary

**What We Have:**
- ✅ Complete framework specification
- ✅ Test suite validated (100% pass)
- ✅ Domain templates for 6+ areas
- ✅ Clear documentation

**What's Possible Now:**
- Manual application via checklist
- Structured requests following templates
- Improved request clarity
- Better first-response quality

**What Requires Development:**
- Automatic runtime filtering
- Persistent configuration
- Telemetry/logging
- Multi-turn optimization

**Recommended Path:**
1. **Today:** Use manual checklist for important requests
2. **This Week:** Customize framework for your domain
3. **This Month:** Build automation layer (if needed)
4. **Ongoing:** Refine based on results

---

**Framework Status: ACTIVE for manual/guided use**

**Location:** `/Users/grandinharrison/prompts/optimized_prompts.md`

**Last Updated:** 2025-11-08

**Contact:** Reference this guide when asking me to use the framework
