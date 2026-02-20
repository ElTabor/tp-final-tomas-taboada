import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: string;
    error?: boolean;
    errorText?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon, error, errorText, className = '', type, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

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
                        <span className={`material-icons ${error ? 'text-red-500' : 'text-slate-400'} text-sm`}>{icon}</span>
                    </div>
                )}
                <input
                    type={inputType}
                    className={`block w-full ${icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 bg-slate-50 dark:bg-slate-800 border ${error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-primary/50 focus:border-primary'} rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 transition-all outline-none ${className}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors focus:outline-none"
                    >
                        <span className="material-icons text-sm">
                            {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                )}
            </div>
            {error && errorText && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                    <span className="material-icons text-xs mr-1">error_outline</span>
                    {errorText}
                </p>
            )}
        </div>
    );
};
