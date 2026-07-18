'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaArrowUp, FaPencil, FaTrash } from 'react-icons/fa6';
import { FaArrowDown } from 'react-icons/fa';
import { TbArrowsMinimize } from 'react-icons/tb';
import { MdDragIndicator } from 'react-icons/md';
import Input from '../UI/Input';

/**
 * One draggable, expandable entry card for a repeatable section
 * (Experience/Education/Projects/Certificates/Languages). Purely
 * presentational — all mutation logic (dispatches, drag-end reordering)
 * lives in `MultiEditor.js`, which owns the dnd-kit `DndContext`.
 */
const SectionCard = ({ id, index, item, fields, isSelected, count, onSelect, onCollapse, onDelete, onMove, onChange }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : undefined,
    };

    const title = Object.values(item)[0] || 'Untitled';

    return (
        <motion.div
            layout
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-b from-surface-2/40 to-surface px-4 py-4 shadow-ds-sm transition-colors ${
                isSelected ? 'border-accent ring-1 ring-accent' : 'border-line hover:border-accent/40'
            } ${isDragging ? 'opacity-80 shadow-ds-lg' : ''}`}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
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
                        <span className="truncate">{title}</span>
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

            <AnimatePresence initial={false}>
                {isSelected && (
                    <motion.div
                        key="fields"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className="mt-5 border-t border-line pt-5">
                            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                                {fields.map(field => (
                                    <Input key={field.name} {...field} onChange={e => onChange(e, index)} value={item[field.name]} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SectionCard;
