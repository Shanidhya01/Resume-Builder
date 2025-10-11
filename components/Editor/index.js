'use client';

import ResumeFields from '@/config/ResumeFields';
import { FaSave } from 'react-icons/fa';
import SingleEditor from './SingleEditor';
import MultiEditor from './MultiEditor';
import { useDispatch } from 'react-redux';
import { saveResume } from '@/store/slices/resumeSlice';
import { useEffect } from 'react';

const safeSection = t => {
    const key = String(t || 'contact').toLowerCase();
    return ResumeFields[key] || ResumeFields.contact;
};

const Editor = ({ tab }) => {
    const section = safeSection(tab);
    const { multiple = false, fields = [] } = section;
    const dispatch = useDispatch();

    const save = e => {
        e?.preventDefault();
        dispatch(saveResume());
    };

    useEffect(() => {
        const interval = setInterval(save, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <form onSubmit={save} className="card my-8">
                {multiple && <MultiEditor tab={tab} />}
                {!multiple && <SingleEditor tab={tab} />}

                <button type="submit" className="btn-filled ml-auto mt-6 w-full gap-2 px-6 text-center md:w-auto">
                    <span>Save</span> <FaSave />
                </button>
            </form>
        </>
    );
};

export default Editor;
