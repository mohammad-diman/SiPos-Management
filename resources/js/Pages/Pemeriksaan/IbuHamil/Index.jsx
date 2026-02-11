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

export default function Index({ auth, pemeriksaans, ibu_hamils = [], filters, antrian_aktif }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPemeriksaan, setSelectedPemeriksaan] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        ibu_hamil_id: '',
        tanggal_periksa: new Date().toISOString().split('T')[0],
        berat_badan: '',
        tinggi_badan: '',
        tekanan_darah: '',
        lila: '',
        tfu: '',
        djj: '',
        jumlah_fe: '',
        imunisasi_tt: '',
        keluhan: '',
        catatan: ''
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route('pemeriksaan-ibu-hamil.index'),
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

    const openModal = (p = null) => {
        if (p) {
            setSelectedPemeriksaan(p);
            setData({
                ibu_hamil_id: p.ibu_hamil_id || '',
                tanggal_periksa: p.tanggal_periksa || '',
                berat_badan: p.berat_badan || '',
                tinggi_badan: p.tinggi_badan || '',
                tekanan_darah: p.tekanan_darah || '',
                lila: p.lila || '',
                tfu: p.tfu || '',
                djj: p.djj || '',
                jumlah_fe: p.jumlah_fe || '',
                imunisasi_tt: p.imunisasi_tt || '',
                keluhan: p.keluhan || '',
                catatan: p.catatan || ''
            });
        } else {
            setSelectedPemeriksaan(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const openDetailModal = (p) => {
        setSelectedPemeriksaan(p);
        setIsDetailModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPemeriksaan(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        const action = selectedPemeriksaan && selectedPemeriksaan.id ? route('pemeriksaan-ibu-hamil.update', selectedPemeriksaan.id) : route('pemeriksaan-ibu-hamil.store');

        if (selectedPemeriksaan && selectedPemeriksaan.id) {
            patch(action, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(action, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    return (
        <AuthenticatedLayout header={<span>Layanan Posyandu <span className="text-seafoam-500 mx-2">/</span> Pemeriksaan Ibu Hamil</span>}>
            <Head title="Pemeriksaan Ibu Hamil" />

            <div className="space-y-6">
                {/* Panel Antrian Aktif */}
                {antrian_aktif && (
                    <div className="bg-rose-500 rounded-[2rem] p-6 text-white shadow-2xl shadow-rose-200 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="h-20 w-20 bg-white rounded-3xl flex flex-col items-center justify-center text-rose-500 shadow-xl">
                                <span className="text-[9px] font-black uppercase tracking-tighter leading-none mb-1">Nomor</span>
                                <span className="text-3xl font-black leading-none">{antrian_aktif.nomor_antrian}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{antrian_aktif.penduduk?.nama}</h2>
                                <p className="text-rose-100 font-bold opacity-80 uppercase tracking-widest text-[10px] mt-1">Status: {antrian_aktif.status}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 relative z-10 w-full md:w-auto">
                            {antrian_aktif.status === 'menunggu' ? (
                                <button
                                    onClick={() => router.post(route('pemeriksaan-ibu-hamil.panggil', antrian_aktif.id))}
                                    className="flex-1 md:flex-none px-8 py-4 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all shadow-xl active:scale-95"
                                >
                                    Panggil Sekarang
                                </button>
                            ) : (
                                <button
                                    onClick={() => openModal({ ibu_hamil_id: ibu_hamils.find(ih => ih.nik === antrian_aktif.penduduk.nik)?.id, tanggal_periksa: new Date().toISOString().split('T')[0] })}
                                    className="flex-1 md:flex-none px-8 py-4 bg-seafoam-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-seafoam-600 transition-all shadow-xl active:scale-95 border border-seafoam-400"
                                >
                                    Mulai Periksa
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-72 group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><SearchIcon /></span>
                            <input
                                type="text"
                                placeholder="Cari Nama Ibu Hamil..."
                                className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-seafoam-500/10 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <PrimaryButton onClick={() => openModal()} className="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-rose-500 hover:bg-rose-600 border-none font-bold text-white text-[10px] uppercase tracking-widest shrink-0 shadow-lg shadow-rose-100">
                            + Catat
                        </PrimaryButton>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shrink-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Data:</span>
                        <span className="text-[12px] font-black text-slate-600 ml-1 leading-none">{pemeriksaans.total}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden text-[12px]">
                    <div className="overflow-x-auto text-[12px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Nama Ibu</th>
                                    <th className="px-6 py-4 text-center">Tensi / BB / TB</th>
                                    <th className="px-6 py-4 text-center">DJJ / Fe</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {pemeriksaans.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-3 whitespace-nowrap font-bold text-slate-900">{p.tanggal_periksa}</td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 font-black text-[10px]">{p.ibu_hamil?.nama?.charAt(0)}</div>
                                                <div><p className="text-[12px] font-extrabold text-slate-900 leading-tight">{p.ibu_hamil?.nama}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{p.ibu_hamil?.no_rm}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-center font-bold text-slate-600">{p.tekanan_darah} / {p.berat_badan}kg / {p.tinggi_badan}cm</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-center">
                                            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black">{p.djj} bpm / {p.jumlah_fe} Tab</span>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1.5 text-slate-400">
                                                <button onClick={() => openDetailModal(p)} className="p-1.5 hover:text-seafoam-600 transition-colors" title="Lihat Detail"><ViewIcon /></button>
                                                <button onClick={() => openModal(p)} className="p-1.5 hover:text-indigo-600 transition-colors" title="Edit"><EditIcon /></button>
                                                <button onClick={() => { setDeletingId(p.id); setIsDeleteModalOpen(true); }} className="p-1.5 hover:text-rose-600 transition-colors" title="Hapus"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pemeriksaans.data.length === 0 && (
                                    <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic text-[11px] font-bold uppercase tracking-widest">Tidak ada data pemeriksaan ditemukan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
                        <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Menampilkan {pemeriksaans.from || 0} - {pemeriksaans.to || 0} dari {pemeriksaans.total} Data</span>
                        <Pagination links={pemeriksaans.links} />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col h-[85vh]">
                    <div className="shrink-0 p-6 pb-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedPemeriksaan && selectedPemeriksaan.id ? 'Edit' : 'Catat'} Pemeriksaan</h2>
                            <p className="text-xs text-slate-500 font-medium">Data Kehamilan & Kesehatan Ibu</p>
                        </div>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-white p-1.5 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {/* Global Error Display */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                                <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    Ada Kesalahan:
                                </p>
                                <ul className="text-rose-500 text-[11px] font-bold">
                                    {Object.values(errors).map((err, i) => <li key={i}>• {err}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4 border-b border-rose-100 pb-2">
                                    <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 scale-75"><ActivityIcon size={18} /></div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Data Klinis & Fisik</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <InputLabel value="Pilih Ibu Hamil" />
                                        <select className="w-full rounded-xl border-none bg-slate-50 py-2.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all cursor-pointer" value={data.ibu_hamil_id} onChange={(e) => setData('ibu_hamil_id', e.target.value)} required>
                                            <option value="">-- Pilih --</option>
                                            {ibu_hamils.map(i => <option key={i.id} value={i.id}>{i.no_rm} - {i.nama}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div><InputLabel value="Tanggal" /><TextInput type="date" className="w-full rounded-xl border-none bg-slate-50 py-2 text-sm" value={data.tanggal_periksa} onChange={(e) => setData('tanggal_periksa', e.target.value)} required /></div>
                                        <div><InputLabel value="Tensi" /><TextInput placeholder="120/80" className="w-full rounded-xl border-none bg-slate-50 py-2 text-sm" value={data.tekanan_darah} onChange={(e) => setData('tekanan_darah', e.target.value)} required /></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div><InputLabel value="BB (kg)" /><TextInput type="number" step="0.01" className="w-full rounded-xl border-none bg-slate-50 py-2 text-sm" value={data.berat_badan} onChange={(e) => setData('berat_badan', e.target.value)} required /></div>
                                        <div><InputLabel value="TB (cm)" /><TextInput type="number" step="0.01" className="w-full rounded-xl border-none bg-slate-50 py-2 text-sm" value={data.tinggi_badan} onChange={(e) => setData('tinggi_badan', e.target.value)} required /></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div><InputLabel value="LILA (cm)" /><TextInput type="number" step="0.1" className="w-full rounded-xl border-none bg-slate-50 py-2 text-sm" value={data.lila} onChange={(e) => setData('lila', e.target.value)} required /></div>
                                        <div><InputLabel value="TFU (cm)" /><TextInput type="number" step="0.1" className="w-full rounded-xl border-none bg-slate-50 py-2 text-sm" value={data.tfu} onChange={(e) => setData('tfu', e.target.value)} required /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4 border-b border-rose-100 pb-2">
                                    <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 scale-75"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M12 7v10"></path><path d="M8 11h8"></path></svg></div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Janin & Intervensi</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><InputLabel value="DJJ (bpm)" /><TextInput type="number" className="w-full py-2 text-sm" value={data.djj} onChange={(e) => setData('djj', e.target.value)} required /></div>
                                    <div><InputLabel value="Fe (Tab)" /><TextInput type="number" className="w-full py-2 text-sm" value={data.jumlah_fe} onChange={(e) => setData('jumlah_fe', e.target.value)} required /></div>
                                </div>
                                <div><InputLabel value="Imunisasi TT" /><TextInput placeholder="Misal: TT1" className="w-full py-2 text-sm" value={data.imunisasi_tt} onChange={(e) => setData('imunisasi_tt', e.target.value)} /></div>
                                <div><InputLabel value="Keluhan" /><textarea className="w-full rounded-xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[60px]" value={data.keluhan} onChange={(e) => setData('keluhan', e.target.value)} /></div>
                                <div><InputLabel value="Catatan" /><textarea className="w-full rounded-xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[60px]" value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 py-2.5 text-[10px]">Batal</SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-xl px-6 py-2.5 bg-seafoam-600 hover:bg-seafoam-700 text-white border-none font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-xl shadow-seafoam-200/50 min-w-[150px] flex justify-center">
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal show={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} maxWidth="2xl">
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="shrink-0 p-6 pb-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Detail Pemeriksaan</h2>
                            <p className="text-xs text-slate-500 font-medium">Informasi lengkap kesehatan ibu hamil.</p>
                        </div>
                        <button type="button" onClick={() => setIsDetailModalOpen(false)} className="rounded-xl bg-white p-1.5 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-rose-600 font-black text-xl shadow-sm">
                                {selectedPemeriksaan?.ibu_hamil?.nama?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">{selectedPemeriksaan?.ibu_hamil?.nama}</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No. RM: {selectedPemeriksaan?.ibu_hamil?.no_rm}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Periksa</p>
                                <p className="text-sm font-black text-slate-900">{selectedPemeriksaan?.tanggal_periksa}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Kondisi Fisik</h4>
                                <div className="grid grid-cols-1 gap-y-3 text-xs">
                                    <DetailItem label="Tekanan Darah" value={selectedPemeriksaan?.tekanan_darah + ' mmHg'} />
                                    <DetailItem label="Berat Badan" value={selectedPemeriksaan?.berat_badan + ' kg'} />
                                    <DetailItem label="Tinggi Badan" value={selectedPemeriksaan?.tinggi_badan + ' cm'} />
                                    <DetailItem label="LILA" value={selectedPemeriksaan?.lila + ' cm'} />
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Kondisi Janin</h4>
                                <div className="grid grid-cols-1 gap-y-3 text-xs">
                                    <DetailItem label="Tinggi Fundus (TFU)" value={selectedPemeriksaan?.tfu + ' cm'} />
                                    <DetailItem label="Detak Jantung (DJJ)" value={selectedPemeriksaan?.djj + ' bpm'} />
                                    <DetailItem label="Tablet Fe" value={selectedPemeriksaan?.jumlah_fe + ' Tablet'} />
                                    <DetailItem label="Imunisasi TT" value={selectedPemeriksaan?.imunisasi_tt || '-'} />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keluhan & Catatan</h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Keluhan Utama</p>
                                    <p className="text-sm text-slate-700 font-medium">{selectedPemeriksaan?.keluhan || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Catatan Petugas</p>
                                    <p className="text-sm text-slate-700 font-medium">{selectedPemeriksaan?.catatan || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                        <button onClick={() => setIsDetailModalOpen(false)} className="rounded-xl px-8 py-2.5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                            Tutup Detail
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md"><div className="flex flex-col items-center text-center p-12 text-sm"><div className="h-24 w-24 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 ring-[12px] ring-rose-50/50"><DeleteIcon size="48" /></div><h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Hapus Data?</h2><p className="text-slate-500 mb-6 text-sm font-medium">Tindakan ini permanen.</p><div className="flex w-full gap-4"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs text-slate-600">Batal</button><button onClick={() => destroy(route('pemeriksaan-ibu-hamil.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-rose-200">Hapus</button></div></div></Modal>
        </AuthenticatedLayout>
    );
}

function DetailItem({ label, value }) {
    return (<div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p><p className="text-sm font-extrabold text-slate-900">{value}</p></div>);
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "16" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const ActivityIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M9 12l2 2 4-4"></path></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
