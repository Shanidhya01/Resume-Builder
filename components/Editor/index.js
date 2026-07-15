'use client';

import ResumeFields from '@/config/ResumeFields';
import { Save } from 'lucide-react';
import SingleEditor from './SingleEditor';
import MultiEditor from './MultiEditor';
import { useDispatch } from 'react-redux';
import { saveResume } from '@/store/slices/resumeSlice';
import { useCallback, useEffect, useState } from 'react';
import Button from '@/components/UI/Button';

const Editor = ({ tab }) => {
    const { multiple } = ResumeFields[tab];
    const dispatch = useDispatch();
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved

    // Stable identity (dispatch never changes) so the auto-save interval
    // effect below can depend on it without re-registering every render.
    const save = useCallback(
        e => {
            e?.preventDefault();
            setSaveStatus('saving');
            dispatch(saveResume());

            setTimeout(() => {
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            }, 500);
        },
        [dispatch]
    );

    useEffect(() => {
        const interval = setInterval(save, 10000);
        return () => clearInterval(interval);
    }, [save]);

    const statusDot =
        saveStatus === 'saving'
            ? 'bg-amber-500 animate-pulse'
            : saveStatus === 'saved'
              ? 'bg-emerald-500'
              : 'bg-fg-subtle';

    return (
        <form onSubmit={save}>
            {multiple && <MultiEditor tab={tab} />}
            {!multiple && <SingleEditor tab={tab} />}

            <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                {/* Auto-save indicator */}
                <div className="flex items-center gap-2 text-sm text-fg-muted">
                    <span className={`h-2 w-2 rounded-full transition-colors duration-300 ${statusDot}`} />
                    <span className="hidden sm:inline">
                        {saveStatus === 'saving'
                            ? 'Saving…'
                            : saveStatus === 'saved'
                              ? 'All changes saved'
                              : 'Auto-save enabled'}
                    </span>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="ml-auto"
                    loading={saveStatus === 'saving'}
                    rightIcon={<Save className="h-4 w-4" />}
                >
                    {saveStatus === 'saving' ? 'Saving…' : 'Save changes'}
                </Button>
            </div>
        </form>
    );
};

export default Editor;
