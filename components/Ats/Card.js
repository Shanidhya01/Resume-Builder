'use client';

const Card = ({ title, action, children, className = '' }) => (
    <div className={`rounded-2xl border border-line bg-surface p-5 shadow-ds-sm ${className}`}>
        {(title || action) && (
            <div className="mb-4 flex items-center justify-between gap-3">
                {title && <h3 className="text-sm font-semibold text-fg">{title}</h3>}
                {action}
            </div>
        )}
        {children}
    </div>
);

export default Card;
