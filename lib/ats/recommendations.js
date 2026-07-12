// Feature 9: Improvement Center — turns raw analysis into a flat, prioritized suggestion list.
// Each suggestion gets a stable id (hash of category+message) so accept/reject/complete state
// persists in Redux across re-analysis as long as the underlying issue doesn't change.

function hashId(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return `sug_${Math.abs(h)}`;
}

function push(list, { priority, category, message, section }) {
    list.push({ id: hashId(`${category}:${message}`), priority, category, message, section });
}

export function buildRecommendations(analysis) {
    const list = [];
    const { sectionStatus, sectionScores, keywordAnalysis, bulletAnalysis, grammar, readability } = analysis;

    Object.entries(sectionStatus).forEach(([section, info]) => {
        if (info.status === 'Missing') {
            push(list, { priority: 'critical', category: 'section', message: `Add a ${section} section — it's currently missing.`, section });
        } else if (info.status === 'Needs Improvement') {
            push(list, { priority: 'high', category: 'section', message: `${section}: ${info.reason}`, section });
        } else if (info.status === 'Good') {
            push(list, { priority: 'medium', category: 'section', message: `${section}: ${info.reason}`, section });
        }
    });

    if (keywordAnalysis.matchPercent != null && keywordAnalysis.matchPercent < 60) {
        push(list, {
            priority: 'critical',
            category: 'keywords',
            message: `Low job-description match (${keywordAnalysis.matchPercent}%). Add missing keywords: ${keywordAnalysis.missingKeywords.slice(0, 5).join(', ')}.`,
            section: 'keywords',
        });
    }
    if (keywordAnalysis.overusedKeywords.length > 0) {
        push(list, {
            priority: 'medium',
            category: 'keywords',
            message: `These keywords appear too often and may look like stuffing: ${keywordAnalysis.overusedKeywords.slice(0, 5).join(', ')}.`,
            section: 'keywords',
        });
    }
    if (keywordAnalysis.unusedSkills.length > 0) {
        push(list, {
            priority: 'low',
            category: 'keywords',
            message: `Skills listed but never mentioned in context: ${keywordAnalysis.unusedSkills.slice(0, 5).join(', ')}. Reference them in a bullet point.`,
            section: 'skills',
        });
    }

    (bulletAnalysis?.weakBullets || []).forEach(b => {
        push(list, {
            priority: 'high',
            category: 'bullet',
            message: `Weak bullet in ${b.section}: "${b.text.slice(0, 80)}"${b.suggestion ? ` — ${b.suggestion}` : ''}`,
            section: b.section,
        });
    });

    if (grammar.issueCount > 0) {
        push(list, { priority: 'medium', category: 'grammar', message: `${grammar.issueCount} grammar/style issue(s) found across your resume.`, section: 'grammar' });
    }

    if (readability.score < 40) {
        push(list, { priority: 'medium', category: 'readability', message: 'Resume text is dense and hard to scan — use shorter sentences.', section: 'readability' });
    }

    if (sectionScores.formatting < 80) {
        push(list, { priority: 'high', category: 'formatting', message: 'Fill in all header contact fields for best ATS parsing.', section: 'header' });
    }

    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return list.sort((a, b) => order[a.priority] - order[b.priority]);
}

export function groupByPriority(recommendations) {
    return {
        critical: recommendations.filter(r => r.priority === 'critical'),
        high: recommendations.filter(r => r.priority === 'high'),
        medium: recommendations.filter(r => r.priority === 'medium'),
        low: recommendations.filter(r => r.priority === 'low'),
    };
}
