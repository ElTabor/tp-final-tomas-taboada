import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmModal } from '../components/ui/Modal';

interface Owner {
    _id: string;
    fullName: string;
    phone: string;
    address?: string;
}

interface Pet {
    _id: string;
    name: string;
    species: string;
    ownerId: string | any;
}

interface OwnersViewProps {
    owners: Owner[];
    pets: Pet[];
    ownerForm: { fullName: string; phone: string; address: string };
    setOwnerForm: (form: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
    onEdit: (owner: Owner) => void;
    editingId: string | null;
    expandedOwnerId?: string | null;
    setExpandedOwnerId?: (id: string | null) => void;
    onPetClick?: (petId: string) => void;
    onCancel: () => void;
}

export const OwnersView: React.FC<OwnersViewProps> = ({
    owners,
    pets,
    ownerForm,
    setOwnerForm,
    onSubmit,
    onDelete,
    onEdit,
    editingId,
    expandedOwnerId,
    setExpandedOwnerId,
    onPetClick,
    onCancel
}) => {
    const [expandedOwner, setExpandedOwner] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        if (expandedOwnerId) {
            setExpandedOwner(expandedOwnerId);
            const element = document.getElementById(`owner-${expandedOwnerId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            // Clear it after expanding to allow manual toggle later
            if (setExpandedOwnerId) {
                setTimeout(() => setExpandedOwnerId(null), 100);
            }
        }
    }, [expandedOwnerId]);
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

    const toggleExpansion = (ownerId: string) => {
        setExpandedOwner(expandedOwner === ownerId ? null : ownerId);
    };

    const toggleSort = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const filteredOwners = owners.filter(owner =>
        owner.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedOwners = [...filteredOwners].sort((a, b) => {
        const nameA = a.fullName.toLowerCase();
        const nameB = b.fullName.toLowerCase();
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
                title="Delete Owner"
                message="Are you sure you want to delete this owner? This action cannot be undone and will also delete all associated pets and medical records."
                confirmText="Delete Owner"
                isDestructive
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Owners Management</h2>
                    <p className="text-slate-500">Manage your clinic's registered owners and their contact information.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{owners.length} Registered</span>
                </div>
            </div>

            <Card title={editingId ? `Editando Dueño: ${ownerForm.fullName}` : "Register New Owner"}>
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <Input
                        label="Full Name"
                        placeholder="e.g. Alejandro Martinez"
                        value={ownerForm.fullName}
                        onChange={(e) => setOwnerForm({ ...ownerForm, fullName: e.target.value })}
                        required
                    />
                    <Input
                        label="Phone Number"
                        placeholder="e.g. +34 612 345 678"
                        value={ownerForm.phone}
                        onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })}
                        required
                    />
                    <Input
                        label="Address"
                        placeholder="e.g. Calle Principal 123"
                        value={ownerForm.address}
                        onChange={(e) => setOwnerForm({ ...ownerForm, address: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1 mb-0.5" icon={editingId ? "save" : "add"}>
                            {editingId ? "Update" : "Register"}
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
                                            Owner
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
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Address</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {sortedOwners.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        No owners found. Add your first owner above.
                                    </td>
                                </tr>
                            ) : (
                                sortedOwners.map((owner) => {
                                    const ownerPets = pets.filter(p => {
                                        const pOwnerId = typeof p.ownerId === 'object' ? p.ownerId._id : p.ownerId;
                                        return pOwnerId === owner._id;
                                    });
                                    const isExpanded = expandedOwner === owner._id;

                                    return (
                                        <React.Fragment key={owner._id}>
                                            <tr
                                                id={`owner-${owner._id}`}
                                                className={`transition-all cursor-pointer group ${isExpanded ? (expandedOwner === owner._id && !expandedOwnerId ? 'bg-primary/5 dark:bg-primary/10' : 'bg-primary/10 ring-2 ring-primary ring-inset') : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                                onClick={() => toggleExpansion(owner._id)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`material-icons text-primary transition-transform text-sm ${isExpanded ? 'rotate-90' : ''}`}>
                                                            chevron_right
                                                        </span>
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                            {owner.fullName.substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{owner.fullName}</p>
                                                            <p className="text-[10px] text-primary font-medium">{ownerPets.length} {ownerPets.length === 1 ? 'pet' : 'pets'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">
                                                    {owner.phone}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                                                    {owner.address || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => onEdit(owner)}
                                                            className="p-1.5 hover:bg-primary/20 text-slate-600 dark:text-slate-400 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <span className="material-icons text-lg">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteClick(owner._id, e)}
                                                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <span className="material-icons text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-l-4 border-l-primary">
                                                    <td colSpan={4} className="px-6 py-0">
                                                        <div className="py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-12">Pets registered to this owner</p>
                                                            {ownerPets.length === 0 ? (
                                                                <p className="text-sm text-slate-400 ml-12 italic">No pets registered yet.</p>
                                                            ) : (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ml-12 max-w-4xl pb-4">
                                                                    {ownerPets.map(pet => (
                                                                        <div
                                                                            key={pet._id}
                                                                            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group/pet"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (onPetClick) onPetClick(pet._id);
                                                                            }}
                                                                        >
                                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover/pet:bg-primary group-hover/pet:text-white transition-colors">
                                                                                <span className="material-icons text-sm">pets</span>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-bold text-slate-800 dark:text-white group-hover/pet:text-primary transition-colors">{pet.name}</p>
                                                                                <p className="text-[10px] text-slate-500">{pet.species}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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
