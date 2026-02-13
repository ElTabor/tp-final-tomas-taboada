import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface DashboardViewProps {
    stats: {
        owners: number;
        pets: number;
        appointments: number;
    };
    todayRecords: any[];
    nextRecords: any[];
    activities: any[];
}

const StatCard: React.FC<{ icon: string; label: string; value: string; colorClass: string; trend?: string }> = ({
    icon, label, value, colorClass, trend
}) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass}`}>
            <span className="material-icons text-3xl">{icon}</span>
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
            {trend && (
                <p className={`text-xs mt-1 font-semibold flex items-center gap-1 ${trend.startsWith('+') ? 'text-primary' : 'text-slate-400'}`}>
                    <span className="material-icons text-xs">{trend.startsWith('+') ? 'trending_up' : 'info'}</span> {trend}
                </p>
            )}
        </div>
    </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, todayRecords, nextRecords, activities }) => {
    return (
        <div className="space-y-8">
            {/* Dashboard Overview Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Clinic Operations Overview</h2>
                <p className="text-slate-500">Global summary of patients, scheduled appointments, and clinical activity.</p>
            </div>


            {/* Main Grid: Appointments & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Schedule Placeholder */}
                <div className="lg:col-span-2">
                    <Card title="Today's Schedule">
                        <div className="space-y-4">
                            {todayRecords.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <span className="material-icons text-6xl mb-4">calendar_today</span>
                                    <p>No more appointments scheduled for today.</p>
                                </div>
                            ) : (
                                todayRecords.map((record, idx) => (
                                    <div key={record._id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                            <span className="material-icons">event</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-800 dark:text-white truncate">
                                                {typeof record.petId === 'object' ? record.petId.name : 'Unknown Pet'}
                                                <span className="ml-2 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold">
                                                    {record.time || 'N/A'}
                                                </span>
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                With Dr. {typeof record.veterinarianId === 'object' ? record.veterinarianId.fullName : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded">
                                                Today
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-1 italic truncate max-w-[100px]">
                                                {record.description}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card title="Next Appointments" className="mt-8">
                        <div className="space-y-4">
                            {nextRecords.length === 0 ? (
                                <p className="text-center py-8 text-slate-400">No further appointments scheduled.</p>
                            ) : (
                                nextRecords.map((record) => (
                                    <div key={record._id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-50 dark:border-slate-800/50">
                                        <div className="flex flex-col items-center justify-center min-w-[60px] py-1 bg-slate-50 dark:bg-slate-800 rounded">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                {record.date ? new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                                            </p>
                                            <p className="text-xs font-bold text-primary">{record.time || '--:--'}</p>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                                                {(record.petId && typeof record.petId === 'object') ? record.petId.name : 'Pet'}
                                            </p>
                                            <p className="text-[10px] text-slate-500 truncate">
                                                Dr. {(record.veterinarianId && typeof record.veterinarianId === 'object') ? record.veterinarianId.fullName : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Side Actions & Activity */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <StatCard
                            icon="people_outline"
                            label="Total Owners"
                            value={stats.owners.toLocaleString()}
                            colorClass="bg-primary/20 text-primary"
                        />
                        <StatCard
                            icon="pets"
                            label="Registered Pets"
                            value={stats.pets.toLocaleString()}
                            colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                        />
                        <StatCard
                            icon="event_available"
                            label="Today's Appointments"
                            value={stats.appointments.toLocaleString()}
                            colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                        />
                    </div>

                    <Card title="Recent Activity">
                        <div className="space-y-4">
                            {activities.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">No recent activity.</p>
                            ) : (
                                activities.map((activity) => (
                                    <div key={activity.id} className="flex gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${activity.active ? 'bg-primary' : 'bg-slate-300'}`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{activity.label}</p>
                                            <p className="text-[10px] text-slate-400">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
