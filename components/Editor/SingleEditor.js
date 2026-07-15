'use client';

import { motion } from 'framer-motion';
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
        <div className="grid gap-5 p-1 md:grid-cols-2 md:gap-x-8 md:gap-y-7">
            {fields.map((field, index) => (
                <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className={field.span ? 'md:col-span-2' : ''}
                >
                    <Input {...field} onChange={handleChange} value={resumeData?.[field?.name]} />
                </motion.div>
            ))}
        </div>
    );
};

export default SingleEditor;