'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, RotateCcw, WandSparkles } from 'lucide-react';
import { updateResumeValue } from '@/store/slices/resumeSlice';
import useAI from '@/hooks/useAI';
import Button from '@/components/UI/Button';

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

const fieldClass =
    'w-full rounded-xl border border-line bg-surface-2 p-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent focus:ring-2 focus:ring-accent/30';

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
    const [copied, setCopied] = useState(false);

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

    const handleCopy = () => {
        const text = resultText(feature, result);
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                })
                .catch(() => {});
        }
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
                <select value={expIndex} onChange={e => setExpIndex(Number(e.target.value))} className={fieldClass}>
                    {(resume.experience || []).map((e, i) => (
                        <option key={i} value={i}>
                            {e.role || e.company || `Entry ${i + 1}`}
                        </option>
                    ))}
                    {(!resume.experience || resume.experience.length === 0) && <option>No experience entries yet</option>}
                </select>
            );
        }
        if (feature === 'projects') {
            return (
                <select value={projIndex} onChange={e => setProjIndex(Number(e.target.value))} className={fieldClass}>
                    {(resume.projects || []).map((p, i) => (
                        <option key={i} value={i}>
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
                    placeholder="Paste text to rewrite or grammar-check…"
                    rows={4}
                    className={fieldClass}
                />
            );
        }
        if (feature === 'coverLetter') {
            return (
                <div className="flex flex-col gap-2">
                    <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Job title" className={fieldClass} />
                    <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" className={fieldClass} />
                    <textarea
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        placeholder="Paste job description…"
                        rows={3}
                        className={fieldClass}
                    />
                </div>
            );
        }
        if (feature === 'jobMatch') {
            return (
                <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste job description…"
                    rows={4}
                    className={fieldClass}
                />
            );
        }
        return (
            <p className="flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-xs text-fg-muted">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
                Uses your current resume data as context automatically.
            </p>
        );
    };

    const canAccept = ['summary', 'experience', 'projects', 'skills', 'rewrite', 'grammar'].includes(feature);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label htmlFor="ai-feature" className="mb-1.5 block text-xs font-medium text-fg-muted">
                    Assistant task
                </label>
                <select id="ai-feature" value={feature} onChange={e => setFeature(e.target.value)} className={`${fieldClass} font-semibold`}>
                    {FEATURES.map(f => (
                        <option key={f.key} value={f.key}>
                            {f.label}
                        </option>
                    ))}
                </select>
            </div>

            {renderInputs()}

            <Button
                onClick={handleGenerate}
                loading={isLoading}
                leftIcon={!isLoading ? <WandSparkles className="h-4 w-4" /> : null}
            >
                {isLoading ? 'Working…' : result ? 'Regenerate' : 'Generate'}
            </Button>

            {featureError && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                    {featureError}
                </p>
            )}

            <AnimatePresence>
                {isLoading && !result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 px-1 py-2 text-sm text-fg-muted"
                        aria-live="polite"
                    >
                        <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-accent" />
                        <span className="ml-1">Generating…</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3 rounded-xl border border-line bg-surface-2 p-3.5"
                >
                    <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-fg">
                        {resultText(feature, result)}
                    </pre>
                    <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                        {canAccept && (
                            <Button variant="success" size="sm" onClick={handleAccept} leftIcon={<Check className="h-3.5 w-3.5" />}>
                                Accept
                            </Button>
                        )}
                        <Button variant="secondary" size="sm" onClick={handleGenerate} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
                            Regenerate
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            leftIcon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        >
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AIAssistantPanel;
