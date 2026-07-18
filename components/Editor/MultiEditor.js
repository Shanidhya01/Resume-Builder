'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { LuPlus } from 'react-icons/lu';
import SectionCard from './SectionCard';
import { addNewIndex, deleteIndex, moveIndex, reorderList, updateResumeValue } from '@/store/slices/resumeSlice';
import ResumeFields from '@/config/ResumeFields';

const MultiEditor = ({ tab }) => {
    const { fields } = ResumeFields[tab];
    const [selectedCard, setSelectedCard] = useState(null);

    const dispatch = useDispatch();
    const resumeData = useSelector(state => state.resume[tab]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleChange = (e, i) => {
        const { name, value } = e.target;
        dispatch(updateResumeValue({ tab, name, value, index: i }));
    };

    const addNew = () => {
        dispatch(addNewIndex({ tab }));
        setSelectedCard(resumeData.length);
    };

    const deleteCard = index => {
        dispatch(deleteIndex({ tab, index }));
        setSelectedCard(null);
    };

    const handleMove = (index, dir) => {
        dispatch(moveIndex({ tab, index, dir }));
        setSelectedCard(prev => {
            if (prev == null) return prev;
            const target = dir === 'up' ? index - 1 : index + 1;
            if (prev === index) return target;
            if (prev === target) return index;
            return prev;
        });
    };

    const handleDragEnd = event => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const from = Number(active.id);
        const to = Number(over.id);
        dispatch(reorderList({ tab, from, to }));
        setSelectedCard(prev => {
            if (prev == null) return prev;
            if (prev === from) return to;
            if (from < prev && to >= prev) return prev - 1;
            if (from > prev && to <= prev) return prev + 1;
            return prev;
        });
    };

    const ids = resumeData.map((_, i) => i);

    return (
        <div>
            <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold capitalize text-fg md:text-base">{tab}</h2>
                    {resumeData.length > 1 && (
                        <p className="mt-0.5 text-xs text-fg-subtle">Drag the handle to reorder, or use the arrow buttons.</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={addNew}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-ds-sm transition-all hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                    <LuPlus /> Add New
                </button>
            </div>

            {resumeData?.length === 0 && (
                <div className="my-16 text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                        <LuPlus className="text-2xl text-accent" />
                    </div>
                    <p className="text-lg font-medium text-fg">No {tab} added yet</p>
                    <p className="mt-1 text-sm text-fg-muted">Click &ldquo;Add New&rdquo; to get started</p>
                </div>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                        {resumeData.map((item, i) => (
                            <SectionCard
                                key={i}
                                id={i}
                                index={i}
                                item={item}
                                fields={fields}
                                count={resumeData.length}
                                isSelected={selectedCard === i}
                                onSelect={setSelectedCard}
                                onCollapse={() => setSelectedCard(null)}
                                onDelete={deleteCard}
                                onMove={handleMove}
                                onChange={handleChange}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default MultiEditor;
