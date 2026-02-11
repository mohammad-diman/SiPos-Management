import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function Index({ auth, users, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        name: '', email: '', password: '', role: 'kader'
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route('users.index'),
                { search: query },
                { preserveState: true, replace: true }
            );
        }, 300),
        []
    );

    useEffect(() => {
        if (searchQuery !== (filters.search || '')) {
            handleSearch(searchQuery);
        }
    }, [searchQuery]);

    const openModal = (u = null) => {
        if (u) {
            setSelectedUser(u);
            setData({
                name: u.name || '',
                email: u.email || '',
                password: '', // Kosongkan saat edit
                role: u.role || 'kader'
            });
        } else {
            setSelectedUser(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (selectedUser) {
            patch(route('users.update', selectedUser.id), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('users.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    return (
        <AuthenticatedLayout header={<span>Sistem <span className="text-indigo-500 mx-2">/</span> Manajemen Akun</span>}>
            <Head title="Manajemen Petugas" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-80 group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><SearchIcon /></span>
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {auth.user.role === 'admin' && (
                            <PrimaryButton onClick={() => openModal()} className="rounded-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 border-none font-black text-white text-[9px] uppercase tracking-[0.15em] shadow-lg shadow-indigo-100 shrink-0 flex items-center justify-center">
                                + Tambah Petugas
                            </PrimaryButton>
                        )}
                    </div>
                    <div className="bg-slate-50 px-5 py-2 rounded-full border border-slate-100 shrink-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total:</span>
                        <span className="text-[12px] font-black text-slate-600 ml-1 leading-none">{users.total}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden text-[12px]">
                    <div className="overflow-x-auto text-[12px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-6 py-4">Informasi Petugas</th>
                                    <th className="px-6 py-4">Hak Akses / Role</th>
                                    {auth.user.role === 'admin' && <th className="px-6 py-4 text-right">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {users.data.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-black text-[10px] ${u.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-extrabold text-slate-900 leading-tight">{u.name} {auth.user.id === u.id && <span className="ml-2 px-1.5 py-0.5 bg-seafoam-50 text-seafoam-600 text-[8px] rounded-full uppercase">Anda</span>}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-0.5">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-[12px]">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                                u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' :
                                                u.role === 'kader' ? 'bg-seafoam-50 text-seafoam-600' : 'bg-slate-50 text-slate-600'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        {auth.user.role === 'admin' && (
                                            <td className="px-6 py-3 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <button onClick={() => openModal(u)} className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"><EditIcon /></button>
                                                    {auth.user.id !== u.id && (
                                                        <button onClick={() => { setDeletingId(u.id); setIsDeleteModalOpen(true); }} className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm"><DeleteIcon /></button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
                        <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Halaman {users.current_page} • Menampilkan {users.data.length} dari {users.total} Data</span>
                        <Pagination links={users.links} />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
                    <div className="shrink-0 p-8 pb-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedUser ? 'Edit' : 'Tambah'} Petugas</h2>
                            <p className="text-slate-500 font-medium">Atur hak akses dan identitas petugas sistem.</p>
                        </div>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-2xl bg-white p-2 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="space-y-6 py-2">
                            <div>
                                <InputLabel value="Nama Lengkap" />
                                <TextInput
                                    className="w-full rounded-2xl border-none bg-slate-50 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <p className="text-rose-500 text-xs mt-1">{errors.name}</p>
                            </div>
                            <div>
                                <InputLabel value="Email" />
                                <TextInput
                                    type="email"
                                    className="w-full rounded-2xl border-none bg-slate-50 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <p className="text-rose-500 text-xs mt-1">{errors.email}</p>
                            </div>
                            <div>
                                <InputLabel value="Password" />
                                <TextInput
                                    type="password"
                                    className="w-full rounded-2xl border-none bg-slate-50 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required={!selectedUser}
                                    placeholder={selectedUser ? 'Kosongkan jika tidak ingin ganti password' : '••••••••'}
                                />
                                <p className="text-rose-500 text-xs mt-1">{errors.password}</p>
                            </div>
                            <div>
                                <InputLabel value="Role / Hak Akses" />
                                <select
                                    className="w-full rounded-2xl border-none bg-slate-50 py-4 font-bold text-slate-700 text-sm focus:ring-4 focus:ring-seafoam-500/10 transition-all cursor-pointer"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="admin">Administrator</option>
                                    <option value="kader">Kader Posyandu</option>
                                    <option value="masyarakat">Masyarakat Umum</option>
                                </select>
                                <p className="text-rose-500 text-xs mt-1">{errors.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={() => setIsModalOpen(false)} className="rounded-2xl px-6 py-4 border-none bg-white shadow-sm text-slate-600 font-bold text-xs">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-2xl px-8 py-4 bg-seafoam-600 hover:bg-seafoam-700 text-white border-none font-black text-xs uppercase tracking-widest active:scale-95 shadow-xl shadow-seafoam-200/50 min-w-[180px] flex justify-center">
                            {processing ? 'Menyimpan...' : 'Simpan Akun'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md"><div className="flex flex-col items-center text-center p-12"><div className="h-24 w-24 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 ring-[12px] ring-rose-50/50"><DeleteIcon size="48" /></div><h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Hapus Akun?</h2><p className="text-slate-500 mb-10 text-sm font-medium">Petugas tidak akan bisa mengakses sistem lagi.</p><div className="flex w-full gap-4"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs text-slate-600">Batal</button><button onClick={() => destroy(route('users.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-rose-200">Ya, Hapus</button></div></div></Modal>
        </AuthenticatedLayout>
    );
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "18" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
