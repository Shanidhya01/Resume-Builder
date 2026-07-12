const EmptyState = ({ title, description, actionLabel, onAction, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-purple-500/30 py-16 px-6 text-center">
        {Icon && <Icon className="w-12 h-12 text-purple-400" />}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="max-w-sm text-sm text-slate-400">{description}</p>}
        {actionLabel && onAction && (
            <button
                onClick={onAction}
                className="mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/60"
            >
                {actionLabel}
            </button>
        )}
    </div>
);

export default EmptyState;
