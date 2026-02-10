import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import { useState, useMemo } from 'react';

export default function Index({ auth, jadwals = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedJadwal, setSelectedJadwal] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        nama_kegiatan: '',
        tanggal: '',
        waktu_mulai: '',
        waktu_selesai: '',
        lokasi: '',
        keterangan: '',
    });

    const openModal = (jadwal = null) => {
        if (jadwal) {
            setSelectedJadwal(jadwal);
            setData({
                nama_kegiatan: jadwal.nama_kegiatan,
                tanggal: jadwal.tanggal,
                waktu_mulai: jadwal.waktu_mulai,
                waktu_selesai: jadwal.waktu_selesai,
                lokasi: jadwal.lokasi,
                keterangan: jadwal.keterangan || '',
            });
        } else {
            setSelectedJadwal(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setSelectedJadwal(null); reset(); };

    // Pagination Logic
    const totalPages = Math.ceil(jadwals.length / rowsPerPage);
    const paginatedJadwals = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return jadwals.slice(start, start + rowsPerPage);
    }, [jadwals, currentPage, rowsPerPage]);

    const submit = (e) => {
        e.preventDefault();
        const action = selectedJadwal ? route('jadwal.update', selectedJadwal.id) : route('jadwal.store');
        const method = selectedJadwal ? patch : post;
        method(action, { onSuccess: () => closeModal() });
    };

    return (
        <AuthenticatedLayout header={<span>Database <span className="text-indigo-500 mx-2">/</span> Jadwal Pelayanan</span>}>
            <Head title="Jadwal Pelayanan" />

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
                        + Tambah Jadwal
                    </PrimaryButton>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden text-[12px]">
                    <div className="overflow-x-auto text-[12px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-6 py-4">Kegiatan</th>
                                    <th className="px-6 py-4">Tanggal & Waktu</th>
                                    <th className="px-6 py-4">Lokasi</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {paginatedJadwals.map((j) => (
                                    <tr key={j.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-3 whitespace-nowrap"><p className="text-[12px] font-extrabold text-slate-900">{j.nama_kegiatan}</p></td>
                                        <td className="px-6 py-3 whitespace-nowrap text-[11px] font-bold text-slate-500">{j.tanggal} <span className="mx-2 text-slate-300">|</span> {j.waktu_mulai} - {j.waktu_selesai}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-[11px] font-bold text-slate-500 uppercase tracking-wider">{j.lokasi}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1.5 text-slate-400">
                                                <button onClick={() => openModal(j)} className="p-1.5 hover:text-indigo-600 transition-colors"><EditIcon /></button>
                                                <button onClick={() => { setDeletingId(j.id); setIsDeleteModalOpen(true); }} className="p-1.5 hover:text-rose-600 transition-colors"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between text-[11px]">
                        <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Menampilkan {paginatedJadwals.length} dari {jadwals.length} Data</span>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg></button>
                            <div className="flex items-center px-4 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-600">{currentPage} / {totalPages || 1}</div>
                            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
                    <div className="shrink-0 p-8 pb-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center"><div><h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedJadwal ? 'Edit' : 'Tambah'} Jadwal</h2><p className="text-slate-500 font-medium">Agenda Pelayanan Posyandu & Posbindu</p></div><button type="button" onClick={closeModal} className="rounded-2xl bg-white p-2 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 active:scale-95"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar"><div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                        <div className="md:col-span-2 space-y-3">
                            <InputLabel value="Jenis Layanan (Bisa pilih lebih dari satu)" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    'Posyandu Balita & Ibu Hamil',
                                    'Posbindu Lansia'
                                ].map((service) => (
                                    <label 
                                        key={service} 
                                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                                            data.nama_kegiatan.includes(service) 
                                            ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                            : 'bg-slate-50 border-transparent hover:bg-slate-100'
                                        }`}
                                    >
                                        <input 
                                            type="checkbox" 
                                            className="rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                                            checked={data.nama_kegiatan.split(', ').includes(service)}
                                            onChange={(e) => {
                                                let current = data.nama_kegiatan ? data.nama_kegiatan.split(', ').filter(v => v) : [];
                                                if (e.target.checked) {
                                                    current.push(service);
                                                } else {
                                                    current = current.filter(v => v !== service);
                                                }
                                                setData('nama_kegiatan', current.join(', '));
                                            }}
                                        />
                                        <span className={`text-xs font-black uppercase tracking-tight ${data.nama_kegiatan.includes(service) ? 'text-indigo-700' : 'text-slate-600'}`}>
                                            {service}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {errors.nama_kegiatan && <div className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{errors.nama_kegiatan}</div>}
                        </div>
                        <div><InputLabel value="Tanggal" /><TextInput type="date" className="w-full rounded-2xl border-none bg-slate-50 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} required /></div>
                        <div><InputLabel value="Lokasi" /><TextInput className="w-full rounded-2xl border-none bg-slate-50 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} required /></div>
                        <div><InputLabel value="Waktu Mulai" /><TextInput type="time" className="w-full rounded-2xl border-none bg-slate-50 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={data.waktu_mulai} onChange={(e) => setData('waktu_mulai', e.target.value)} required /></div>
                        <div><InputLabel value="Waktu Selesai" /><TextInput type="time" className="w-full rounded-2xl border-none bg-slate-50 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={data.waktu_selesai} onChange={(e) => setData('waktu_selesai', e.target.value)} required /></div>
                        <div className="md:col-span-2"><InputLabel value="Keterangan" /><textarea className="w-full rounded-2xl border-none bg-slate-50 py-4 px-4 text-sm font-bold min-h-[100px] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} /></div>
                    </div></div>
                    <div className="shrink-0 p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3"><SecondaryButton type="button" onClick={closeModal} className="rounded-2xl px-6 py-4 border-none bg-white shadow-sm text-slate-600 font-bold text-xs">Batal</SecondaryButton><PrimaryButton processing={processing} className="rounded-2xl px-6 py-4 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 border-none font-bold text-white text-xs">Simpan Jadwal</PrimaryButton></div>
                </form>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md"><div className="flex flex-col items-center text-center p-12"><div className="h-24 w-24 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 ring-[12px] ring-rose-50/50"><DeleteIcon size="48" /></div><h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Hapus Data?</h2><p className="text-slate-500 mb-6 text-sm font-medium">Tindakan ini permanen.</p><div className="flex w-full gap-3"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs text-slate-600">Batal</button><button onClick={() => destroy(route('jadwal.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-rose-200 text-xs">Hapus</button></div></div></Modal>
        </AuthenticatedLayout>
    );
}

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "16" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
