import { handleAIRoute } from '@/lib/ai/request';

export async function POST(request) {
    return handleAIRoute(request, {
        feature: 'review',
        buildInput: body => {
            if (!body.resume || typeof body.resume !== 'object') {
                throw new Error('A "resume" object is required.');
            }
            return { resume: body.resume };
        },
    });
}
