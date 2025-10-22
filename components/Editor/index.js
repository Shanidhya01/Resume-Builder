'use client';

import ResumeFields from '@/config/ResumeFields';
import { FaSave } from 'react-icons/fa';
import SingleEditor from './SingleEditor';
import MultiEditor from './MultiEditor';
import { useDispatch } from 'react-redux';
import { saveResume } from '@/store/slices/resumeSlice';
import { useEffect, useState } from 'react';

const Editor = ({ tab }) => {
    const { multiple } = ResumeFields[tab];
    const dispatch = useDispatch();
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved

    const save = e => {
        e?.preventDefault();
        setSaveStatus('saving');
        dispatch(saveResume());
        
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
    };

    useEffect(() => {
        const interval = setInterval(save, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="relative my-8">
                {/* Ambient glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-50"></div>
                
                <form onSubmit={save} className="relative card">
                    {multiple && <MultiEditor tab={tab} />}
                    {!multiple && <SingleEditor tab={tab} />}

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-purple-200/50">
                        {/* Auto-save indicator */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' :
                                saveStatus === 'saved' ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            <span className="hidden sm:inline">
                                {saveStatus === 'saving' ? 'Saving...' :
                                 saveStatus === 'saved' ? 'All changes saved' : 'Auto-save enabled'}
                            </span>
                        </div>

                        {/* Save button */}
                        <button 
                            type="submit" 
                            className="group relative btn-filled ml-auto gap-2 px-8 py-3 text-center overflow-hidden"
                            disabled={saveStatus === 'saving'}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                            <span className="relative z-10 font-semibold">
                                {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                            </span>
                            <FaSave className={`relative z-10 transition-transform duration-300 ${
                                saveStatus === 'saving' ? 'animate-pulse' : 'group-hover:scale-110'
                            }`} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Editor;