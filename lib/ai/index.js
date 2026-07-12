import { callOpenRouter, OpenRouterError } from './openrouter';
import { promptBuilders } from './prompts';
import { parseAIResponse, AIParseError } from './parser';
import { validators, AIValidationError } from './validator';

export { OpenRouterError, AIParseError, AIValidationError };

export async function generateAIResponse({ feature, input }) {
    const buildPrompt = promptBuilders[feature];
    const validate = validators[feature];

    if (!buildPrompt || !validate) {
        throw new AIValidationError(`Unknown AI feature "${feature}".`);
    }

    const { system, user } = buildPrompt(input || {});

    const raw = await callOpenRouter({
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
        ],
        temperature: 0.5,
        maxTokens: 1200,
        responseFormat: true,
    });

    const parsed = parseAIResponse(raw);
    return validate(parsed);
}
