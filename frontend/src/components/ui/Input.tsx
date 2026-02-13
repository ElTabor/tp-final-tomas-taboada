import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {label} {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-icons text-slate-400 text-sm">{icon}</span>
                    </div>
                )}
                <input
                    className={`block w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none ${className}`}
                    {...props}
                />
            </div>
        </div>
    );
};
