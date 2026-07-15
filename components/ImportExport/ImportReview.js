'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa';
import ResumeFields from '@/config/ResumeFields';
import Card from '@/components/Ats/Card';
import Badge from '@/components/Ats/Badge';

const inputClass =
    'w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

const confidenceTone = score => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Missing';
};

const FieldInput = ({ field, value, onChange, idPrefix }) => {
    const id = `${idPrefix}-${field.name}`;
    if (field.type === 'textarea') {
        return (
            <div className={field.span ? 'sm:col-span-2' : ''}>
                <label htmlFor={id} className="mb-1 block text-xs font-semibold text-fg-muted">
                    {field.label}
                </label>
                <textarea
                    id={id}
                    rows={field.rows || 3}
                    value={value || ''}
                    placeholder={field.placeholder}
                    onChange={e => onChange(e.target.value)}
                    className={inputClass}
                />
            </div>
        );
    }
    return (
        <div className={field.span ? 'sm:col-span-2' : ''}>
            <label htmlFor={id} className="mb-1 block text-xs font-semibold text-fg-muted">
                {field.label}
            </label>
            <input
                id={id}
                type={field.type === 'month' ? 'month' : 'text'}
                value={value || ''}
                placeholder={field.placeholder}
                onChange={e => onChange(e.target.value)}
                className={inputClass}
            />
        </div>
    );
};

// One collapsible, editable section of the parsed resume. Multi-entry sections
// (experience, education, ...) render one sub-card per entry with add/remove.
const SectionEditor = ({ sectionKey, resume, onChange }) => {
    const config = ResumeFields[sectionKey];
    const [open, setOpen] = useState(true);
    if (!config) return null;

    const isMultiple = Boolean(config.multiple);
    const value = resume[sectionKey];
    const entryCount = isMultiple ? (value || []).length : null;

    const setSection = next => onChange({ ...resume, [sectionKey]: next });

    const updateSingleField = (name, fieldValue) => setSection({ ...(value || {}), [name]: fieldValue });
    const updateEntryField = (index, name, fieldValue) => {
        const next = [...(value || [])];
        next[index] = { ...next[index], [name]: fieldValue };
        setSection(next);
    };

    return (
        <div className="rounded-xl border border-line bg-surface">
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                aria-expanded={open}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
                <span className="text-sm font-semibold text-fg">
                    {config.name}
                    {isMultiple && <span className="ml-2 text-xs font-normal text-fg-muted">({entryCount} {entryCount === 1 ? 'entry' : 'entries'})</span>}
                </span>
                {open ? <FaChevronUp className="text-fg-muted" aria-hidden="true" /> : <FaChevronDown className="text-fg-muted" aria-hidden="true" />}
            </button>

            {open && (
                <div className="border-t border-line p-4">
                    {isMultiple ? (
                        <div className="space-y-4">
                            {(value || []).map((entry, index) => (
                                <div key={index} className="rounded-lg border border-line bg-surface-2 p-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-fg-muted">#{index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => setSection((value || []).filter((_, i) => i !== index))}
                                            aria-label={`Remove ${config.name} entry ${index + 1}`}
                                            className="rounded p-1.5 text-red-500 hover:bg-red-500/10"
                                        >
                                            <FaTrash className="h-3 w-3" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {config.fields.map(field => (
                                            <FieldInput
                                                key={field.name}
                                                field={field}
                                                value={entry[field.name]}
                                                idPrefix={`import-${sectionKey}-${index}`}
                                                onChange={v => updateEntryField(index, field.name, v)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setSection([...(value || []), {}])}
                                className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10"
                            >
                                <FaPlus aria-hidden="true" /> Add entry
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {config.fields.map(field => (
                                <FieldInput
                                    key={field.name}
                                    field={field}
                                    value={(value || {})[field.name]}
                                    idPrefix={`import-${sectionKey}`}
                                    onChange={v => updateSingleField(field.name, v)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const SECTION_ORDER = ['contact', 'summary', 'experience', 'education', 'projects', 'skills', 'certificates', 'languages'];

// Review step: original extracted text next to the editable parsed resume,
// with confidence, missing fields, and AI suggestions surfaced above.
const ImportReview = ({ originalText, resume, confidence, missingFields = [], suggestions = [], cleanup = null, onChange }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card title="Parse Confidence">
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-fg">{confidence}%</span>
                    <Badge tone={confidenceTone(confidence)}>{confidenceTone(confidence)}</Badge>
                </div>
                <p className="mt-2 text-xs text-fg-muted">How completely the AI could map your file to structured resume data.</p>
            </Card>

            <Card title={`Missing Fields (${missingFields.length})`}>
                {missingFields.length === 0 ? (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Nothing missing — every section was found.</p>
                ) : (
                    <ul className="flex flex-wrap gap-2" aria-label="Fields missing from the imported resume">
                        {missingFields.map(field => (
                            <li key={field}>
                                <Badge tone="Needs Improvement">{field}</Badge>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <Card title="AI Suggestions">
                {suggestions.length === 0 ? (
                    <p className="text-sm text-fg-muted">No suggestions for this import.</p>
                ) : (
                    <ul className="list-disc space-y-1 pl-4 text-xs text-fg-muted">
                        {suggestions.map((tip, i) => (
                            <li key={i}>{tip}</li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>

        {cleanup && (
            <Card title="AI Cleanup Results">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Changes Applied ({cleanup.changes.length})</h4>
                        {cleanup.changes.length === 0 ? (
                            <p className="text-xs text-fg-muted">No changes were needed.</p>
                        ) : (
                            <ul className="list-disc space-y-1 pl-4 text-xs text-fg-muted">
                                {cleanup.changes.slice(0, 8).map((change, i) => (
                                    <li key={i}>{change}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Detected Missing Skills</h4>
                        {cleanup.missingSkills.length === 0 ? (
                            <p className="text-xs text-fg-muted">None detected.</p>
                        ) : (
                            <ul className="flex flex-wrap gap-1.5">
                                {cleanup.missingSkills.map(skill => (
                                    <li key={skill}>
                                        <Badge>{skill}</Badge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">ATS Recommendations</h4>
                        {cleanup.atsRecommendations.length === 0 ? (
                            <p className="text-xs text-fg-muted">No ATS issues flagged.</p>
                        ) : (
                            <ul className="list-disc space-y-1 pl-4 text-xs text-fg-muted">
                                {cleanup.atsRecommendations.slice(0, 6).map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
                <h3 className="mb-3 text-sm font-semibold text-fg">Original Text</h3>
                <pre
                    tabIndex={0}
                    aria-label="Original text extracted from your file"
                    className="max-h-[36rem] overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-surface-2 p-4 font-mono text-xs leading-relaxed text-fg-muted"
                >
                    {originalText}
                </pre>
            </div>

            <div>
                <h3 className="mb-3 text-sm font-semibold text-fg">Parsed Resume (editable)</h3>
                <div className="max-h-[36rem] space-y-3 overflow-auto pr-1">
                    {SECTION_ORDER.map(key => (
                        <SectionEditor key={key} sectionKey={key} resume={resume} onChange={onChange} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default ImportReview;
