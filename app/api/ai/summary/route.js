import { handleAIRoute } from '@/lib/ai/request';

export async function POST(request) {
    return handleAIRoute(request, {
        feature: 'summary',
        buildInput: body => {
            if (!body.experience && !body.skills) {
                throw new Error('At least experience or skills context is required.');
            }
            return { contact: body.contact || {}, experience: body.experience || [], skills: body.skills || {} };
        },
    });
}
