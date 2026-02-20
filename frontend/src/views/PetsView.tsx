import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ConfirmModal } from '../components/ui/Modal';

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
    onCancel: () => void;
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
    setHighlightedPetId,
    onCancel
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

    React.useEffect(() => {
        if (highlightedPetId) {
            const element = document.getElementById(`pet-${highlightedPetId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [highlightedPetId]);

    const toggleSort = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPets = [...filteredPets].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortDirection === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    const [deletingId, setDeletingId] = React.useState<string | null>(null);

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeletingId(id);
    };

    const confirmDelete = () => {
        if (deletingId) {
            onDelete(deletingId);
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8">
            <ConfirmModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Delete Pet"
                message="Are you sure you want to delete this pet? This action cannot be undone and will also delete all associated medical records."
                confirmText="Delete Pet"
                isDestructive
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Pets Management</h2>
                    <p className="text-slate-500">View and manage all registered patients in the clinic.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{pets.length} Registered</span>
                </div>
            </div>

            <Card title={editingId ? `Editando Mascota: ${petForm.name}` : "Register New Pet"}>
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
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
                    <div className="md:col-span-2 flex gap-2">
                        <Button type="submit" className="flex-1 mb-0.5" icon={editingId ? "save" : "add"}>
                            {editingId ? "Update" : "Add Pet"}
                        </Button>
                        {editingId && (
                            <Button variant="ghost" type="button" onClick={onCancel} className="mb-0.5" icon="close">
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </Card>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                <th className="px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group/header"
                                            onClick={toggleSort}
                                        >
                                            Pet
                                            <span className="material-icons text-sm text-primary">
                                                {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                                            </span>
                                        </div>

                                        <div className="relative">
                                            <span className="material-icons absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">search</span>
                                            <input
                                                type="text"
                                                placeholder="Filter..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-7 pr-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary w-24 focus:w-32 transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th className="px-6 py-3">Species</th>
                                <th className="px-6 py-3">Owner</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {sortedPets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        No pets matching "{searchTerm}" found.
                                    </td>
                                </tr>
                            ) : (
                                sortedPets.map((pet) => (
                                    <tr
                                        key={pet._id}
                                        id={`pet-${pet._id}`}
                                        className={`transition-all group hover:bg-slate-50 dark:hover:bg-slate-800/50 ${highlightedPetId === pet._id ? 'bg-primary/10 ring-2 ring-primary ring-inset' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <span className="material-icons text-sm">pets</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{pet.name}</p>
                                                    <p className="text-[10px] text-slate-400">ID: {pet._id.substring(0, 6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">
                                            {pet.species}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => {
                                                    const oId = typeof pet.ownerId === 'object' ? pet.ownerId._id : pet.ownerId;
                                                    if (onOwnerClick) onOwnerClick(oId);
                                                }}
                                                className="text-primary font-medium hover:underline flex items-center gap-1.5"
                                            >
                                                <span className="material-icons text-[14px]">person</span>
                                                {(pet.ownerId && typeof pet.ownerId === 'object')
                                                    ? (pet.ownerId as any).fullName
                                                    : owners.find(o => o._id === pet.ownerId)?.fullName || 'Unknown Owner'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onEdit(pet)} className="p-1.5 hover:bg-primary/20 text-slate-600 dark:text-slate-400 rounded-lg transition-colors">
                                                    <span className="material-icons text-lg">edit</span>
                                                </button>
                                                <button onClick={(e) => handleDeleteClick(pet._id, e)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors">
                                                    <span className="material-icons text-lg">delete</span>
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
