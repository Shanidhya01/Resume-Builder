// PDF exporter — reuses the exact same react-pdf template components that
// power the live editor preview, so an exported PDF is pixel-identical to
// what the user sees in the builder.

import { createElement } from 'react';
import { loadTemplateComponent } from '@/components/Resume/templates/registry';
import { DEFAULT_TEMPLATE_ID } from '@/config/templates';

export async function resumeToPdfBlob(resume) {
    const { pdf } = await import('@react-pdf/renderer');

    const { selectedTemplate, saved, id, name, ownerId, createdAt, updatedAt, ...content } = resume;
    const TemplateComponent = await loadTemplateComponent(selectedTemplate || DEFAULT_TEMPLATE_ID);

    return pdf(createElement(TemplateComponent, { data: content })).toBlob();
}
