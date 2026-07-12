import { handleAIRoute } from '@/lib/ai/request';

export async function POST(request) {
    return handleAIRoute(request, {
        feature: 'skills',
        buildInput: body => {
            if (!body.skills) {
                throw new Error('A "skills" object is required.');
            }
            return { skills: body.skills, experience: body.experience || [] };
        },
    });
}
