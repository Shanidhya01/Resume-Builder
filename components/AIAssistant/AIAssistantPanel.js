'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateResumeValue } from '@/store/slices/resumeSlice';
import useAI from '@/hooks/useAI';

const FEATURES = [
    { key: 'summary', label: 'Generate Summary' },
    { key: 'experience', label: 'Improve Experience' },
    { key: 'projects', label: 'Improve Project' },
    { key: 'skills', label: 'Organize Skills' },
    { key: 'rewrite', label: 'Rewrite Text' },
    { key: 'grammar', label: 'Grammar Check' },
    { key: 'review', label: 'Resume Review' },
    { key: 'ats', label: 'ATS Review' },
    { key: 'coverLetter', label: 'Cover Letter' },
    { key: 'jobMatch', label: 'Job Match' },
];

const copyToClipboard = text => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => {});
    }
};

const resultText = (feature, result) => {
    if (!result) return '';
    switch (feature) {
        case 'summary':
            return result.summary;
        case 'experience':
        case 'projects':
            return (result.bullets || []).join('\n');
        case 'skills':
            return (result.skills || []).join(', ');
        case 'rewrite':
            return result.rewritten;
        case 'grammar':
            return result.corrected;
        case 'coverLetter':
            return result.coverLetter;
        case 'review':
            return `Score: ${result.score}/100\nStrengths:\n${(result.strengths || []).join('\n')}\nWeaknesses:\n${(result.weaknesses || []).join('\n')}\nSuggestions:\n${(result.suggestions || []).join('\n')}`;
        case 'ats':
            return `Score: ${result.score}/100\nIssues:\n${(result.issues || []).join('\n')}\nSuggestions:\n${(result.suggestions || []).join('\n')}`;
        case 'jobMatch':
            return `Score: ${result.score}/100\nMatched: ${(result.matchedKeywords || []).join(', ')}\nMissing: ${(result.missingKeywords || []).join(', ')}\nSuggestions:\n${(result.suggestions || []).join('\n')}`;
        default:
            return JSON.stringify(result);
    }
};

