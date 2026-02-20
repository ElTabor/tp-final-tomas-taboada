import React, { useEffect, useState } from 'react';

interface TopBarProps {
    title: string;
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onLogout: () => void;
    userRole?: 'admin' | 'veterinarian' | 'user';
}

export const TopBar: React.FC<TopBarProps> = ({ title, activeTab, setActiveTab, onLogout, userRole = 'user' }) => {
    // Dark Mode Logic
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Tabs - No filtering, everyone sees everything
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'owners', label: 'Owners', icon: 'people' },
        { id: 'pets', label: 'Pets', icon: 'pets' },
        { id: 'veterinarians', label: 'Professionals', icon: 'medical_services' },
        { id: 'medicalRecords', label: 'Appointments', icon: 'calendar_today' },
    ];

    return (
        <header className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-20 flex flex-col">
            {/* Top Row: Title & User Actions */}
            <div className="h-16 px-4 sm:px-8 flex items-center justify-between">
                {/* Left Spacer for centering */}
                <div className="w-1/3 flex items-center">
                    {/* Optional: Add a small logo or back button here if needed in future */}
                </div>

                {/* Center: Clinic Name */}
                <div className="flex-1 flex justify-center">
                    <h1 className="text-3xl font-bold tracking-tight text-primary text-center truncate font-logo">
                        Patitas Felices
                    </h1>
                </div>

                {/* Right: User Profile / Logout */}
                <div className="w-1/3 flex items-center justify-end gap-3 sm:gap-4">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors bg-slate-50 dark:bg-slate-800/50"
                        title="Logout"
                    >
                        <span className="material-icons">logout</span>
                    </button>
                </div>
            </div>

            {/* Bottom Row: Navigation Tabs */}
            <div className="px-4 sm:px-8 border-t border-slate-100 dark:border-slate-800/50">
                <nav className="flex space-x-1 sm:space-x-6 overflow-x-auto no-scrollbar justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                group flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap outline-none
                                ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
                                }
                            `}
                        >
                            <span className={`material-icons text-lg transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
};
