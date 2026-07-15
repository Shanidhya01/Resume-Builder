'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmModal — confirmation dialog built on the design-system Modal.
 * Rendered conditionally by the parent (present === open).
 */
const ConfirmModal = ({ title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger = false }) => (
    <Modal
        open
        onClose={onCancel}
        size="sm"
        showClose={false}
        footer={
            <>
                <Button variant="ghost" size="md" onClick={onCancel}>
                    {cancelLabel}
                </Button>
                <Button variant={danger ? 'danger' : 'primary'} size="md" onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </>
        }
    >
        <div className="flex gap-4">
            {danger && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                </span>
            )}
            <div className="min-w-0">
                <h2 className="text-base font-semibold text-fg">{title}</h2>
                {description && <p className="mt-1.5 text-sm text-fg-muted">{description}</p>}
            </div>
        </div>
    </Modal>
);

export default ConfirmModal;
