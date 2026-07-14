// Versioned JSON backup format for full account backups and single-resume
// exports, plus validation for restore/import. Backups are plain JSON files
// generated in the browser — nothing is stored server-side.

import { normalizeImportedResume, isResumeEmpty } from '@/lib/import/normalize';
import { DEFAULT_TEMPLATE_ID, isValidTemplateId } from '@/config/templates';

export const BACKUP_FORMAT = 'hireready-backup';
export const BACKUP_VERSION = 1;

const RESUME_FIELD_KEYS = ['contact', 'summary', 'education', 'experience', 'projects', 'skills', 'certificates', 'languages'];

// Strips Firestore metadata (timestamps, ownerId, sharing state) down to
// portable resume content.
export const toPortableResume = resume => {
    const fields = normalizeImportedResume(resume);
    return {
        name: typeof resume?.name === 'string' ? resume.name : 'Untitled Resume',
        selectedTemplate: isValidTemplateId(resume?.selectedTemplate) ? resume.selectedTemplate : DEFAULT_TEMPLATE_ID,
        ...fields,
    };
};

export function createBackupObject(resumes) {
    return {
        format: BACKUP_FORMAT,
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        app: 'HireReady',
        resumeCount: (resumes || []).length,
        resumes: (resumes || []).map(toPortableResume),
    };
}

export class BackupValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BackupValidationError';
    }
}

// Accepts three shapes of JSON import, in order of preference:
//   1. A full HireReady backup ({ format: 'hireready-backup', resumes: [...] })
//   2. A single portable resume object (our schema)
//   3. A jsonresume.org-style object (mapped through the same normalizer)
// Returns { kind: 'backup' | 'resume', resumes: [portableResume, ...] }.
export function parseBackupJson(jsonText) {
    let data;
    try {
        data = JSON.parse(jsonText);
    } catch (err) {
        throw new BackupValidationError('This file is not valid JSON.');
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new BackupValidationError('This JSON file does not contain resume data.');
    }

    if (data.format === BACKUP_FORMAT) {
        if (typeof data.version !== 'number' || data.version > BACKUP_VERSION) {
            throw new BackupValidationError('This backup was created by a newer version of the app.');
        }
        if (!Array.isArray(data.resumes) || data.resumes.length === 0) {
            throw new BackupValidationError('This backup contains no resumes.');
        }
        const resumes = data.resumes.map(toPortableResume).filter(r => !isResumeEmpty(r));
        if (resumes.length === 0) {
            throw new BackupValidationError('This backup contains no usable resume content.');
        }
        return { kind: 'backup', version: data.version, exportedAt: data.exportedAt || null, resumes };
    }

    // Map jsonresume.org basics into our contact shape before normalizing.
    const candidate = data.basics
        ? {
              ...data,
              contact: {
                  name: data.basics.name,
                  title: data.basics.label,
                  email: data.basics.email,
                  phone: data.basics.phone,
                  address: data.basics.location?.city
                      ? [data.basics.location.city, data.basics.location.countryCode].filter(Boolean).join(', ')
                      : '',
                  portfolio: data.basics.url,
              },
              summary: { summary: data.basics.summary || data.summary?.summary || '' },
          }
        : data;

    const portable = toPortableResume(candidate);
    if (isResumeEmpty(portable)) {
        throw new BackupValidationError('Could not find any resume content in this JSON file.');
    }
    return { kind: 'resume', version: null, exportedAt: null, resumes: [portable] };
}

// Extracts just the Firestore-updatable content fields from a portable resume.
export const portableToFields = portable => {
    const fields = {};
    for (const key of RESUME_FIELD_KEYS) fields[key] = portable[key];
    return fields;
};
