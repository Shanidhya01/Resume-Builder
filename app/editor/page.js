import { redirect } from 'next/navigation';

// The legacy localStorage-only editor has been retired. Every resume now lives
// in Firestore and is edited at /editor/[resumeId]. Anyone landing on the bare
// /editor route is funnelled into the production create flow on the dashboard,
// which provisions a Firestore document and redirects into the real editor.
export default function LegacyEditorRedirect() {
    redirect('/dashboard?create=true');
}
