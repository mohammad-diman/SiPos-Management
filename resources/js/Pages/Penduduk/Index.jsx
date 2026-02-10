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

export default function Index({ auth, penduduks, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPenduduk, setSelectedPenduduk] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    
    // UI States
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedDesa, setSelectedDesa] = useState(filters.desa || '');

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        nik: '', nama: '', jenis_kelamin: 'L', tanggal_lahir: '', alamat: '', telepon: '',
    });

    const handleSearch = useCallback(
        debounce((search, desa) => {
            router.get(
                route('penduduk.index'),
                { search, desa },
                { preserveState: true, replace: true }
            );
        }, 300),
        []
    );

    useEffect(() => {
        if (searchQuery !== (filters.search || '') || selectedDesa !== (filters.desa || '')) {
            handleSearch(searchQuery, selectedDesa);
        }
    }, [searchQuery, selectedDesa]);

    const openModal = (p = null) => {
        if (p) {
            setSelectedPenduduk(p);
            setData({
                nik: p.nik || '', nama: p.nama || '', jenis_kelamin: p.jenis_kelamin || 'L',
                tanggal_lahir: p.tanggal_lahir || '', alamat: p.alamat || '', telepon: p.telepon || '',
            });
        } else {
            setSelectedPenduduk(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const action = selectedPenduduk ? route('penduduk.update', selectedPenduduk.id) : route('penduduk.store');
        const method = selectedPenduduk ? patch : post;
        method(action, { onSuccess: () => setIsModalOpen(false) });
    };

    return (
        <AuthenticatedLayout header={<span>Database <span className="text-indigo-500 mx-2">/</span> Data Penduduk</span>}>
            <Head title="Data Penduduk" />

            <div className="space-y-3">
                <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64 group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><SearchIcon /></span>
                            <input 
                                type="text" 
                                placeholder="Cari NIK atau Nama..." 
                                className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </div>
                        <div className="flex gap-2 w-full lg:w-auto">
                            <a 
                                href={route('export.excel', 'penduduk')} 
                                className="flex-1 lg:flex-none rounded-full px-5 py-2 bg-white border-2 border-seafoam-100 text-seafoam-600 hover:bg-seafoam-50 hover:border-seafoam-200 font-black text-[9px] uppercase tracking-[0.15em] shadow-sm transition-all text-center flex items-center justify-center"
                            >
                                Excel
                            </a>
                            <a 
                                href={route('export.pdf', 'penduduk')} 
                                className="flex-1 lg:flex-none rounded-full px-5 py-2 bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-black text-[9px] uppercase tracking-[0.15em] shadow-sm transition-all text-center flex items-center justify-center"
                            >
                                PDF
                            </a>
                            <PrimaryButton onClick={() => openModal()} className="flex-[2] lg:flex-none rounded-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 border-none font-black text-white text-[9px] uppercase tracking-[0.15em] shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center">
                                + Tambah
                            </PrimaryButton>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            className="rounded-full border border-slate-200 bg-white py-1.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-400 transition-all cursor-pointer shadow-sm"
                            value={selectedDesa}
                            onChange={(e) => setSelectedDesa(e.target.value)}
                        >
                            <option value="">Semua Desa</option>
                            <option value="Bulontio Barat">Bulontio Barat</option>
                            <option value="Bulontio Timur">Bulontio Timur</option>
                            <option value="Mebongo">Mebongo</option>
                            <option value="Hutokalo">Hutokalo</option>
                        </select>
                        <div className="flex items-center gap-2 bg-slate-50 px-5 py-2 rounded-full border border-slate-100 shrink-0">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total:</span>
                            <span className="text-[12px] font-black text-slate-600 leading-none">{penduduks.total}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto text-[12px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-6 py-4">Nama Lengkap / NIK</th>
                                    <th className="px-6 py-4 text-center">Jenis Kelamin</th>
                                    <th className="px-6 py-4 text-right">Opsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {penduduks.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/40 transition-colors group">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-3.5">
                                                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black text-[10px] group-hover:from-indigo-50 group-hover:to-indigo-100 group-hover:text-indigo-600 transition-all duration-500">
                                                    {p.nama?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-extrabold text-slate-900 leading-tight">{p.nama}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{p.nik}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-center text-[12px]">
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${p.jenis_kelamin === 'L' ? 'bg-seafoam-50 text-seafoam-600' : 'bg-pink-50 text-pink-600'}`}>
                                                {p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <ActionButton onClick={() => { setSelectedPenduduk(p); setIsDetailModalOpen(true); }} color="seafoam"><ViewIcon /></ActionButton>
                                                <ActionButton onClick={() => openModal(p)} color="indigo"><EditIcon /></ActionButton>
                                                <ActionButton onClick={() => { setDeletingId(p.id); setIsDeleteModalOpen(true); }} color="rose"><DeleteIcon /></ActionButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {penduduks.data.length === 0 && (
                                    <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400 font-bold text-[11px] uppercase tracking-widest">Tidak ada data yang dapat ditampilkan</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
                        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">
                            Menampilkan <span className="text-slate-700">{penduduks.from || 0}</span> - <span className="text-slate-700">{penduduks.to || 0}</span> dari <span className="text-slate-700">{penduduks.total}</span> Penduduk
                        </p>
                        <Pagination links={penduduks.links} />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="xl">
                <form onSubmit={submit} className="p-8">
                    <h2 className="text-xl font-black text-slate-900 mb-6">{selectedPenduduk ? 'Edit' : 'Tambah'} Data Penduduk</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="md:col-span-2">
                            <InputLabel value="NIK" />
                            <TextInput className="w-full rounded-2xl bg-slate-50 border-none py-3 font-bold text-sm" value={data.nik} onChange={(e) => setData('nik', e.target.value)} required />
                            {errors.nik && <p className="text-rose-500 text-xs mt-1">{errors.nik}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel value="Nama Lengkap" />
                            <TextInput className="w-full rounded-2xl bg-slate-50 border-none py-3 font-bold text-sm" value={data.nama} onChange={(e) => setData('nama', e.target.value)} required />
                            {errors.nama && <p className="text-rose-500 text-xs mt-1">{errors.nama}</p>}
                        </div>
                        <div>
                            <InputLabel value="Jenis Kelamin" />
                            <select className="w-full rounded-2xl bg-slate-50 border-none py-3 font-bold text-slate-700 text-sm" value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} required>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="Tanggal Lahir" />
                            <TextInput type="date" className="w-full rounded-2xl bg-slate-50 border-none py-3 font-bold text-sm" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} required />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel value="Telepon" />
                            <TextInput className="w-full rounded-2xl bg-slate-50 border-none py-3 font-bold text-sm" value={data.telepon} onChange={(e) => setData('telepon', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel value="Alamat" />
                            <textarea className="w-full rounded-2xl bg-slate-50 border-none py-3 px-4 font-bold text-sm min-h-[80px]" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan Data</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} maxWidth="xl">
                <div className="p-8 flex flex-col h-full">
                    <div className="shrink-0 flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-xl shadow-indigo-200">
                                {selectedPenduduk?.nama?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedPenduduk?.nama}</h2>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">NIK: {selectedPenduduk?.nik}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsDetailModalOpen(false)} className="rounded-2xl bg-slate-50 p-2.5 text-slate-400 hover:text-slate-600 transition-all active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100">
                            <DetailItem label="Jenis Kelamin" value={selectedPenduduk?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                            <DetailItem label="Tanggal Lahir" value={selectedPenduduk?.tanggal_lahir} />
                            <DetailItem label="Telepon" value={selectedPenduduk?.telepon || '-'} />
                            <div className="col-span-2"><DetailItem label="Alamat Lengkap" value={selectedPenduduk?.alamat || '-'} /></div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button onClick={() => setIsDetailModalOpen(false)} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">Tutup</button>
                    </div>
                </div>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md">
                <div className="flex flex-col items-center text-center p-10">
                    <div className="h-20 w-20 rounded-[1.5rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-6 ring-[10px] ring-rose-50/50"><DeleteIcon size="40" /></div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Hapus Data?</h2>
                    <p className="text-slate-500 mb-8 text-xs font-medium">Tindakan ini tidak dapat dibatalkan.</p>
                    <div className="flex w-full gap-3">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-black text-[10px] text-slate-600">Batal</button>
                        <button onClick={() => destroy(route('penduduk.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black text-[10px] shadow-xl shadow-rose-200">Ya, Hapus</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

function ActionButton({ children, onClick, color }) {
    const colors = { 
        seafoam: 'text-seafoam-500 bg-seafoam-50 hover:bg-seafoam-600 hover:text-white', 
        indigo: 'text-indigo-500 bg-indigo-50 hover:bg-indigo-600 hover:text-white', 
        rose: 'text-rose-500 bg-rose-50 hover:bg-rose-600 hover:text-white' 
    };
    return (<button onClick={onClick} className={`h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm active:scale-90 ${colors[color]}`}>{children}</button>);
}

function DetailItem({ label, value }) {
    return (<div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p><p className="text-sm font-extrabold text-slate-900">{value}</p></div>);
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "18" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;