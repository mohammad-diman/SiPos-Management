import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import { useState, useMemo } from 'react';

export default function Index({ auth, desas = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDesa, setSelectedDesa] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        nama_desa: '',
    });

    const openModal = (desa = null) => {
        if (desa) {
            setSelectedDesa(desa);
            setData({
                nama_desa: desa.nama_desa,
            });
        } else {
            setSelectedDesa(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setSelectedDesa(null); reset(); };

    // Pagination Logic
    const totalPages = Math.ceil(desas.length / rowsPerPage);
    const paginatedDesas = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return desas.slice(start, start + rowsPerPage);
    }, [desas, currentPage, rowsPerPage]);

    const submit = (e) => {
        e.preventDefault();
        const action = selectedDesa ? route('desa.update', selectedDesa.id) : route('desa.store');
        const method = selectedDesa ? patch : post;
        method(action, { onSuccess: () => closeModal() });
    };

    return (
        <AuthenticatedLayout header={<span>Data Master <span className="text-indigo-500 mx-2">/</span> Desa</span>}>
            <Head title="Master Desa" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 px-5 py-2 rounded-full border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Baris:</span>
                            <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-transparent border-none text-[11px] font-black text-slate-600 focus:ring-0 p-0 pr-8 leading-none">
                                {[5, 10, 25, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                    <PrimaryButton onClick={() => openModal()} className="rounded-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 border-none font-black text-white text-[9px] uppercase tracking-[0.15em] shadow-lg shadow-indigo-100 shrink-0">
                        + Tambah Desa
                    </PrimaryButton>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden text-[12px]">
                    <div className="overflow-x-auto text-[12px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-6 py-4">Nama Desa</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {paginatedDesas.map((d) => (
                                    <tr key={d.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-3 whitespace-nowrap"><p className="text-[12px] font-extrabold text-slate-900 uppercase tracking-wider">{d.nama_desa}</p></td>
                                        <td className="px-6 py-3 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1.5 text-slate-400">
                                                <button onClick={() => openModal(d)} className="p-1.5 hover:text-indigo-600 transition-colors"><EditIcon /></button>
                                                <button onClick={() => { setDeletingId(d.id); setIsDeleteModalOpen(true); }} className="p-1.5 hover:text-rose-600 transition-colors"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {desas.length === 0 && (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                            Belum ada data desa
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between text-[11px]">
                        <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Menampilkan {paginatedDesas.length} dari {desas.length} Data</span>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg></button>
                            <div className="flex items-center px-4 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-600">{currentPage} / {totalPages || 1}</div>
                            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
                    <div className="shrink-0 p-8 pb-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center"><div><h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedDesa ? 'Edit' : 'Tambah'} Desa</h2><p className="text-slate-500 font-medium">Master Data Wilayah</p></div><button type="button" onClick={closeModal} className="rounded-2xl bg-white p-2 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 active:scale-95"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="space-y-6 py-4">
                            <div>
                                <InputLabel value="Nama Desa" />
                                <TextInput className="w-full rounded-2xl border-none bg-slate-50 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={data.nama_desa} onChange={(e) => setData('nama_desa', e.target.value)} required placeholder="Contoh: Desa Makmur" />
                                {errors.nama_desa && <div className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-widest">{errors.nama_desa}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3"><SecondaryButton type="button" onClick={closeModal} className="rounded-2xl px-6 py-4 border-none bg-white shadow-sm text-slate-600 font-bold text-xs">Batal</SecondaryButton><PrimaryButton processing={processing} className="rounded-2xl px-6 py-4 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 border-none font-bold text-white text-xs">Simpan Desa</PrimaryButton></div>
                </form>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md"><div className="flex flex-col items-center text-center p-12"><div className="h-24 w-24 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 ring-[12px] ring-rose-50/50"><DeleteIcon size="48" /></div><h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Hapus Data?</h2><p className="text-slate-500 mb-6 text-sm font-medium">Tindakan ini permanen.</p><div className="flex w-full gap-3"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs text-slate-600">Batal</button><button onClick={() => destroy(route('desa.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-rose-200">Hapus</button></div></div></Modal>
        </AuthenticatedLayout>
    );
}

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "16" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
