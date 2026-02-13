import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

interface Owner {
    _id: string;
    fullName: string;
}

interface Pet {
    _id: string;
    name: string;
    species: string;
    birthDate: string;
    ownerId: Owner | string;
}

interface PetsViewProps {
    pets: Pet[];
    owners: Owner[];
    petForm: { name: string; species: string; birthDate: string; ownerId: string };
    setPetForm: (form: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
    onEdit: (pet: Pet) => void;
    editingId: string | null;
    onOwnerClick?: (ownerId: string) => void;
    highlightedPetId?: string | null;
    setHighlightedPetId?: (id: string | null) => void;
}

export const PetsView: React.FC<PetsViewProps> = ({
    pets,
    owners,
    petForm,
    setPetForm,
    onSubmit,
    onDelete,
    onEdit,
    editingId,
    onOwnerClick,
    highlightedPetId,
    setHighlightedPetId
}) => {
    React.useEffect(() => {
        if (highlightedPetId) {
            const element = document.getElementById(`pet-${highlightedPetId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // We keep the highlight but we might want to clear the global state
                // after some time or interaction. For now, staying highlighted is fine.
            }
        }
    }, [highlightedPetId]);
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Pets Management</h2>
                    <p className="text-slate-500">View and manage all registered patients in the clinic.</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    {pets.length} Total Pets
                </span>
            </div>

            <Card title={editingId ? "Edit Pet" : "Register New Pet"}>
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <Input
                        label="Pet Name"
                        placeholder="e.g. Buddy"
                        value={petForm.name}
                        onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Species"
                        placeholder="e.g. Dog"
                        value={petForm.species}
                        onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                        required
                    />
                    <Input
                        label="Birth Date"
                        type="date"
                        value={petForm.birthDate}
                        onChange={(e) => setPetForm({ ...petForm, birthDate: e.target.value })}
                    />
                    <Select
                        label="Owner"
                        icon="person"
                        placeholder="Select Owner"
                        value={petForm.ownerId}
                        options={owners.map(o => ({ value: o._id, label: o.fullName }))}
                        onChange={(val) => setPetForm({ ...petForm, ownerId: val })}
                        required
                    />
                    <Button type="submit" className="w-full mb-0.5" icon={editingId ? "save" : "add"}>
                        {editingId ? "Update Pet" : "Add Pet"}
                    </Button>
                </form>
            </Card>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pet</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Species</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {pets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        No pets registered. Add your first patient above.
                                    </td>
                                </tr>
                            ) : (
                                pets.map((pet) => (
                                    <tr
                                        key={pet._id}
                                        id={`pet-${pet._id}`}
                                        className={`transition-all group ${highlightedPetId === pet._id ? 'bg-primary/10 ring-2 ring-primary ring-inset' : 'hover:bg-primary/5'}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <span className="material-icons">pets</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-100">{pet.name}</p>
                                                    <p className="text-xs text-slate-400">ID: {pet._id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                            {pet.species}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => {
                                                    const oId = typeof pet.ownerId === 'object' ? pet.ownerId._id : pet.ownerId;
                                                    if (onOwnerClick) onOwnerClick(oId);
                                                }}
                                                className="text-primary font-medium hover:underline flex items-center gap-1"
                                            >
                                                <span className="material-icons text-[14px]">person</span>
                                                {(pet.ownerId && typeof pet.ownerId === 'object')
                                                    ? (pet.ownerId as any).fullName
                                                    : owners.find(o => o._id === pet.ownerId)?.fullName || 'Unknown Owner'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onEdit(pet)} className="p-1.5 hover:bg-primary/20 text-slate-600 dark:text-slate-400 rounded-lg transition-colors">
                                                    <span className="material-icons text-xl">edit</span>
                                                </button>
                                                <button onClick={() => onDelete(pet._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors">
                                                    <span className="material-icons text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
