import { handleAIRoute } from '@/lib/ai/request';

export async function POST(request) {
    return handleAIRoute(request, {
        feature: 'coverLetter',
        buildInput: body => {
            if (!body.resume || typeof body.resume !== 'object') {
                throw new Error('A "resume" object is required.');
            }
            if (!body.jobTitle || !body.company) {
                throw new Error('"jobTitle" and "company" are required.');
            }
            return {
                resume: body.resume,
                jobTitle: body.jobTitle,
                company: body.company,
                jobDescription: body.jobDescription || '',
            };
        },
    });
}
