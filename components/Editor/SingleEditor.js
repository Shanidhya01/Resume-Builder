'use client';

import { useDispatch } from 'react-redux';
import Input from '../UI/Input';
import { useSelector } from 'react-redux';
import { updateResumeValue } from '@/store/slices/resumeSlice';
import ResumeFields from '@/config/ResumeFields';

const SingleEditor = ({ tab }) => {
    const { fields } = ResumeFields[tab];

    const dispatch = useDispatch();
    const resumeData = useSelector(state => state.resume[tab]);

    const handleChange = e => {
        const { name, value } = e.target;

        dispatch(
            updateResumeValue({
                tab,
                name,
                value,
            }),
        );
    };

    return (
        <div className="relative">
            {/* Decorative corner accents */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-purple-400/30 rounded-tl-xl"></div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-purple-400/30 rounded-br-xl"></div>
            
            <div className="grid md:grid-cols-2 gap-5 md:gap-7 md:gap-x-8 p-1">
                {fields.map((field, index) => (
                    <div 
                        key={field.name}
                        className="animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <Input 
                            {...field} 
                            onChange={handleChange} 
                            value={resumeData?.[field?.name]} 
                        />
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default SingleEditor;