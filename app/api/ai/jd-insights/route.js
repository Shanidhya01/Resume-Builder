import { handleAIRoute } from '@/lib/ai/request';

export async function POST(request) {
    return handleAIRoute(request, {
        feature: 'jdInsights',
        buildInput: body => {
            if (!body.resume || typeof body.resume !== 'object') {
                throw new Error('A "resume" object is required.');
            }
            if (!body.jobDescription || typeof body.jobDescription !== 'string') {
                throw new Error('A "jobDescription" string is required.');
            }
            return {
                resume: body.resume,
                jobDescription: body.jobDescription,
                matchedSkills: Array.isArray(body.matchedSkills) ? body.matchedSkills : [],
                missingSkills: Array.isArray(body.missingSkills) ? body.missingSkills : [],
            };
        },
    });
}
