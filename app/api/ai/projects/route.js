import { handleAIRoute } from '@/lib/ai/request';

export async function POST(request) {
    return handleAIRoute(request, {
        feature: 'projects',
        buildInput: body => {
            if (!body.entry || typeof body.entry !== 'object') {
                throw new Error('An "entry" object describing the project is required.');
            }
            return { entry: body.entry };
        },
    });
}
