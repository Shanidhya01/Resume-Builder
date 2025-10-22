'use client';

import { useDispatch } from 'react-redux';
import Input from '../UI/Input';
import { useSelector } from 'react-redux';
import { addNewIndex, deleteIndex, moveIndex, updateResumeValue } from '@/store/slices/resumeSlice';
import ResumeFields from '@/config/ResumeFields';
import { LuPlus } from 'react-icons/lu';
import { useState } from 'react';
import { FaArrowUp, FaPencil, FaTrash } from 'react-icons/fa6';
import { FaArrowDown } from 'react-icons/fa';
import { TbArrowsMinimize } from "react-icons/tb";

const MultiEditor = ({ tab }) => {
    const { fields } = ResumeFields[tab];
    const [selectedCard, setSelectedCard] = useState(null);

    const dispatch = useDispatch();
    const resumeData = useSelector(state => state.resume[tab]);

    const handleChange = (e, i) => {
        const { name, value } = e.target;

        dispatch(
            updateResumeValue({
                tab,
                name,
                value,
                index: i,
            }),
        );
    };

    const addNew = () => {
        dispatch(
            addNewIndex({
                tab,
                name: 'degree',
                value: 'new',
            }),
        );

        setSelectedCard(resumeData.length);
    };

    const deleteCard = index => {
        dispatch(deleteIndex({ tab, index }));
        setSelectedCard(null);
    };

    return (
        <div>
            {/* Add New Button */}
            <button 
                type="button" 
                className="group relative btn mb-6 ml-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm 2xl:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border-0" 
                onClick={addNew}
            >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <LuPlus className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                <span className="relative z-10 font-semibold">Add New</span>
            </button>

            {/* Empty State */}
            {resumeData?.length == 0 && (
                <div className="my-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 mb-4">
                        <LuPlus className="text-3xl text-purple-600" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No {tab} added yet</p>
                    <p className="text-gray-400 text-sm mt-2">Click "Add New" to get started</p>
                </div>
            )}

            {/* Cards List */}
            <div className="space-y-4">
                {resumeData.map((e, i) => (
                    <div
                        key={i}
                        className={`group relative card py-4 px-5 transition-all duration-300 cursor-pointer overflow-hidden ${
                            selectedCard === i 
                                ? 'ring-2 ring-purple-500 shadow-xl bg-gradient-to-br from-white to-purple-50/30' 
                                : 'hover:shadow-lg hover:border-purple-300'
                        }`}
                        onClick={_ => setSelectedCard(i)}
                    >
                        {/* Gradient background for selected card */}
                        {selectedCard === i && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-gradient-xy pointer-events-none"></div>
                        )}

                        {/* Card Header */}
                        <div className="relative z-10 flex items-center justify-between gap-3">
                            <span className="mr-auto text-sm md:text-base font-semibold truncate text-gray-800 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${selectedCard === i ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                {Object.values(e)[0] || 'Untitled'}
                            </span>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                {/* Move Up */}
                                <button
                                    disabled={i == 0}
                                    className="p-2 rounded-lg hover:bg-purple-100 text-gray-600 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
                                    onClick={_ => {
                                        _.stopPropagation();
                                        dispatch(moveIndex({ tab, index: i, dir: 'up' }));
                                    }}
                                    title="Move up"
                                >
                                    <FaArrowUp className="text-sm" />
                                </button>

                                {/* Move Down */}
                                <button
                                    disabled={i == resumeData.length - 1}
                                    className="p-2 rounded-lg hover:bg-purple-100 text-gray-600 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
                                    onClick={_ => {
                                        _.stopPropagation();
                                        dispatch(moveIndex({ tab, index: i }));
                                    }}
                                    title="Move down"
                                >
                                    <FaArrowDown className="text-sm" />
                                </button>

                                {/* Expand/Collapse */}
                                {selectedCard == i ?
                                    <button
                                        type="button"
                                        className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-200"
                                        onClick={_ => {
                                            _.stopPropagation();
                                            setSelectedCard(null);
                                        }}
                                        title="Collapse"
                                    >
                                        <TbArrowsMinimize className="text-sm" />
                                    </button>
                                :   <button 
                                        type="button" 
                                        className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-all duration-200"
                                        title="Edit"
                                    >
                                        <FaPencil className="text-sm" />
                                    </button>
                                }

                                {/* Delete */}
                                <button
                                    type="button"
                                    className="p-2 rounded-lg hover:bg-red-100 text-red-500 hover:text-red-600 transition-all duration-200"
                                    onClick={_ => {
                                        _.stopPropagation();
                                        deleteCard(i);
                                    }}
                                    title="Delete"
                                >
                                    <FaTrash className="text-sm" />
                                </button>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {selectedCard == i && (
                            <div className="relative z-10 mt-6 pt-6 border-t border-purple-200/50">
                                <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                                    {fields.map((field, fieldIndex) => (
                                        <div 
                                            key={field.name}
                                            className="animate-fadeIn"
                                            style={{ animationDelay: `${fieldIndex * 40}ms` }}
                                        >
                                            <Input
                                                {...field}
                                                onChange={e => handleChange(e, i)}
                                                value={resumeData[i][field.name]}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes gradient-xy {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 3s ease infinite;
                }
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
                    animation: fadeIn 0.3s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default MultiEditor;