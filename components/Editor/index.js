'use client';

import ResumeFields from '@/config/ResumeFields';
import SingleEditor from './SingleEditor';
import MultiEditor from './MultiEditor';
import SummaryEditor from './SummaryEditor';

// The real (Firestore) autosave lives in `hooks/useAutoSave.js`, wired at the
// page level — this component only picks which form to render for the
// active section. It used to also run its own vestigial 10s local-save
// interval and status dot; that never touched Firestore and has been removed
// in favor of the single real `SaveStatusPill` in the editor's TopBar.
const Editor = ({ tab }) => {
    const { multiple } = ResumeFields[tab];

    if (multiple) return <MultiEditor tab={tab} />;
    if (tab === 'summary') return <SummaryEditor />;
    return <SingleEditor tab={tab} />;
};

export default Editor;
