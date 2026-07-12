'use client';

const ConfirmModal = ({ title, description, confirmLabel = 'Confirm', onConfirm, onCancel, danger = false }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="w-full max-w-sm rounded-xl border border-purple-500/30 bg-slate-900 p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
            {description && <p className="mb-6 text-sm text-slate-400">{description}</p>}
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                        danger ? 'bg-red-600 hover:bg-red-500' : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmModal;
