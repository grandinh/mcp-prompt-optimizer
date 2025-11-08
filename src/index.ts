#!/usr/bin/env node

/**
 * MCP Prompt Optimizer Server
 *
 * This MCP server implements the Optimized Prompts Framework (OTA Loop)
 * as a tool that can be called before making AI requests.
 *
 * It provides a `optimize_prompt` tool that analyzes and enhances user prompts.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

interface PromptAnalysis {
  domain: string;
  clarity_score: number;
  risk_flags: string[];
  questions: string[];
  optimized_prompt: string;
  optimization_header: string;
  assumptions: string[];
  needs_clarification: boolean;
}

class PromptOptimizer {
  private frameworkPath: string;
  private framework: string | null = null;

  constructor(frameworkPath?: string) {
    this.frameworkPath = frameworkPath || path.join(process.env.HOME || '', 'prompts', 'optimized_prompts.md');
  }

  async loadFramework(): Promise<void> {
    try {
      this.framework = await fs.readFile(this.frameworkPath, 'utf-8');
    } catch (error) {
      console.error('Warning: Could not load framework file:', error);
      this.framework = null;
    }
  }

  /**
   * Analyze a prompt and determine domain, clarity, and risks
   */
  analyzePrompt(prompt: string): Partial<PromptAnalysis> {
    const analysis: Partial<PromptAnalysis> = {
      domain: this.detectDomain(prompt),
      clarity_score: this.calculateClarityScore(prompt),
      risk_flags: this.detectRisks(prompt),
      questions: [],
      assumptions: [],
    };

    return analysis;
  }

  /**
   * Detect the domain of the request
   */
  private detectDomain(prompt: string): string {
    const lower = prompt.toLowerCase();

    // Code-related keywords
    if (/(code|function|api|debug|error|implement|build|create.*app|deploy|test)/i.test(prompt)) {
      return 'code';
    }

    // UX-related keywords
    if (/(ui|ux|design|interface|user.*experience|accessibility|usability|wireframe)/i.test(prompt)) {
      return 'UX';
    }

    // Data-related keywords
    if (/(data|analyze|statistics|metrics|chart|graph|calculate|sql|query)/i.test(prompt)) {
      return 'data';
    }

    // Writing-related keywords
    if (/(write|blog|article|content|copy|email|documentation|readme)/i.test(prompt)) {
      return 'writing';
    }

    // Research-related keywords
    if (/(research|study|investigate|compare|evaluate|analyze.*market)/i.test(prompt)) {
      return 'research';
    }

    // Finance-related keywords
    if (/(roi|revenue|cost|budget|finance|pricing|valuation)/i.test(prompt)) {
      return 'finance';
    }

    // Product-related keywords
    if (/(product|feature|roadmap|strategy|market.*plan|gtm)/i.test(prompt)) {
      return 'product';
    }

    return 'misc';
  }

  /**
   * Calculate clarity score (0-1) based on presence of key elements
   */
  private calculateClarityScore(prompt: string): number {
    let score = 0;
    const weights = {
      goal: 0.30,
      context: 0.25,
      format: 0.15,
      criteria: 0.20,
      technical: 0.10,
    };

    // Goal clarity: Has clear objective?
    if (/\b(create|build|implement|analyze|design|write|calculate|help.*with)\b/i.test(prompt)) {
      score += weights.goal * 0.8;
    }
    if (prompt.length > 50) {
      score += weights.goal * 0.2; // More detail usually means clearer goal
    }

    // Context: Provides background?
    if (/(using|with|for|in|on|my|our|the)\s+\w+/i.test(prompt)) {
      score += weights.context * 0.5;
    }
    if (prompt.split(/\s+/).length > 20) {
      score += weights.context * 0.5; // Longer prompts often have more context
    }

    // Format: Specifies output format?
    if (/(code|markdown|json|csv|list|table|document|script|function)/i.test(prompt)) {
      score += weights.format;
    }

    // Criteria: Has success criteria or constraints?
    if (/(must|should|need|require|ensure|with.*test|accessible|secure)/i.test(prompt)) {
      score += weights.criteria;
    }

    // Technical: Includes technical details?
    if (/(react|python|node|sql|api|database|framework|library|version)/i.test(prompt)) {
      score += weights.technical;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Detect potential risks in the prompt
   */
  private detectRisks(prompt: string): string[] {
    const risks: string[] = [];
    const lower = prompt.toLowerCase();

    // Security risks
    if (/(password|auth|login|token|secret|key|credential|hack|exploit|vulnerability)/i.test(prompt)) {
      risks.push('security');
    }

    // Privacy risks
    if (/(email|phone|address|ssn|personal.*data|pii|gdpr)/i.test(prompt)) {
      risks.push('privacy');
    }

    // Policy violations (basic detection)
    if (/(fake|bypass|circumvent|illegal|hack.*into|crack|steal)/i.test(prompt)) {
      risks.push('policy');
    }

    // Safety concerns
    if (/(harm|dangerous|weapon|explosive|poison|drug)/i.test(prompt)) {
      risks.push('safety');
    }

    // Compliance/legal
    if (/(medical.*advice|legal.*advice|financial.*advice|tax|investment.*recommendation)/i.test(prompt)) {
      risks.push('compliance');
    }

    return risks;
  }

  /**
   * Generate targeted questions based on missing information
   */
  generateQuestions(prompt: string, domain: string, clarityScore: number): string[] {
    const questions: string[] = [];

    if (clarityScore >= 0.6) {
      return questions; // No questions needed
    }

    // Domain-specific questions
    switch (domain) {
      case 'code':
        if (!/(react|vue|python|node|java|go|rust|typescript|javascript)/i.test(prompt)) {
          questions.push('What programming language or framework are you using?');
        }
        if (!/(function|class|component|api|endpoint|feature)/i.test(prompt)) {
          questions.push('What specific feature or component are you building?');
        }
        if (questions.length < 3 && !/(test|validation|security)/i.test(prompt)) {
          questions.push('Do you need tests, validation, or specific security considerations?');
        }
        break;

      case 'UX':
        if (!/(user|customer|audience|people)/i.test(prompt)) {
          questions.push('Who are the target users for this interface?');
        }
        if (!/(mobile|desktop|responsive|web|app)/i.test(prompt)) {
          questions.push('What platform is this for (web, mobile, desktop)?');
        }
        break;

      case 'data':
        if (!/(rows|records|dataset|table|csv|json)/i.test(prompt)) {
          questions.push('What is the shape/structure of your data?');
        }
        if (!/(calculate|sum|average|count|metric)/i.test(prompt)) {
          questions.push('What specific metrics or calculations do you need?');
        }
        break;

      case 'writing':
        if (!/(audience|reader|customer|user|stakeholder)/i.test(prompt)) {
          questions.push('Who is the target audience?');
        }
        if (!/(\d+\s*(word|page|paragraph|character))/i.test(prompt)) {
          questions.push('What length are you targeting (word count, pages)?');
        }
        if (questions.length < 3 && !/(formal|casual|technical|friendly|professional)/i.test(prompt)) {
          questions.push('What tone should this have (formal, casual, technical)?');
        }
        break;

      case 'product':
      case 'finance':
      case 'research':
        if (prompt.split(/\s+/).length < 15) {
          questions.push('Can you provide more context about your goal?');
        }
        if (!/(timeline|deadline|when|by|urgent)/i.test(prompt)) {
          questions.push('What is the timeline or urgency for this?');
        }
        break;

      default:
        // Generic questions for misc domain
        if (prompt.split(/\s+/).length < 10) {
          questions.push('Can you provide more detail about what you need?');
        }
        if (!/(for|with|using|in)/i.test(prompt)) {
          questions.push('What is the context or setting for this request?');
        }
    }

    // Limit to 3 questions
    return questions.slice(0, 3);
  }

  /**
   * Create optimized prompt with all enhancements
   */
  createOptimizedPrompt(
    originalPrompt: string,
    domain: string,
    clarityScore: number,
    risks: string[]
  ): string {
    let optimized = `**Domain:** ${domain}\n\n`;
    optimized += `**Original Request:**\n${originalPrompt}\n\n`;

    // Add domain-specific requirements
    optimized += `**Requirements Based on Domain:**\n`;

    switch (domain) {
      case 'code':
        optimized += `- Include code summary and complexity notes\n`;
        optimized += `- Add security considerations\n`;
        optimized += `- Provide test plan and example I/O\n`;
        optimized += `- Include error handling\n`;
        if (risks.includes('security')) {
          optimized += `- **CRITICAL:** Address security concerns (authentication, validation, data exposure)\n`;
        }
        break;

      case 'UX':
        optimized += `- Evaluate against usability heuristics\n`;
        optimized += `- Include accessibility checklist (WCAG 2.1 AA)\n`;
        optimized += `- Consider mobile responsiveness\n`;
        optimized += `- Address error and loading states\n`;
        break;

      case 'data':
        optimized += `- Describe dataset shape and structure\n`;
        optimized += `- Show calculation steps explicitly\n`;
        optimized += `- Validate data and identify edge cases\n`;
        optimized += `- Make results reproducible\n`;
        break;

      case 'writing':
        optimized += `- Define audience clearly\n`;
        optimized += `- Specify tone and style\n`;
        optimized += `- Include structure outline\n`;
        optimized += `- Provide strong opening and CTA if applicable\n`;
        break;

      case 'finance':
        optimized += `- State all assumptions explicitly\n`;
        optimized += `- Show calculation methodology\n`;
        optimized += `- Identify risk factors\n`;
        optimized += `- Include sensitivity analysis if relevant\n`;
        if (risks.includes('compliance')) {
          optimized += `- **DISCLAIMER:** Not professional financial advice\n`;
        }
        break;

      default:
        optimized += `- Provide clear, structured output\n`;
        optimized += `- State assumptions explicitly\n`;
        optimized += `- Include examples if helpful\n`;
    }

    optimized += `\n**Output Format:**\n`;
    optimized += `- Structured and scannable\n`;
    optimized += `- Include acceptance criteria\n`;
    optimized += `- List any assumptions made\n`;

    if (risks.length > 0) {
      optimized += `\n**Risk Flags Detected:** ${risks.join(', ')}\n`;
      optimized += `Please address these concerns in your response.\n`;
    }

    return optimized;
  }

  /**
   * Main optimization method
   */
  async optimize(prompt: string, context?: string): Promise<PromptAnalysis> {
    if (!this.framework) {
      await this.loadFramework();
    }

    const analysis = this.analyzePrompt(prompt);
    const domain = analysis.domain!;
    const clarityScore = analysis.clarity_score!;
    const risks = analysis.risk_flags!;

    const questions = this.generateQuestions(prompt, domain, clarityScore);
    const needsClarification = clarityScore < 0.6 || risks.some(r => ['policy', 'safety'].includes(r));

    const optimizedPrompt = this.createOptimizedPrompt(prompt, domain, clarityScore, risks);

    const header = `[OPTIMIZED] Domain: ${domain} | Clarity: ${(clarityScore * 100).toFixed(0)}% | ` +
      `Risks: ${risks.length > 0 ? risks.join(', ') : 'none'}`;

    return {
      domain,
      clarity_score: clarityScore,
      risk_flags: risks,
      questions,
      optimized_prompt: optimizedPrompt,
      optimization_header: header,
      assumptions: [],
      needs_clarification: needsClarification,
    };
  }
}

// Create the MCP server
const server = new Server(
  {
    name: 'prompt-optimizer',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const optimizer = new PromptOptimizer();

// Define the optimize_prompt tool
const OPTIMIZE_TOOL: Tool = {
  name: 'optimize_prompt',
  description:
    'Analyze and optimize a user prompt using the OTA (Optimize-Then-Answer) Framework. ' +
    'Returns clarity score, domain classification, risk flags, targeted questions (if needed), ' +
    'and an enhanced prompt ready for AI processing.',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'The user prompt to optimize',
      },
      context: {
        type: 'string',
        description: 'Optional additional context about the request',
      },
    },
    required: ['prompt'],
  },
};

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [OPTIMIZE_TOOL],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'optimize_prompt') {
    const { prompt, context } = request.params.arguments as { prompt: string; context?: string };

    try {
      const result = await optimizer.optimize(prompt, context);

      let response = `${result.optimization_header}\n\n`;

      if (result.needs_clarification && result.questions.length > 0) {
        response += `**⚠️ Clarification Needed** (Clarity: ${(result.clarity_score * 100).toFixed(0)}%)\n\n`;
        response += `**Please answer these questions before I proceed:**\n\n`;
        result.questions.forEach((q, i) => {
          response += `${i + 1}. ${q}\n`;
        });
        response += `\n---\n\n`;
      } else {
        response += `**✓ Ready to Process** (Clarity: ${(result.clarity_score * 100).toFixed(0)}%)\n\n`;
      }

      response += `**Domain:** ${result.domain}\n`;
      response += `**Risk Flags:** ${result.risk_flags.length > 0 ? result.risk_flags.join(', ') : 'None'}\n\n`;

      if (!result.needs_clarification) {
        response += `**Optimized Prompt:**\n\`\`\`\n${result.optimized_prompt}\n\`\`\`\n\n`;
        response += `Use this enhanced prompt for the AI request to ensure comprehensive, domain-appropriate output.`;
      }

      return {
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error optimizing prompt: ${error}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Prompt Optimizer MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
