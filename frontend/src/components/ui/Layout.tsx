import React from 'react';
import { TopBar } from './TopBar';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onLogout: () => void;
    title: string;
    userRole?: 'admin' | 'veterinarian' | 'user';
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, title, userRole }) => {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <TopBar
                title={title}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={onLogout}
                userRole={userRole}
            />
            <main className="flex-1 overflow-y-auto p-8 space-y-8 vet-pattern scroll-smooth">
                {children}
            </main>
        </div>
    );
};
