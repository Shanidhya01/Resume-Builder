'use client';

const Card = ({ title, action, children, className = '' }) => (
    <div className={`rounded-xl border border-purple-500/20 bg-slate-900/40 p-5 shadow-lg ${className}`}>
        {(title || action) && (
            <div className="mb-4 flex items-center justify-between">
                {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
                {action}
            </div>
        )}
        {children}
    </div>
);

export default Card;
