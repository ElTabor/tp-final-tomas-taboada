import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '', headerAction }) => {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative ${className}`}>
            {(title || subtitle || headerAction) && (
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        {title && <h3 className="font-bold text-lg text-slate-800 dark:text-white">{title}</h3>}
                        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    </div>
                    {headerAction}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
