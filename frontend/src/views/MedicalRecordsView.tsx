import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

interface Owner { _id: string; fullName: string; }
interface Pet { _id: string; name: string; ownerId: string | any; }
interface Veterinarian { _id: string; fullName: string; }

interface MedicalRecord {
    _id: string;
    petId: Pet | string;
    veterinarianId: Veterinarian | string;
    date: string;
    time: string;
    description: string;
    createdAt?: string;
}

interface MedicalRecordsViewProps {
    records: MedicalRecord[];
    pets: Pet[];
    vets: Veterinarian[];
    owners: Owner[];
    recordForm: { petId: string; veterinarianId: string; date: string; time: string; description: string; ownerId?: string };
    setRecordForm: (form: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
    onEdit: (record: MedicalRecord) => void;
    editingId: string | null;
}

export const MedicalRecordsView: React.FC<MedicalRecordsViewProps> = ({
    records,
    pets,
    vets,
    owners,
    recordForm,
    setRecordForm,
    onSubmit,
    onDelete,
    onEdit,
    editingId
}) => {
    const [sortBy, setSortBy] = React.useState<string>('date');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
    const [statusFilter, setStatusFilter] = React.useState<'all' | 'pending' | 'completed'>('all');

    const sortedRecords = React.useMemo(() => {
        let filtered = [...records];

        // Filter by Status
        if (statusFilter !== 'all') {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            filtered = filtered.filter(rec => {
                const d = new Date(rec.date); d.setHours(0, 0, 0, 0);
                const isPending = d >= today;
                return statusFilter === 'pending' ? isPending : !isPending;
            });
        }

        return filtered.sort((a, b) => {
            let valA: any = '';
            let valB: any = '';

            const getPetName = (rec: MedicalRecord) => {
                const p = typeof rec.petId === 'object' ? rec.petId : pets.find(pet => pet._id === rec.petId);
                return p?.name || '';
            };

            const getVetName = (rec: MedicalRecord) => {
                const v = typeof rec.veterinarianId === 'object' ? rec.veterinarianId : vets.find(vet => vet._id === rec.veterinarianId);
                return v?.fullName || '';
            };

            switch (sortBy) {
                case 'date':
                    valA = new Date(`${a.date.split('T')[0]}T${a.time || '00:00'}`).getTime();
                    valB = new Date(`${b.date.split('T')[0]}T${b.time || '00:00'}`).getTime();
                    break;
                case 'pet':
                    valA = getPetName(a).toLowerCase();
                    valB = getPetName(b).toLowerCase();
                    break;
                case 'vet':
                    valA = getVetName(a).toLowerCase();
                    valB = getVetName(b).toLowerCase();
                    break;
                case 'created':
                    valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    break;
                default:
                    valA = a.date;
                    valB = b.date;
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [records, sortBy, sortDirection, statusFilter, pets, vets]);

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('asc');
        }
    };

    // Determine which pets to show based on selected owner
    const filteredPets = React.useMemo(() => {
        if (!recordForm.ownerId) return pets;
        return pets.filter(p => {
            const pOwnerId = typeof p.ownerId === 'object' ? p.ownerId._id : p.ownerId;
            return pOwnerId === recordForm.ownerId;
        });
    }, [pets, recordForm.ownerId]);

    const handlePetChange = (petId: string) => {
        const pet = pets.find(p => p._id === petId);
        if (pet) {
            const pOwnerId = typeof pet.ownerId === 'object' ? pet.ownerId._id : pet.ownerId;
            setRecordForm({ ...recordForm, petId, ownerId: pOwnerId });
        } else {
            setRecordForm({ ...recordForm, petId });
        }
    };

    const handleOwnerChange = (ownerId: string) => {
        // If the current selected pet doesn't belong to this owner, clear it
        let newPetId = recordForm.petId;
        if (ownerId && newPetId) {
            const pet = pets.find(p => p._id === newPetId);
            const pOwnerId = pet ? (typeof pet.ownerId === 'object' ? pet.ownerId._id : pet.ownerId) : null;
            if (pOwnerId !== ownerId) newPetId = '';
        }
        setRecordForm({ ...recordForm, ownerId, petId: newPetId });
    };
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Appointments & Records</h2>
                    <p className="text-slate-500">Maintain detailed medical history for every patient.</p>
                </div>
            </div>

            <Card title={editingId ? "Edit Appointment" : "Log New Appointment"}>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Select
                            label="Owner"
                            icon="person"
                            placeholder="Select Owner"
                            value={recordForm.ownerId || ''}
                            options={owners.map(o => ({ value: o._id, label: o.fullName }))}
                            onChange={handleOwnerChange}
                        />
                        <Select
                            label="Pet"
                            icon="pets"
                            placeholder="Select Pet"
                            value={recordForm.petId}
                            options={filteredPets.map(p => ({ value: p._id, label: p.name }))}
                            onChange={handlePetChange}
                            required
                        />
                        <Select
                            label="Professional"
                            icon="medical_services"
                            placeholder="Select Vet"
                            value={recordForm.veterinarianId}
                            options={vets.map(v => ({ value: v._id, label: v.fullName }))}
                            onChange={(val) => setRecordForm({ ...recordForm, veterinarianId: val })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                            <Input
                                type="date"
                                value={recordForm.date}
                                onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Time <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                value={recordForm.time}
                                onChange={(e) => setRecordForm({ ...recordForm, time: e.target.value })}
                                required
                            >
                                <option value="">Select Time</option>
                                {Array.from({ length: 17 }).map((_, i) => {
                                    const h = Math.floor(i / 2) + 9;
                                    const m = (i % 2) * 30;
                                    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                    return <option key={timeStr} value={timeStr}>{timeStr}</option>;
                                })}
                            </select>
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Description (Details & Treatment) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none min-h-[100px] resize-y"
                                placeholder="Log symptoms, clinical findings, diagnosis, or treatment plan..."
                                value={recordForm.description}
                                onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" icon={editingId ? "save" : "add"} className="px-12">
                            {editingId ? "Update Appointment" : "Add Appointment"}
                        </Button>
                    </div>
                </form>
            </Card>


            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                <th className="px-6 py-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('date')}>
                                    <div className="flex items-center gap-2">
                                        Date & Time
                                        {sortBy === 'date' && <span className="material-icons text-xs">{sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
                                    </div>
                                </th>
                                <th className="px-6 py-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('pet')}>
                                    <div className="flex items-center gap-2">
                                        Pet & Owner
                                        {sortBy === 'pet' && <span className="material-icons text-xs">{sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
                                    </div>
                                </th>
                                <th className="px-6 py-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('vet')}>
                                    <div className="flex items-center gap-2">
                                        Professional
                                        {sortBy === 'vet' && <span className="material-icons text-xs">{sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>}
                                    </div>
                                </th>
                                <th className="px-6 py-3">
                                    Description
                                </th>
                                <th className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        Status
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value as any)}
                                            className="ml-1 bg-transparent border-none text-[10px] font-bold text-primary focus:ring-0 cursor-pointer outline-none uppercase"
                                        >
                                            <option value="all">All</option>
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {sortedRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        No medical records found.
                                    </td>
                                </tr>
                            ) : (
                                sortedRecords.map((record) => {
                                    const pet = typeof record.petId === 'object' ? record.petId : pets.find(p => p._id === record.petId);
                                    const vet = typeof record.veterinarianId === 'object' ? record.veterinarianId : vets.find(v => v._id === record.veterinarianId);
                                    const owner = pet ? (typeof pet.ownerId === 'object' ? pet.ownerId : owners.find(o => o._id === pet.ownerId)) : null;

                                    const today = new Date(); today.setHours(0, 0, 0, 0);
                                    const d = new Date(record.date); d.setHours(0, 0, 0, 0);
                                    const isPending = d >= today;

                                    return (
                                        <tr key={record._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800 dark:text-white">
                                                    {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                                                </p>
                                                <p className="text-xs text-primary font-medium flex items-center gap-1">
                                                    <span className="material-icons text-[12px]">schedule</span> {record.time || 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 dark:text-white">{pet?.name || 'Unknown Pet'}</span>
                                                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                        <span className="material-icons text-[10px]">person</span>
                                                        {owner?.fullName || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                                                        {vet?.fullName?.[0] || 'V'}
                                                    </div>
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">{vet?.fullName || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate" title={record.description}>
                                                    {record.description}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isPending ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                    {isPending ? 'Pending' : 'Completed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => onEdit(record)} className="p-1.5 hover:bg-primary/10 rounded-lg text-slate-400 hover:text-primary transition-colors">
                                                        <span className="material-icons text-sm">edit</span>
                                                    </button>
                                                    <button onClick={() => onDelete(record._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                                                        <span className="material-icons text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
