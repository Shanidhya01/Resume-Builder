// Central registry of resume templates. Each template's PDF component is
// lazy-loaded (see components/Resume/templates/registry.js) so switching
// templates never pulls in layouts the user hasn't selected.

export const TEMPLATE_IDS = {
    ATS: 'ats',
    MODERN: 'modern',
    CREATIVE: 'creative',
    MINIMAL: 'minimal',
    EXECUTIVE: 'executive',
    TWO_COLUMN: 'two-column',
};

export const DEFAULT_TEMPLATE_ID = TEMPLATE_IDS.ATS;

const templates = [
    {
        id: TEMPLATE_IDS.ATS,
        name: 'ATS',
        description: 'A single-column, no-frills layout built to pass Applicant Tracking Systems cleanly.',
        thumbnail: '/templates/ats.png',
        atsScore: 98,
        recommendedRoles: ['Software Engineer', 'Data Analyst', 'Operations', 'Finance'],
        primaryColor: '#1F2937',
        secondaryColor: '#4B5563',
        layoutType: 'single-column',
    },
    {
        id: TEMPLATE_IDS.MODERN,
        name: 'Modern',
        description: 'A clean, contemporary layout with a bold accent header and generous whitespace.',
        thumbnail: '/templates/modern.png',
        atsScore: 88,
        recommendedRoles: ['Product Manager', 'UX Designer', 'Marketing', 'Tech Lead'],
        primaryColor: '#6F42C1',
        secondaryColor: '#8B5CF6',
        layoutType: 'single-column',
    },
    {
        id: TEMPLATE_IDS.CREATIVE,
        name: 'Creative',
        description: 'A visually distinct layout with a colored sidebar, ideal for design and creative roles.',
        thumbnail: '/templates/creative.png',
        atsScore: 70,
        recommendedRoles: ['Graphic Designer', 'Art Director', 'Content Creator', 'Illustrator'],
        primaryColor: '#DB2777',
        secondaryColor: '#F472B6',
        layoutType: 'sidebar',
    },
    {
        id: TEMPLATE_IDS.MINIMAL,
        name: 'Minimal',
        description: 'A stripped-back, typography-first layout with maximum readability and minimal styling.',
        thumbnail: '/templates/simple.png',
        atsScore: 95,
        recommendedRoles: ['Academic', 'Research', 'Legal', 'Consulting'],
        primaryColor: '#111827',
        secondaryColor: '#6B7280',
        layoutType: 'single-column',
    },
    {
        id: TEMPLATE_IDS.EXECUTIVE,
        name: 'Executive',
        description: 'A formal, traditional layout with serif typography suited to senior and leadership roles.',
        thumbnail: '/templates/traditional.png',
        atsScore: 92,
        recommendedRoles: ['Director', 'VP', 'C-Suite', 'Senior Manager'],
        primaryColor: '#0F172A',
        secondaryColor: '#334155',
        layoutType: 'single-column',
    },
    {
        id: TEMPLATE_IDS.TWO_COLUMN,
        name: 'Two Column',
        description: 'A compact two-column layout that fits more content per page without feeling cramped.',
        thumbnail: '/templates/twocolumn.png',
        atsScore: 80,
        recommendedRoles: ['Full-Stack Developer', 'Project Manager', 'Business Analyst'],
        primaryColor: '#0369A1',
        secondaryColor: '#0EA5E9',
        layoutType: 'two-column',
    },
];

export default templates;

export const getTemplateById = id => templates.find(t => t.id === id) ?? templates.find(t => t.id === DEFAULT_TEMPLATE_ID);

export const isValidTemplateId = id => templates.some(t => t.id === id);

export const getTemplateIndex = id => {
    const index = templates.findIndex(t => t.id === id);
    return index === -1 ? 0 : index;
};
