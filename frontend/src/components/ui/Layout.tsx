import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onLogout: () => void;
    title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, title }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={onLogout}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopBar title={title} />
                <main className="flex-1 overflow-y-auto p-8 space-y-8 vet-pattern scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};
