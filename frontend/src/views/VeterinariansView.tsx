import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ConfirmModal } from '../components/ui/Modal';

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
    onCancel: () => void;
}

export const VeterinariansView: React.FC<VeterinariansViewProps> = ({
    vets,
    vetForm,
    setVetForm,
    onSubmit,
    onDelete,
    onEdit,
    editingId,
    onCancel
}) => {
    const [deletingId, setDeletingId] = React.useState<string | null>(null);

    return (
        <div className="space-y-8">
            <ConfirmModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={() => {
                    if (deletingId) {
                        onDelete(deletingId);
                        setDeletingId(null);
                    }
                }}
                title="Delete Professional"
                message="Are you sure you want to delete this professional? This action cannot be undone."
                confirmText="Delete Professional"
                isDestructive
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Professionals Management</h2>
                    <p className="text-slate-500">Manage your clinic's veterinary doctors and staff.</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {vets.length} Active Vets
                </span>
            </div>

            <Card title={editingId ? `Editando Profesional: ${vetForm.fullName}` : "Add New Professional"}>
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
                    <Select
                        label="Specialty"
                        icon="medical_services"
                        placeholder="Select Specialty"
                        value={vetForm.specialty}
                        options={[
                            { value: 'Clínica Médica', label: 'Clínica Médica' },
                            { value: 'Cirugía', label: 'Cirugía' },
                            { value: 'Traumatología', label: 'Traumatología' },
                            { value: 'Dermatología', label: 'Dermatología' },
                            { value: 'Cardiología', label: 'Cardiología' }
                        ]}
                        onChange={(val) => setVetForm({ ...vetForm, specialty: val })}
                        required
                    />
                    <div className="md:col-span-2 flex gap-2">
                        <Button type="submit" className="flex-1 mb-0.5" icon={editingId ? "save" : "add"}>
                            {editingId ? "Update" : "Add New"}
                        </Button>
                        {editingId && (
                            <Button variant="ghost" type="button" onClick={onCancel} className="mb-0.5" icon="close">
                                Cancel
                            </Button>
                        )}
                    </div>
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
                                <Button variant="ghost" onClick={() => setDeletingId(vet._id)} icon="delete" className="px-3 py-1.5 text-xs text-red-500 hover:text-red-600">Delete</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
