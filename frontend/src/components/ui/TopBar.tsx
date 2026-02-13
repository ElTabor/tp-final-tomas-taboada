import React from 'react';

interface TopBarProps {
    title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
    return (
        <header className="h-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 cursor-not-allowed opacity-60" title="Settings (Coming Soon)">
                    <span className="material-icons text-sm">settings</span>
                </div>
            </div>
        </header>
    );
};
