import React, { useState, useEffect } from 'react';
import axios from 'axios';

// UI Components
import { Layout } from './components/ui/Layout';

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { OwnersView } from './views/OwnersView';
import { PetsView } from './views/PetsView';
import { VeterinariansView } from './views/VeterinariansView';
import { MedicalRecordsView } from './views/MedicalRecordsView';

// Types

interface Owner { _id: string; fullName: string; phone: string; address?: string; }
interface Pet { _id: string; name: string; species: string; birthDate: string; ownerId: Owner | string; }
interface Veterinarian { _id: string; fullName: string; licenseNumber: string; specialty: string; }
interface MedicalRecord { _id: string; petId: Pet | string; veterinarianId: Veterinarian | string; date: string; time: string; description: string; createdAt?: string; }
interface Activity { id: string; label: string; time: string; active?: boolean; }
interface User { token: string; role: 'admin' | 'veterinarian' | 'user'; }

type Tab = 'dashboard' | 'owners' | 'pets' | 'veterinarians' | 'medicalRecords';

function App() {
    // Data States
    const [owners, setOwners] = useState<Owner[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [expandedOwnerId, setExpandedOwnerId] = useState<string | null>(null);
    const [highlightedPetId, setHighlightedPetId] = useState<string | null>(null);

    // App Control States
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string | null>(null);

    // Form States
    const [editingId, setEditingId] = useState<string | null>(null);
    const [ownerForm, setOwnerForm] = useState({ fullName: '', phone: '', address: '' });
    const [petForm, setPetForm] = useState({ name: '', species: '', birthDate: '', ownerId: '' });
    const [vetForm, setVetForm] = useState({ fullName: '', licenseNumber: '', specialty: '' });
    const [recordForm, setRecordForm] = useState({ petId: '', veterinarianId: '', date: '', time: '', description: '', ownerId: '' });
    const [activities, setActivities] = useState<Activity[]>([]);

    const addActivity = (label: string) => {
        const newActivity: Activity = {
            id: Date.now().toString(),
            label,
            time: 'Just now',
            active: true
        };
        setActivities(prev => [newActivity, ...prev].slice(0, 10));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role') as 'admin' | 'veterinarian' | 'user' | null;
        if (token && role) {
            setUser({ token, role });
            loadAllData(token);
        } else {
            setLoading(false);
        }
    }, []);

    const loadAllData = async (token: string) => {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            // Load all data regardless of role
            const [o, p, v, m] = await Promise.all([
                axios.get('/api/owners', config).catch(() => ({ data: [] })),
                axios.get('/api/pets', config).catch(() => ({ data: [] })),
                axios.get('/api/veterinarians', config).catch(() => ({ data: [] })),
                axios.get('/api/medical-records', config).catch(() => ({ data: [] }))
            ]);
            setOwners(o.data);
            setPets(p.data);
            setVeterinarians(v.data);
            setMedicalRecords(m.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoginError(null);
            const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const res = await axios.post<{ accessToken: string; role?: string }>(endpoint, { email, password });
            const token = res.data.accessToken;
            const role = res.data.role || 'user';
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                setUser({ token, role: role as 'admin' | 'veterinarian' | 'user' });
                await loadAllData(token);
                setActiveTab('dashboard');
                // Removed login activity log
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Auth failed';
            setLoginError(errorMsg);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setActiveTab('dashboard');
    };

    // --- SHARED HANDLERS ---

    // Owner Handlers
    const handleOwnerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${user!.token}` } };
        try {
            if (editingId) {
                const res = await axios.patch(`/api/owners/${editingId}`, ownerForm, config);
                setOwners(owners.map(o => o._id === editingId ? res.data : o));
            } else {
                const res = await axios.post('/api/owners', ownerForm, config);
                setOwners([...owners, res.data]);
                addActivity(`New owner registered: ${res.data.fullName}`);
            }
            setOwnerForm({ fullName: '', phone: '', address: '' });
            setEditingId(null);
        } catch (err: any) {
            console.error(err);
            alert("Error saving owner: " + (err.response?.data?.message || err.message));
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setOwnerForm({ fullName: '', phone: '', address: '' });
        setPetForm({ name: '', species: '', birthDate: '', ownerId: '' });
        setVetForm({ fullName: '', licenseNumber: '', specialty: '' });
        setRecordForm({ petId: '', veterinarianId: '', date: '', time: '', description: '', ownerId: '' });
    };

    const scrollToForm = () => {
        const formElement = document.querySelector('form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const deleteOwner = async (id: string) => {
        if (!user || !window.confirm("Are you sure? All related records will be lost.")) return;
        try {
            await axios.delete(`/api/owners/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });

            // Re-fetch all data to ensure consistent UI OR filter manually
            // Manual filter for instant feedback:
            const petsToDelete = pets.filter(p => (typeof p.ownerId === 'string' ? p.ownerId : p.ownerId._id) === id);
            const petIdsToDelete = petsToDelete.map(p => p._id);

            setOwners(owners.filter(o => o._id !== id));
            setPets(pets.filter(p => (typeof p.ownerId === 'string' ? p.ownerId : p.ownerId._id) !== id));
            setMedicalRecords(medicalRecords.filter(m => {
                const pId = typeof m.petId === 'string' ? m.petId : m.petId._id;
                return !petIdsToDelete.includes(pId);
            }));

        } catch (err: any) {
            console.error(err);
            alert("Error deleting owner: " + (err.response?.data?.message || err.message));
        }
    };

    // Pet Handlers
    const handlePetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${user!.token}` } };
        try {
            if (editingId) {
                const res = await axios.patch(`/api/pets/${editingId}`, petForm, config);
                setPets(pets.map(p => p._id === editingId ? res.data : p));
            } else {
                const res = await axios.post('/api/pets', petForm, config);
                setPets([...pets, res.data]);
                addActivity(`New pet registered: ${res.data.name}`);
            }
            setPetForm({ name: '', species: '', birthDate: '', ownerId: '' });
            setEditingId(null);
        } catch (err: any) {
            console.error(err);
            alert("Error saving pet: " + (err.response?.data?.message || err.message));
        }
    };

    const deletePet = async (id: string) => {
        if (!user || !window.confirm("Delete this patient?")) return;
        try {
            await axios.delete(`/api/pets/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
            setPets(pets.filter(p => p._id !== id));
            setMedicalRecords(medicalRecords.filter(m => {
                const petId = typeof m.petId === 'string' ? m.petId : m.petId._id;
                return petId !== id;
            }));
        } catch (err: any) {
            console.error(err);
            alert("Error deleting pet: " + (err.response?.data?.message || err.message));
        }
    };

    // Vet Handlers
    const handleVetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${user!.token}` } };
        try {
            if (editingId) {
                const res = await axios.patch(`/api/veterinarians/${editingId}`, vetForm, config);
                setVeterinarians(veterinarians.map(v => v._id === editingId ? res.data : v));
            } else {
                const res = await axios.post('/api/veterinarians', vetForm, config);
                setVeterinarians([...veterinarians, res.data]);
                addActivity(`New professional registered: ${res.data.fullName}`);
            }
            setVetForm({ fullName: '', licenseNumber: '', specialty: '' });
            setEditingId(null);
        } catch (err: any) {
            console.error(err);
            alert("Error saving professional: " + (err.response?.data?.message || err.message));
        }
    };

    const deleteVet = async (id: string) => {
        if (!user || !window.confirm("Remove professional?")) return;
        try {
            await axios.delete(`/api/veterinarians/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
            setVeterinarians(veterinarians.filter(v => v._id !== id));
        } catch (err) { console.error(err); }
    };

    // Record Handlers
    const handleRecordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Strict Time Validation
        const [hours, minutes] = recordForm.time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        if (totalMinutes < 9 * 60 || totalMinutes > 17 * 60) {
            alert("Error: Out of office hours (09:00 - 17:00)");
            return;
        }
        if (minutes !== 0 && minutes !== 30) {
            alert("Error: Appointments must be every 30 minutes (e.g. 10:00, 10:30)");
            return;
        }

        const config = { headers: { Authorization: `Bearer ${user!.token}` } };
        try {
            if (editingId) {
                const res = await axios.patch(`/api/medical-records/${editingId}`, recordForm, config);
                setMedicalRecords(medicalRecords.map(m => m._id === editingId ? res.data : m));
            } else {
                const res = await axios.post('/api/medical-records', recordForm, config);
                setMedicalRecords([...medicalRecords, res.data]);

                const pet = pets.find(p => p._id === recordForm.petId);
                const vet = veterinarians.find(v => v._id === recordForm.veterinarianId);
                const ownerName = pet && typeof pet.ownerId === 'object' ? pet.ownerId.fullName : 'Unknown Owner';

                addActivity(`Appointment: ${pet?.name || 'Pet'} (${ownerName}) with Dr. ${vet?.fullName || 'N/A'}`);
            }
            setRecordForm({ petId: '', veterinarianId: '', date: '', time: '', description: '', ownerId: '' });
            setEditingId(null);
        } catch (err: any) {
            console.error(err);
            alert("Error saving appointment: " + (err.response?.data?.message || err.message));
        }
    };

    const deleteRecord = async (id: string) => {
        if (!user || !window.confirm("Delete appointment record?")) return;
        try {
            const recordToDelete = medicalRecords.find(m => m._id === id);
            await axios.delete(`/api/medical-records/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
            setMedicalRecords(medicalRecords.filter(m => m._id !== id));

            if (recordToDelete) {
                const petName = typeof recordToDelete.petId === 'object' ? recordToDelete.petId.name : 'Pet';
                const vetName = typeof recordToDelete.veterinarianId === 'object' ? recordToDelete.veterinarianId.fullName : 'N/A';
                addActivity(`Canceled: ${petName}'s visit with Dr. ${vetName}`);
            } else {
                addActivity(`Appointment canceled`);
            }
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark text-primary">Loading Patitas Felices...</div>;

    if (!user) {
        return (
            <LoginView
                authMode={authMode}
                setAuthMode={setAuthMode}
                handleAuth={handleAuth}
                email={email}
                setEmail={(val) => { setEmail(val); setLoginError(null); }}
                password={password}
                setPassword={(val) => { setPassword(val); setLoginError(null); }}
                loginError={loginError}
            />
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                const todayStr = new Date().toISOString().split('T')[0];
                const todayRecs = medicalRecords.filter(r => r.date && r.date.split('T')[0] === todayStr);

                // Get next 5 appointments (after today)
                const nextRecs = medicalRecords
                    .filter(r => r.date && r.date.split('T')[0] > todayStr)
                    .sort((a, b) => {
                        const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
                        if (dateDiff !== 0) return dateDiff;
                        return (a.time || '').localeCompare(b.time || '');
                    })
                    .slice(0, 5);

                return <DashboardView
                    stats={{ owners: owners.length, pets: pets.length, appointments: todayRecs.length }}
                    todayRecords={todayRecs}
                    nextRecords={nextRecs}
                    activities={activities}
                />;
            case 'owners':
                return (
                    <OwnersView
                        owners={owners}
                        pets={pets}
                        ownerForm={ownerForm}
                        setOwnerForm={setOwnerForm}
                        onSubmit={handleOwnerSubmit}
                        onDelete={deleteOwner}
                        editingId={editingId}
                        onEdit={(o) => {
                            setEditingId(o._id);
                            setOwnerForm({ fullName: o.fullName, phone: o.phone, address: o.address || '' });
                            scrollToForm();
                        }}
                        onCancel={handleCancelEdit}
                        expandedOwnerId={expandedOwnerId}
                        setExpandedOwnerId={setExpandedOwnerId}
                        onPetClick={(petId) => {
                            setHighlightedPetId(petId);
                            setActiveTab('pets');
                        }}
                    />
                );
            case 'pets':
                return (
                    <PetsView
                        pets={pets}
                        owners={owners}
                        petForm={petForm}
                        setPetForm={setPetForm}
                        onSubmit={handlePetSubmit}
                        onDelete={deletePet}
                        editingId={editingId}
                        onEdit={(p) => {
                            setEditingId(p._id);
                            setPetForm({ name: p.name, species: p.species, birthDate: p.birthDate ? p.birthDate.split('T')[0] : '', ownerId: typeof p.ownerId === 'object' ? p.ownerId._id : p.ownerId });
                            scrollToForm();
                        }}
                        onCancel={handleCancelEdit}
                        onOwnerClick={(ownerId) => {
                            setExpandedOwnerId(ownerId);
                            setActiveTab('owners');
                        }}
                        highlightedPetId={highlightedPetId}
                        setHighlightedPetId={setHighlightedPetId}
                    />
                );
            case 'veterinarians':
                return (
                    <VeterinariansView
                        vets={veterinarians}
                        vetForm={vetForm}
                        setVetForm={setVetForm}
                        onSubmit={handleVetSubmit}
                        onDelete={deleteVet}
                        editingId={editingId}
                        onEdit={(v) => {
                            setEditingId(v._id);
                            setVetForm({ fullName: v.fullName, licenseNumber: v.licenseNumber, specialty: v.specialty });
                            scrollToForm();
                        }}
                        onCancel={handleCancelEdit}
                    />
                );
            case 'medicalRecords':
                return (
                    <MedicalRecordsView
                        records={medicalRecords}
                        pets={pets}
                        vets={veterinarians}
                        recordForm={recordForm}
                        setRecordForm={setRecordForm}
                        onSubmit={handleRecordSubmit}
                        onDelete={deleteRecord}
                        editingId={editingId}
                        onEdit={(m) => {
                            const pId = typeof m.petId === 'object' ? m.petId._id : m.petId;
                            const pet = pets.find(p => p._id === pId);
                            const oId = pet ? (typeof pet.ownerId === 'object' ? pet.ownerId._id : pet.ownerId) : '';

                            setEditingId(m._id);
                            setRecordForm({
                                petId: pId,
                                veterinarianId: typeof m.veterinarianId === 'object' ? m.veterinarianId._id : m.veterinarianId,
                                date: m.date ? m.date.split('T')[0] : new Date().toISOString().split('T')[0],
                                time: m.time || '',
                                description: m.description,
                                ownerId: oId
                            });
                            scrollToForm();
                        }}
                        onCancel={handleCancelEdit}
                        owners={owners}
                    />
                );
            default:
                return null;
        }
    };

    const getTitle = () => {
        const titles: Record<string, string> = {
            dashboard: 'Dashboard',
            owners: 'Owners Management',
            pets: 'Pets Management',
            veterinarians: 'Professionals',
            medicalRecords: 'Appointments'
        };
        return titles[activeTab] || 'Patitas Felices';
    };

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} title={getTitle()} userRole={user?.role}>
            {renderContent()}
        </Layout>
    );
}

export default App;
