import { handleAIRoute } from '@/lib/ai/request';

export async function POST(request) {
    return handleAIRoute(request, {
        feature: 'rewrite',
        buildInput: body => {
            if (!body.text || !body.text.trim()) {
                throw new Error('A non-empty "text" field is required.');
            }
            return { text: body.text, tone: body.tone };
        },
    });
}
