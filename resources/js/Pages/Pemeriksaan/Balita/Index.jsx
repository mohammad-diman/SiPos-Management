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

export default function Index({ auth, pemeriksaans, balitas = [], filters, antrian_aktif }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isSmartGiziModalOpen, setIsSmartGiziInfoOpen] = useState(false);
    const [selectedPemeriksaan, setSelectedPemeriksaan] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        balita_id: '',
        tanggal_periksa: new Date().toISOString().split('T')[0],
        berat_badan: '',
        tinggi_badan: '',
        lingkar_kepala: '',
        status_gizi: 'Auto',
        perkembangan: '',
        catatan: '',
        imunisasi_bcg: false,
        imunisasi_dpt_hb_hib: false,
        imunisasi_polio: false,
        imunisasi_campak: false,
        imunisasi_rotavirus: false,
        imunisasi_pneumokokus: false,
        imunisasi_hepatitis_a: false,
        imunisasi_varisela: false,
        imunisasi_tifoid: false,
        imunisasi_influenza: false,
        imunisasi_hpv: false,
        vitamin_a_1: false,
        vitamin_a_2: false,
        jumlah_vit_b1: 0,
        jumlah_vit_c: 0,
        vitamin_lain: ''
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route('pemeriksaan-balita.index'),
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
                balita_id: p.balita_id || '',
                tanggal_periksa: p.tanggal_periksa || '',
                berat_badan: p.berat_badan || '',
                tinggi_badan: p.tinggi_badan || '',
                lingkar_kepala: p.lingkar_kepala || '',
                status_gizi: p.status_gizi || 'Baik',
                perkembangan: p.perkembangan || '',
                catatan: p.catatan || '',
                imunisasi_bcg: !!p.imunisasi_bcg,
                imunisasi_dpt_hb_hib: !!p.imunisasi_dpt_hb_hib,
                imunisasi_polio: !!p.imunisasi_polio,
                imunisasi_campak: !!p.imunisasi_campak,
                imunisasi_rotavirus: !!p.imunisasi_rotavirus,
                imunisasi_pneumokokus: !!p.imunisasi_pneumokokus,
                imunisasi_hepatitis_a: !!p.imunisasi_hepatitis_a,
                imunisasi_varisela: !!p.imunisasi_varisela,
                imunisasi_tifoid: !!p.imunisasi_tifoid,
                imunisasi_influenza: !!p.imunisasi_influenza,
                imunisasi_hpv: !!p.imunisasi_hpv,
                vitamin_a_1: !!p.vitamin_a_1,
                vitamin_a_2: !!p.vitamin_a_2,
                jumlah_vit_b1: p.jumlah_vit_b1 || 0,
                jumlah_vit_c: p.jumlah_vit_c || 0,
                vitamin_lain: p.vitamin_lain || ''
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
        const action = selectedPemeriksaan && selectedPemeriksaan.id ? route('pemeriksaan-balita.update', selectedPemeriksaan.id) : route('pemeriksaan-balita.store');

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
        <AuthenticatedLayout header={<span>Layanan Posyandu <span className="text-seafoam-500 mx-2">/</span> Pemeriksaan Balita</span>}>
            <Head title="Pemeriksaan Balita" />

            <div className="space-y-6">
                {/* Panel Antrian Aktif */}
                {antrian_aktif && (
                    <div className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="h-16 w-16 bg-white rounded-3xl flex flex-col items-center justify-center text-indigo-600 shadow-xl">
                                <span className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1">Nomor</span>
                                <span className="text-4xl font-black leading-none">{antrian_aktif.nomor_antrian}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{antrian_aktif.penduduk?.nama}</h2>
                                <p className="text-indigo-100 font-bold opacity-80 uppercase tracking-widest text-xs mt-1">Antrian Sekarang • Status: {antrian_aktif.status}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 relative z-10 w-full md:w-auto">
                            {antrian_aktif.status === 'menunggu' ? (
                                <button
                                    onClick={() => router.post(route('pemeriksaan-balita.panggil', antrian_aktif.id))}
                                    className="flex-1 md:flex-none px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                                >
                                    Panggil Sekarang
                                </button>
                            ) : (
                                <button
                                    onClick={() => openModal({ balita_id: balitas.find(b => b.nik === antrian_aktif.penduduk.nik)?.id, tanggal_periksa: new Date().toISOString().split('T')[0] })}
                                    className="flex-1 md:flex-none px-8 py-4 bg-seafoam-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-seafoam-600 transition-all shadow-xl active:scale-95 border border-seafoam-400"
                                >
                                    Mulai Periksa
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-72 group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><SearchIcon /></span>
                            <input type="text" placeholder="Cari Nama atau No. RM..." className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <PrimaryButton onClick={() => openModal()} className="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-seafoam-600 hover:bg-seafoam-700 border-none font-bold text-white text-[10px] uppercase tracking-widest shrink-0 shadow-lg shadow-seafoam-100">
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
                                    <th className="px-6 py-4">Nama Balita</th>
                                    <th className="px-6 py-4 text-center">BB / TB / LK</th>
                                    <th className="px-6 py-4 text-center">Status Gizi</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {pemeriksaans.data.map((p) => (
                                                                            <tr key={p.id} className="hover:bg-slate-50/40 transition-colors group">
                                                                            <td className="px-6 py-3 whitespace-nowrap font-bold text-slate-900">{p.tanggal_periksa}</td>
                                                                            <td className="px-6 py-3 whitespace-nowrap">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="h-8 w-8 rounded-lg bg-seafoam-50 flex items-center justify-center text-seafoam-600 font-black text-[10px]">{p.balita?.nama?.charAt(0)}</div>
                                                                                    <div><p className="text-[12px] font-extrabold text-slate-900 leading-tight">{p.balita?.nama}</p><p className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{p.balita?.no_rm}</p></div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-3 whitespace-nowrap text-center font-bold text-slate-600">{p.berat_badan}kg / {p.tinggi_badan}cm / {p.lingkar_kepala}cm</td>
                                                                            <td className="px-6 py-3 whitespace-nowrap text-center">
                                                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${p.status_gizi === 'Baik' ? 'bg-seafoam-50 text-seafoam-600' : 'bg-amber-50 text-amber-600'}`}>{p.status_gizi}</span>
                                                                            </td>
                                                                            <td className="px-6 py-3 whitespace-nowrap text-right">
                                                                                <div className="flex justify-end gap-1.5">
                                                                                    <button onClick={() => openDetailModal(p)} className="p-1.5 hover:text-seafoam-600 transition-colors" title="Lihat Detail"><ViewIcon /></button>
                                                                                    <button onClick={() => openModal(p)} className="p-1.5 hover:text-indigo-600 transition-colors" title="Edit"><EditIcon /></button>
                                                                                    <button onClick={() => { setDeletingId(p.id); setIsDeleteModalOpen(true); }} className="p-1.5 hover:text-rose-600 transition-colors" title="Hapus"><DeleteIcon /></button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>                                ))}
                                {pemeriksaans.data.length === 0 && (
                                    <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold text-[11px] uppercase tracking-widest italic">Tidak ada data pemeriksaan ditemukan</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
                        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">
                            Menampilkan {pemeriksaans.from || 0} - {pemeriksaans.to || 0} dari {pemeriksaans.total} Data
                        </p>
                        <Pagination links={pemeriksaans.links} />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col h-[85vh]">
                    <div className="shrink-0 p-6 pb-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedPemeriksaan && selectedPemeriksaan.id ? 'Edit' : 'Catat'} Pemeriksaan</h2>
                            <p className="text-xs text-slate-500 font-medium">Data Pertumbuhan, Imunisasi & Vitamin Balita</p>
                        </div>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-white p-1.5 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {/* Global Validation Errors Display */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 items-start">
                                <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                </div>
                                <div>
                                    <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mb-0.5">Kesalahan:</p>
                                    <ul className="text-rose-500 text-[11px] font-bold">
                                        {Object.values(errors).map((err, i) => <li key={i}>• {err}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Kiri: Antropometri */}
                            <div className="space-y-8">
                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-seafoam-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-seafoam-50 flex items-center justify-center text-seafoam-600 scale-75"><BabyIcon /></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-seafoam-600">1. Identitas & Antropometri</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <InputLabel value="Pilih Balita" />
                                            <select className="w-full rounded-xl border-none bg-slate-50 py-2.5 font-bold text-sm focus:ring-4 focus:ring-seafoam-500/10 transition-all cursor-pointer" value={data.balita_id} onChange={(e) => setData('balita_id', e.target.value)} required>
                                                <option value="">-- Pilih --</option>
                                                {balitas.map(b => <option key={b.id} value={b.id}>{b.no_rm} - {b.nama}</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><InputLabel value="Tanggal Periksa" /><TextInput type="date" className="w-full py-2 text-sm" value={data.tanggal_periksa} onChange={(e) => setData('tanggal_periksa', e.target.value)} required /></div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <InputLabel value="Status Gizi" className="!mb-0" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsSmartGiziInfoOpen(true)}
                                                        className="text-seafoam-500 hover:text-seafoam-600 transition-colors"
                                                        title="Apa itu Smart Gizi?"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <select className="w-full rounded-xl border-none bg-seafoam-50 py-2.5 font-bold text-sm focus:ring-4 focus:ring-seafoam-500/10 transition-all cursor-pointer text-seafoam-700" value={data.status_gizi} onChange={(e) => setData('status_gizi', e.target.value)}>
                                                    <option value="Auto">✨ Otomatis (Smart Gizi)</option>
                                                    <option value="Baik">Baik</option>
                                                    <option value="Kurang">Kurang</option>
                                                    <option value="Buruk">Buruk</option>
                                                    <option value="Lebih">Lebih</option>
                                                </select>
                                                <p className="text-[8px] text-seafoam-500 font-bold mt-1 uppercase tracking-widest leading-tight">Sistem akan menghitung status berdasarkan standar WHO secara otomatis.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div><InputLabel value="BB (kg)" /><TextInput type="number" step="0.01" className="w-full py-2 text-sm" value={data.berat_badan} onChange={(e) => setData('berat_badan', e.target.value)} required /></div>
                                            <div><InputLabel value="TB (cm)" /><TextInput type="number" step="0.01" className="w-full py-2 text-sm" value={data.tinggi_badan} onChange={(e) => setData('tinggi_badan', e.target.value)} required /></div>
                                            <div><InputLabel value="LK (cm)" /><TextInput type="number" step="0.01" className="w-full py-2 text-sm" value={data.lingkar_kepala} onChange={(e) => setData('lingkar_kepala', e.target.value)} required /></div>
                                        </div>
                                        <div><InputLabel value="Perkembangan" /><textarea className="w-full rounded-xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[60px]" value={data.perkembangan} onChange={(e) => setData('perkembangan', e.target.value)} /></div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-amber-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 scale-75"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-1.96.051l-2.387.477a2 2 0 01-1.406 0l-2.387-.477a6 6 0 00-1.96-.051l-2.387.477a2 2 0 01-1.022.547l-2.387.477a2 2 0 00-1.406 1.406l-.477 2.387a2 2 0 00.547 1.022l2.387 2.387a2 2 0 001.406.547h12.142a2 2 0 001.406-.547l2.387-2.387a2 2 0 00.547-1.022l-.477-2.387a2 2 0 00-1.406-1.406l-2.387-.477z" /></svg></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">2. Pemberian Vitamin</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <Checkbox label="Vit A1" value={data.vitamin_a_1} onChange={v => setData('vitamin_a_1', v)} />
                                        <Checkbox label="Vit A2" value={data.vitamin_a_2} onChange={v => setData('vitamin_a_2', v)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div><InputLabel value="Vit B1 (Tab)" /><TextInput type="number" className="w-full py-2 text-sm" value={data.jumlah_vit_b1} onChange={(e) => setData('jumlah_vit_b1', e.target.value)} /></div>
                                        <div><InputLabel value="Vit C (Tab)" /><TextInput type="number" className="w-full py-2 text-sm" value={data.jumlah_vit_c} onChange={(e) => setData('jumlah_vit_c', e.target.value)} /></div>
                                    </div>
                                    <div><InputLabel value="Vitamin Lain" /><TextInput className="w-full py-2 text-sm" value={data.vitamin_lain} onChange={(e) => setData('vitamin_lain', e.target.value)} /></div>
                                </section>
                            </div>

                            {/* Kanan: Imunisasi & Catatan */}
                            <div className="space-y-8">
                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 scale-75"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">3. Imunisasi Dasar</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Checkbox label="BCG" value={data.imunisasi_bcg} onChange={v => setData('imunisasi_bcg', v)} />
                                        <Checkbox label="DPT" value={data.imunisasi_dpt_hb_hib} onChange={v => setData('imunisasi_dpt_hb_hib', v)} />
                                        <Checkbox label="Polio" value={data.imunisasi_polio} onChange={v => setData('imunisasi_polio', v)} />
                                        <Checkbox label="Campak" value={data.imunisasi_campak} onChange={v => setData('imunisasi_campak', v)} />
                                        <Checkbox label="Rotavir" value={data.imunisasi_rotavirus} onChange={v => setData('imunisasi_rotavirus', v)} />
                                        <Checkbox label="Pneumo" value={data.imunisasi_pneumokokus} onChange={v => setData('imunisasi_pneumokokus', v)} />
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 scale-75"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.233-2.028-.618-3.016z" /></svg></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">4. Imunisasi Lanjutan</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Checkbox label="Hep A" value={data.imunisasi_hepatitis_a} onChange={v => setData('imunisasi_hepatitis_a', v)} />
                                        <Checkbox label="Varis" value={data.imunisasi_varisela} onChange={v => setData('imunisasi_varisela', v)} />
                                        <Checkbox label="Tifoid" value={data.imunisasi_tifoid} onChange={v => setData('imunisasi_tifoid', v)} />
                                        <Checkbox label="Influ" value={data.imunisasi_influenza} onChange={v => setData('imunisasi_influenza', v)} />
                                        <Checkbox label="HPV" value={data.imunisasi_hpv} onChange={v => setData('imunisasi_hpv', v)} />
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 scale-75"><ClipboardIcon /></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">5. Catatan</h3>
                                    </div>
                                    <div><textarea className="w-full rounded-xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[60px]" value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} /></div>
                                </section>
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
                            <p className="text-xs text-slate-500 font-medium">Informasi lengkap tumbuh kembang & kesehatan balita.</p>
                        </div>
                        <button type="button" onClick={() => setIsDetailModalOpen(false)} className="rounded-xl bg-white p-1.5 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-seafoam-50 rounded-2xl border border-seafoam-100">
                            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-seafoam-600 font-black text-xl shadow-sm">
                                {selectedPemeriksaan?.balita?.nama?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">{selectedPemeriksaan?.balita?.nama}</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No. RM: {selectedPemeriksaan?.balita?.no_rm}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Periksa</p>
                                <p className="text-sm font-black text-slate-900">{selectedPemeriksaan?.tanggal_periksa}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Antropometri</h4>
                                <div className="grid grid-cols-1 gap-y-3 text-xs">
                                    <DetailItem label="Berat Badan" value={selectedPemeriksaan?.berat_badan + ' kg'} />
                                    <DetailItem label="Tinggi Badan" value={selectedPemeriksaan?.tinggi_badan + ' cm'} />
                                    <DetailItem label="Lingkar Kepala" value={selectedPemeriksaan?.lingkar_kepala + ' cm'} />
                                    <DetailItem label="Status Gizi" value={selectedPemeriksaan?.status_gizi} />
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pemberian Vitamin</h4>
                                <div className="grid grid-cols-1 gap-y-3 text-xs">
                                    <DetailItem label="Vit A1 / A2" value={(selectedPemeriksaan?.vitamin_a_1 ? 'Diberikan' : '-') + ' / ' + (selectedPemeriksaan?.vitamin_a_2 ? 'Diberikan' : '-')} />
                                    <DetailItem label="Vit B1 / C" value={(selectedPemeriksaan?.jumlah_vit_b1 || 0) + ' / ' + (selectedPemeriksaan?.jumlah_vit_c || 0) + ' Tab'} />
                                    <DetailItem label="Vitamin Lain" value={selectedPemeriksaan?.vitamin_lain || '-'} />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pemberian Imunisasi</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Imunisasi Dasar</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[
                                            { key: 'imunisasi_bcg', label: 'BCG' },
                                            { key: 'imunisasi_dpt_hb_hib', label: 'DPT-HB-Hib' },
                                            { key: 'imunisasi_polio', label: 'Polio' },
                                            { key: 'imunisasi_campak', label: 'Campak' },
                                            { key: 'imunisasi_rotavirus', label: 'Rotavirus' },
                                            { key: 'imunisasi_pneumokokus', label: 'Pneumokokus' },
                                        ].map(i => (
                                            selectedPemeriksaan?.[i.key] ? (
                                                <span key={i.key} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black border border-indigo-100">
                                                    {i.label}
                                                </span>
                                            ) : null
                                        ))}
                                        {![
                                            'imunisasi_bcg', 'imunisasi_dpt_hb_hib', 'imunisasi_polio',
                                            'imunisasi_campak', 'imunisasi_rotavirus', 'imunisasi_pneumokokus'
                                        ].some(k => selectedPemeriksaan?.[k]) && (
                                            <span className="text-[10px] text-slate-400 italic">Tidak ada</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Imunisasi Lanjutan</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[
                                            { key: 'imunisasi_hepatitis_a', label: 'Hepatitis A' },
                                            { key: 'imunisasi_varisela', label: 'Varisela' },
                                            { key: 'imunisasi_tifoid', label: 'Tifoid' },
                                            { key: 'imunisasi_influenza', label: 'Influenza' },
                                            { key: 'imunisasi_hpv', label: 'HPV' }
                                        ].map(i => (
                                            selectedPemeriksaan?.[i.key] ? (
                                                <span key={i.key} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black border border-indigo-100">
                                                    {i.label}
                                                </span>
                                            ) : null
                                        ))}
                                        {![
                                            'imunisasi_hepatitis_a', 'imunisasi_varisela', 'imunisasi_tifoid',
                                            'imunisasi_influenza', 'imunisasi_hpv'
                                        ].some(k => selectedPemeriksaan?.[k]) && (
                                            <span className="text-[10px] text-slate-400 italic">Tidak ada</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Perkembangan & Catatan</h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Perkembangan</p>
                                    <p className="text-sm text-slate-700 font-medium">{selectedPemeriksaan?.perkembangan || '-'}</p>
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

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md"><div className="flex flex-col items-center text-center p-12 text-sm"><div className="h-16 w-16 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-6 ring-[12px] ring-rose-50/50"><DeleteIcon size="48" /></div><h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Hapus Data?</h2><p className="text-slate-500 mb-10 text-sm font-medium">Tindakan ini tidak dapat dibatalkan.</p><div className="flex w-full gap-4"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs text-slate-600">Batal</button><button onClick={() => destroy(route('pemeriksaan-balita.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-rose-200">Ya, Hapus</button></div></div></Modal>

            <Modal show={isSmartGiziModalOpen} onClose={() => setIsSmartGiziInfoOpen(false)} maxWidth="md">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-seafoam-500 flex items-center justify-center text-white text-2xl animate-pulse">
                            ✨
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Smart Gizi</h2>
                            <p className="text-[10px] text-seafoam-600 font-black uppercase tracking-[0.2em]">Kecerdasan Buatan Posyandu</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            <b>Smart Gizi</b> adalah fitur cerdas yang menghitung status gizi balita secara otomatis berdasarkan standar antropometri <b>WHO/Kemenkes 2020</b>.
                        </p>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div className="flex items-start gap-3 text-xs">
                                <span className="text-seafoam-500 font-black mt-0.5">✓</span>
                                <p className="text-slate-600">Menggunakan perhitungan <b>Z-Score (BB/U)</b>.</p>
                            </div>
                            <div className="flex items-start gap-3 text-xs">
                                <span className="text-seafoam-500 font-black mt-0.5">✓</span>
                                <p className="text-slate-600">Membandingkan Berat Badan dengan Umur dan Jenis Kelamin secara akurat.</p>
                            </div>
                            <div className="flex items-start gap-3 text-xs">
                                <span className="text-seafoam-500 font-black mt-0.5">✓</span>
                                <p className="text-slate-600">Membantu kader memberikan diagnosa dini tanpa perlu menghitung manual.</p>
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-400 italic">
                            *Jika Anda tetap ingin mengisi secara manual, cukup ganti opsi dropdown ke pilihan selain "Otomatis".
                        </p>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => setIsSmartGiziInfoOpen(false)}
                            className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Saya Mengerti
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

function Checkbox({ label, value, onChange }) {
    return (
        <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-seafoam-200 transition-all cursor-pointer">
            <input
                type="checkbox"
                checked={value}
                onChange={e => onChange(e.target.checked)}
                className="rounded-lg border-slate-200 text-seafoam-600 focus:ring-seafoam-500"
            />
            <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider leading-none">{label}</span>
        </label>
    );
}

function DetailItem({ label, value }) {
    return (<div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p><p className="text-sm font-extrabold text-slate-900">{value}</p></div>);
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "16" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const BabyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M10 16c.5 1 1.5 1 2 1s1.5 0 2-1"></path><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M9 12l2 2 4-4"></path></svg>;
const ActivityIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
