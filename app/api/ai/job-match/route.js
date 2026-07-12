import { handleAIRoute } from '@/lib/ai/request';

export async function POST(request) {
    return handleAIRoute(request, {
        feature: 'jobMatch',
        buildInput: body => {
            if (!body.resume || typeof body.resume !== 'object') {
                throw new Error('A "resume" object is required.');
            }
            if (!body.jobDescription || !body.jobDescription.trim()) {
                throw new Error('A non-empty "jobDescription" field is required.');
            }
            return { resume: body.resume, jobDescription: body.jobDescription };
        },
    });
}
