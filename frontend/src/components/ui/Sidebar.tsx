import React from 'react';

interface SidebarItemProps {
    icon: string;
    label: string;
    active?: boolean;
    onClick: () => void;
    collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, collapsed }) => (
    <button
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            } ${collapsed ? 'justify-center px-2' : ''}`}
    >
        <span className="material-icons">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
    </button>
);

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onLogout: () => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    userRole?: 'admin' | 'veterinarian' | 'user';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isCollapsed, setIsCollapsed, userRole = 'user' }) => {
    const isVeterinarian = userRole === 'veterinarian';
    const displayRole = userRole === 'admin' ? 'Administrator' : userRole === 'veterinarian' ? 'Veterinarian' : 'User';

    return (
        <aside className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 flex flex-col hidden lg:flex`}>
            <div className={`p-4 flex items-center gap-3 transition-all ${isCollapsed ? 'flex-col justify-center' : 'justify-between'}`}>
                <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                    onClick={() => setActiveTab(isVeterinarian ? 'medicalRecords' : 'dashboard')}
                >
                    <div className="shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="material-icons text-white">pets</span>
                    </div>
                    {!isCollapsed && <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">Patitas Felices</h1>}
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-10 h-10 shrink-0 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary/10 hover:text-primary text-slate-400 rounded-lg flex items-center justify-center transition-all"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <span className="material-icons">
                        {isCollapsed ? 'chevron_right' : 'chevron_left'}
                    </span>
                </button>
            </div>

            <nav className={`flex-1 px-4 py-4 space-y-1 transition-all ${isCollapsed ? 'px-2' : ''}`}>
                {!isVeterinarian && (
                    <>
                        <SidebarItem icon="dashboard" label="Dashboard" collapsed={isCollapsed} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                        <SidebarItem icon="people" label="Owners" collapsed={isCollapsed} active={activeTab === 'owners'} onClick={() => setActiveTab('owners')} />
                        <SidebarItem icon="pets" label="Pets" collapsed={isCollapsed} active={activeTab === 'pets'} onClick={() => setActiveTab('pets')} />
                        <SidebarItem icon="medical_services" label="Professionals" collapsed={isCollapsed} active={activeTab === 'veterinarians'} onClick={() => setActiveTab('veterinarians')} />
                    </>
                )}
                <SidebarItem icon="calendar_today" label="Appointments" collapsed={isCollapsed} active={activeTab === 'medicalRecords'} onClick={() => setActiveTab('medicalRecords')} />
            </nav>

            <div className={`p-4 border-t border-slate-200 dark:border-slate-800 transition-all ${isCollapsed ? 'p-2' : ''}`}>
                <div className={`flex items-center gap-3 p-2 ${isCollapsed ? 'flex-col gap-4' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <span className="material-icons">person</span>
                    </div>
                    {!isCollapsed ? (
                        <>
                            <div className="overflow-hidden flex-1">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{userRole === 'admin' ? 'Admin' : 'Vet'} User</p>
                                <p className="text-xs text-slate-500 truncate">{displayRole}</p>
                            </div>
                            <button onClick={onLogout} className="text-slate-400 hover:text-red-500 shrink-0">
                                <span className="material-icons">logout</span>
                            </button>
                        </>
                    ) : (
                        <button onClick={onLogout} title="Logout" className="text-slate-400 hover:text-red-500">
                            <span className="material-icons">logout</span>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};