const AIAssistantPanel = () => {
    const dispatch = useDispatch();
    const resume = useSelector(state => state.resume);
    const { run, loading, error, lastResponse } = useAI();

    const [feature, setFeature] = useState('summary');
    const [expIndex, setExpIndex] = useState(0);
    const [projIndex, setProjIndex] = useState(0);
    const [rewriteText, setRewriteText] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const isLoading = !!loading[feature];
    const featureError = error[feature];
    const result = lastResponse[feature];

    const buildBody = () => {
        switch (feature) {
            case 'summary':
                return { contact: resume.contact, experience: resume.experience, skills: resume.skills };
            case 'experience':
                return { entry: resume.experience?.[expIndex] || {} };
            case 'projects':
                return { entry: resume.projects?.[projIndex] || {} };
            case 'skills':
                return { skills: resume.skills, experience: resume.experience };
            case 'rewrite':
                return { text: rewriteText };
            case 'grammar':
                return { text: rewriteText };
            case 'review':
                return { resume };
            case 'ats':
                return { resume };
            case 'coverLetter':
                return { resume, jobTitle, company, jobDescription };
            case 'jobMatch':
                return { resume, jobDescription };
            default:
                return {};
        }
    };

    const handleGenerate = () => {
        run(feature, buildBody(), { inputSummary: feature });
    };

    const handleAccept = () => {
        if (!result) return;
        switch (feature) {
            case 'summary':
                dispatch(updateResumeValue({ tab: 'summary', name: 'summary', value: result.summary }));
                break;
            case 'experience':
                dispatch(
                    updateResumeValue({
                        tab: 'experience',
                        name: 'description',
                        value: (result.bullets || []).join('\n'),
                        index: expIndex,
                    })
                );
                break;
            case 'projects':
                dispatch(
                    updateResumeValue({
                        tab: 'projects',
                        name: 'description',
                        value: (result.bullets || []).join('\n'),
                        index: projIndex,
                    })
                );
                break;
            case 'skills':
                dispatch(updateResumeValue({ tab: 'skills', name: 'skills', value: (result.skills || []).join(', ') }));
                break;
            case 'grammar':
                setRewriteText(result.corrected);
                break;
            case 'rewrite':
                setRewriteText(result.rewritten);
                break;
            default:
                break;
        }
    };

    const renderInputs = () => {
        if (feature === 'experience') {
            return (
                <select
                    value={expIndex}
                    onChange={e => setExpIndex(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#6F42C1]/50 bg-transparent p-2 text-sm text-gray-200"
                >
                    {(resume.experience || []).map((e, i) => (
                        <option key={i} value={i} className="bg-gray-900">
                            {e.role || e.company || `Entry ${i + 1}`}
                        </option>
                    ))}
                    {(!resume.experience || resume.experience.length === 0) && <option>No experience entries yet</option>}
                </select>
            );
        }
        if (feature === 'projects') {
            return (
                <select
                    value={projIndex}
                    onChange={e => setProjIndex(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#6F42C1]/50 bg-transparent p-2 text-sm text-gray-200"
                >
                    {(resume.projects || []).map((p, i) => (
                        <option key={i} value={i} className="bg-gray-900">
                            {p.title || `Project ${i + 1}`}
                        </option>
                    ))}
                    {(!resume.projects || resume.projects.length === 0) && <option>No project entries yet</option>}
                </select>
            );
        }
        if (feature === 'rewrite' || feature === 'grammar') {
            return (
                <textarea
                    value={rewriteText}
                    onChange={e => setRewriteText(e.target.value)}
                    placeholder="Paste text to rewrite or grammar-check..."
                    rows={4}
                    className="w-full rounded-lg border border-[#6F42C1]/50 bg-transparent p-2 text-sm text-gray-200"
                />
            );
        }
        if (feature === 'coverLetter') {
            return (
                <div className="flex flex-col gap-2">
                    <input
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        placeholder="Job title"
                        className="w-full rounded-lg border border-[#6F42C1]/50 bg-transparent p-2 text-sm text-gray-200"
                    />
                    <input
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Company"
                        className="w-full rounded-lg border border-[#6F42C1]/50 bg-transparent p-2 text-sm text-gray-200"
                    />
                    <textarea
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        placeholder="Paste job description..."
                        rows={3}
                        className="w-full rounded-lg border border-[#6F42C1]/50 bg-transparent p-2 text-sm text-gray-200"
                    />
                </div>
            );
        }
        if (feature === 'jobMatch') {
            return (
                <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste job description..."
                    rows={4}
                    className="w-full rounded-lg border border-[#6F42C1]/50 bg-transparent p-2 text-sm text-gray-200"
                />
            );
        }
        return <p className="text-xs text-gray-400">Uses your current resume data as context automatically.</p>;
    };

    const canAccept = ['summary', 'experience', 'projects', 'skills', 'rewrite', 'grammar'].includes(feature);

    return (
        <div className="flex flex-col gap-4">
            <select
                value={feature}
                onChange={e => setFeature(e.target.value)}
                className="w-full rounded-lg border border-[#6F42C1]/50 bg-transparent p-2 text-sm font-semibold text-gray-200"
            >
                {FEATURES.map(f => (
                    <option key={f.key} value={f.key} className="bg-gray-900">
                        {f.label}
                    </option>
                ))}
            </select>

            {renderInputs()}

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="rounded-lg bg-[#6F42C1] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
                {isLoading ? 'Working...' : result ? 'Regenerate' : 'Generate'}
            </button>

            {featureError && <p className="text-xs text-red-400">{featureError}</p>}

            {result && (
                <div className="flex flex-col gap-2 rounded-lg border border-[#6F42C1]/40 bg-black/20 p-3">
                    <pre className="whitespace-pre-wrap break-words text-xs text-gray-200">{resultText(feature, result)}</pre>
                    <div className="flex flex-wrap gap-2">
                        {canAccept && (
                            <button onClick={handleAccept} className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                                Accept
                            </button>
                        )}
                        <button onClick={handleGenerate} className="rounded bg-[#6F42C1] px-3 py-1 text-xs font-semibold text-white">
                            Regenerate
                        </button>
                        <button
                            onClick={() => copyToClipboard(resultText(feature, result))}
                            className="rounded bg-gray-700 px-3 py-1 text-xs font-semibold text-white"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistantPanel;
