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

export default function Index({ auth, kaders, available_users, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedKader, setSelectedKader] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    
    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        nik: '', nama: '', jabatan: '', no_hp: '', alamat: '', user_id: ''
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route('kader.index'),
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

    const openModal = (k = null) => {
        if (k) {
            setSelectedKader(k);
            setData({
                nik: k.nik || '',
                nama: k.nama || '',
                jabatan: k.jabatan || '',
                no_hp: k.no_hp || '',
                alamat: k.alamat || '',
                user_id: k.user_id || ''
            });
        } else {
            setSelectedKader(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (selectedKader) {
            patch(route('kader.update', selectedKader.id), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('kader.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    return (
        <AuthenticatedLayout header={<span>Data Master <span className="text-seafoam-500 mx-2">/</span> Personil Kader</span>}>
            <Head title="Master Kader" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-80 group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><SearchIcon /></span>
                            <input 
                                type="text" 
                                placeholder="Cari NIK atau Nama..." 
                                className="w-full rounded-2xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-seafoam-500/10 transition-all" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total:</span>
                            <span className="text-xs font-black text-slate-700 ml-2">{kaders.total} Orang</span>
                        </div>
                    </div>
                    <PrimaryButton onClick={() => openModal()} className="rounded-2xl px-8 py-4 bg-seafoam-600 hover:bg-seafoam-700 border-none font-bold text-white text-[10px] uppercase tracking-widest shadow-xl shadow-seafoam-200 shrink-0">
                        + Tambah Kader
                    </PrimaryButton>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden text-[12px]">
                    <div className="overflow-x-auto text-[12px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-6 py-4">Identitas Kader</th>
                                    <th className="px-6 py-4 text-center">Jabatan</th>
                                    <th className="px-6 py-4">Akun Login</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {kaders.data.map((k) => (
                                    <tr key={k.id} className="hover:bg-slate-50/40 transition-colors group">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-seafoam-50 text-seafoam-600 flex items-center justify-center font-black text-[10px] uppercase">
                                                    {k.nama.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-extrabold text-slate-900 leading-tight">{k.nama}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold tracking-tight mt-0.5">NIK: {k.nik}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-center">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">{k.jabatan || '-'}</span>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {k.user ? (
                                                <div className="flex items-center gap-2 text-seafoam-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-seafoam-500 animate-pulse"></div>
                                                    <span className="text-[11px] font-bold">{k.user.email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-slate-300 font-bold italic">Belum punya akun</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button onClick={() => openModal(k)} className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-seafoam-600 hover:bg-seafoam-50 transition-all shadow-sm"><EditIcon /></button>
                                                <button onClick={() => { setDeletingId(k.id); setIsDeleteModalOpen(true); }} className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
                        <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Menampilkan {kaders.data.length} dari {kaders.total} Kader</span>
                        <Pagination links={kaders.links} />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="3xl">
                <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
                    <div className="shrink-0 p-8 pb-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedKader ? 'Edit' : 'Tambah'} Kader</h2>
                            <p className="text-slate-500 font-medium">Informasi biodata personil kader posyandu/posbindu.</p>
                        </div>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-2xl bg-white p-2 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                            <div><InputLabel value="NIK" /><TextInput className="w-full rounded-2xl border-none bg-slate-50 py-3 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={data.nik} onChange={(e) => setData('nik', e.target.value)} required /><p className="text-rose-500 text-xs mt-1">{errors.nik}</p></div>
                            <div><InputLabel value="Nama Lengkap" /><TextInput className="w-full rounded-2xl border-none bg-slate-50 py-3 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={data.nama} onChange={(e) => setData('nama', e.target.value)} required /><p className="text-rose-500 text-xs mt-1">{errors.nama}</p></div>
                            <div><InputLabel value="Jabatan" /><TextInput className="w-full rounded-2xl border-none bg-slate-50 py-3 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={data.jabatan} onChange={(e) => setData('jabatan', e.target.value)} placeholder="Misal: Ketua, Anggota" /></div>
                            <div><InputLabel value="No. HP" /><TextInput className="w-full rounded-2xl border-none bg-slate-50 py-3 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={data.no_hp} onChange={(e) => setData('no_hp', e.target.value)} /></div>
                            <div className="md:col-span-2">
                                <InputLabel value="Hubungkan ke Akun Sistem" />
                                <select className="w-full rounded-2xl border-none bg-slate-50 py-3 font-bold text-slate-700 text-sm focus:ring-4 focus:ring-seafoam-500/10 transition-all cursor-pointer" value={data.user_id} onChange={(e) => setData('user_id', e.target.value)}>
                                    <option value="">-- Tidak Ada (Hanya Data Master) --</option>
                                    {selectedKader?.user && (
                                        <option value={selectedKader.user.id}>{selectedKader.user.name} ({selectedKader.user.email})</option>
                                    )}
                                    {available_users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                                <p className="text-slate-400 text-[9px] mt-1.5 italic font-medium">Hanya akun 'kader' yang belum terhubung yang akan muncul.</p>
                            </div>
                            <div className="md:col-span-2"><InputLabel value="Alamat Lengkap" /><textarea className="w-full rounded-2xl border-none bg-slate-50 py-3 px-4 font-bold text-sm min-h-[80px] focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} /></div>
                        </div>
                    </div>
                    
                    <div className="shrink-0 p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={() => setIsModalOpen(false)} className="rounded-2xl px-6 py-4 border-none bg-white shadow-sm text-slate-600 font-bold text-xs">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton processing={processing} className="rounded-2xl px-8 py-4 bg-seafoam-600 hover:bg-seafoam-700 text-white border-none font-black text-xs uppercase tracking-widest active:scale-95 shadow-xl shadow-seafoam-200/50 min-w-[180px] flex justify-center">
                            Simpan Data Kader
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md"><div className="flex flex-col items-center text-center p-12"><div className="h-24 w-24 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 ring-[12px] ring-rose-50/50"><DeleteIcon size="48" /></div><h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight text-sm">Hapus Data?</h2><p className="text-slate-500 mb-6 text-sm font-medium">Data kader akan dihapus permanen, akun login tetap ada.</p><div className="flex w-full gap-3"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs text-slate-600">Batal</button><button onClick={() => destroy(route('kader.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-rose-200">Ya, Hapus</button></div></div></Modal>
        </AuthenticatedLayout>
    );
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "18" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
