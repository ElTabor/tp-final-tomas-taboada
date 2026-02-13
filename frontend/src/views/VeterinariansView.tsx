import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Veterinarian {
    _id: string;
    fullName: string;
    licenseNumber: string;
    specialty: string;
}

interface VeterinariansViewProps {
    vets: Veterinarian[];
    vetForm: { fullName: string; licenseNumber: string; specialty: string };
    setVetForm: (form: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
    onEdit: (vet: Veterinarian) => void;
    editingId: string | null;
}

export const VeterinariansView: React.FC<VeterinariansViewProps> = ({
    vets,
    vetForm,
    setVetForm,
    onSubmit,
    onDelete,
    onEdit,
    editingId
}) => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Professionals Management</h2>
                    <p className="text-slate-500">Manage your clinic's veterinary doctors and staff.</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {vets.length} Active Vets
                </span>
            </div>

            <Card title={editingId ? "Edit Professional" : "Add New Professional"}>
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <Input
                        label="Full Name"
                        placeholder="e.g. Julian Smith"
                        value={vetForm.fullName}
                        onChange={(e) => setVetForm({ ...vetForm, fullName: e.target.value })}
                        required
                    />
                    <Input
                        label="License #"
                        placeholder="e.g. VET-12345"
                        value={vetForm.licenseNumber}
                        onChange={(e) => setVetForm({ ...vetForm, licenseNumber: e.target.value })}
                        required
                    />
                    <Input
                        label="Specialty"
                        placeholder="e.g. Surgery"
                        value={vetForm.specialty}
                        onChange={(e) => setVetForm({ ...vetForm, specialty: e.target.value })}
                        required
                    />
                    <Button type="submit" className="w-full mb-0.5" icon={editingId ? "save" : "add"}>
                        {editingId ? "Update Professional" : "Add Professional"}
                    </Button>
                </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vets.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        No professionals registered yet.
                    </div>
                ) : (
                    vets.map((vet) => (
                        <div key={vet._id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col group relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                    {vet.fullName[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white capitalize">{vet.fullName}</h3>
                                    <p className="text-xs text-primary font-semibold uppercase tracking-wider">{vet.specialty}</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4 flex-1">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className="material-icons text-sm">badge</span>
                                    <span>License: {vet.licenseNumber}</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Button variant="ghost" onClick={() => onEdit(vet)} icon="edit" className="px-3 py-1.5 text-xs">Edit</Button>
                                <Button variant="ghost" onClick={() => onDelete(vet._id)} icon="delete" className="px-3 py-1.5 text-xs text-red-500 hover:text-red-600">Delete</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
