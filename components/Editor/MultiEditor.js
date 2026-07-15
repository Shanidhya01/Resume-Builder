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
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LuPlus } from 'react-icons/lu';
import { FaArrowUp, FaPencil, FaTrash } from 'react-icons/fa6';
import { FaArrowDown } from 'react-icons/fa';
import { TbArrowsMinimize } from 'react-icons/tb';
import { MdDragIndicator } from 'react-icons/md';
import Input from '../UI/Input';
import { addNewIndex, deleteIndex, moveIndex, reorderList, updateResumeValue } from '@/store/slices/resumeSlice';
import ResumeFields from '@/config/ResumeFields';

/** One draggable, expandable entry card. */
const SortableCard = ({ id, index, item, fields, isSelected, count, onSelect, onCollapse, onDelete, onMove, onChange }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative rounded-xl border bg-surface px-4 py-4 shadow-sm transition-colors ${
                isSelected ? 'border-accent ring-1 ring-accent' : 'border-line hover:border-accent/40'
            } ${isDragging ? 'opacity-80 shadow-lg' : ''}`}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    {/* Drag handle */}
                    <button
                        type="button"
                        className="cursor-grab touch-none rounded-md p-1 text-fg-muted hover:bg-surface-2 hover:text-fg active:cursor-grabbing"
                        aria-label={`Drag to reorder (item ${index + 1} of ${count})`}
                        {...attributes}
                        {...listeners}
                    >
                        <MdDragIndicator className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => (isSelected ? onCollapse() : onSelect(index))}
                        className="flex min-w-0 items-center gap-2 text-left text-sm font-semibold text-fg md:text-base"
                    >
                        <span className={`h-2 w-2 shrink-0 rounded-full ${isSelected ? 'bg-accent' : 'bg-fg-muted/40'}`} />
                        <span className="truncate">{Object.values(item)[0] || 'Untitled'}</span>
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={index === 0}
                        className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        onClick={() => onMove(index, 'up')}
                        title="Move up"
                        aria-label="Move item up"
                    >
                        <FaArrowUp className="text-sm" />
                    </button>
                    <button
                        type="button"
                        disabled={index === count - 1}
                        className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        onClick={() => onMove(index, 'down')}
                        title="Move down"
                        aria-label="Move item down"
                    >
                        <FaArrowDown className="text-sm" />
                    </button>
                    <button
                        type="button"
                        className="rounded-lg p-2 text-accent transition-colors hover:bg-accent/10"
                        onClick={() => (isSelected ? onCollapse() : onSelect(index))}
                        title={isSelected ? 'Collapse' : 'Edit'}
                        aria-label={isSelected ? 'Collapse item' : 'Edit item'}
                        aria-expanded={isSelected}
                    >
                        {isSelected ? <TbArrowsMinimize className="text-sm" /> : <FaPencil className="text-sm" />}
                    </button>
                    <button
                        type="button"
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10"
                        onClick={() => onDelete(index)}
                        title="Delete"
                        aria-label="Delete item"
                    >
                        <FaTrash className="text-sm" />
                    </button>
                </div>
            </div>

            {isSelected && (
                <div className="mt-5 border-t border-line pt-5">
                    <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                        {fields.map(field => (
                            <Input key={field.name} {...field} onChange={e => onChange(e, index)} value={item[field.name]} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

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
            <button
                type="button"
                onClick={addNew}
                className="mb-6 ml-auto flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-sm transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
                <LuPlus /> Add New
            </button>

            {resumeData?.length === 0 && (
                <div className="my-16 text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                        <LuPlus className="text-2xl text-accent" />
                    </div>
                    <p className="text-lg font-medium text-fg">No {tab} added yet</p>
                    <p className="mt-1 text-sm text-fg-muted">Click &ldquo;Add New&rdquo; to get started</p>
                </div>
            )}

            {resumeData.length > 1 && (
                <p className="mb-3 text-xs text-fg-muted">Drag the handle to reorder, or use the arrow buttons.</p>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                        {resumeData.map((item, i) => (
                            <SortableCard
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
