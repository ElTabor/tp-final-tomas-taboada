import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger' | 'inactive';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    ...props
}) => {
    const baseStyles = "flex items-center justify-center gap-2 rounded-lg font-semibold transition-all transform active:scale-[0.98]";

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    const variants = {
        primary: "bg-primary hover:bg-opacity-90 text-white shadow-lg shadow-primary/20",
        ghost: "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
        danger: "bg-red-500 hover:bg-red-600 text-white",
        inactive: "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed pointer-events-none opacity-60"
    };

    return (
        <button className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
            {icon && <span className={`material-icons ${size === 'lg' ? 'text-xl' : 'text-sm'}`}>{icon}</span>}
            {children}
        </button>
    );
};
