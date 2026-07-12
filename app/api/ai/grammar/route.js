import { handleAIRoute } from '@/lib/ai/request';

export async function POST(request) {
    return handleAIRoute(request, {
        feature: 'grammar',
        buildInput: body => {
            if (!body.text || !body.text.trim()) {
                throw new Error('A non-empty "text" field is required.');
            }
            return { text: body.text };
        },
    });
}
