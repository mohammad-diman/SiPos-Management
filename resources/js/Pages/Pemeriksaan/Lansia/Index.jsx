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

export default function Index({ auth, pemeriksaans, lansias = [], filters, antrian_aktif }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPemeriksaan, setSelectedPemeriksaan] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    
    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        lansia_id: '', 
        tanggal_periksa: new Date().toISOString().split('T')[0],
        nama_kader: '', 
        berat_badan: '', 
        tinggi_badan: '', 
        lingkar_perut: '',
        imt: '',
        tekanan_darah: '', 
        nadi: '', 
        suhu_tubuh: '',
        gula_darah: '', 
        kolesterol: '', 
        asam_urat: '',
        riwayat_merokok: false,
        riwayat_alkohol: false,
        frekuensi_olahraga_per_minggu: '',
        riwayat_penyakit: '',
        keluhan_utama: '',
        gangguan_penglihatan: false,
        gangguan_pendengaran: false,
        status_gizi: 'Normal',
        obat: '',
        konseling: '',
        rujukan: false,
        catatan: ''
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route('pemeriksaan-lansia.index'),
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
                lansia_id: p.lansia_id || '', 
                tanggal_periksa: p.tanggal_periksa || '',
                nama_kader: p.nama_kader || '', 
                berat_badan: p.berat_badan || '', 
                tinggi_badan: p.tinggi_badan || '',
                lingkar_perut: p.lingkar_perut || '', 
                imt: p.imt || '',
                tekanan_darah: p.tekanan_darah || '',
                nadi: p.nadi || '', 
                suhu_tubuh: p.suhu_tubuh || '',
                gula_darah: p.gula_darah || '', 
                kolesterol: p.kolesterol || '', 
                asam_urat: p.asam_urat || '',
                riwayat_merokok: p.riwayat_merokok === 1 || p.riwayat_merokok === true,
                riwayat_alkohol: p.riwayat_alkohol === 1 || p.riwayat_alkohol === true,
                frekuensi_olahraga_per_minggu: p.frekuensi_olahraga_per_minggu || '',
                riwayat_penyakit: p.riwayat_penyakit || '',
                keluhan_utama: p.keluhan_utama || '',
                gangguan_penglihatan: p.gangguan_penglihatan === 1 || p.gangguan_penglihatan === true,
                gangguan_pendengaran: p.gangguan_pendengaran === 1 || p.gangguan_pendengaran === true,
                status_gizi: p.status_gizi || 'Normal',
                obat: p.obat || '',
                konseling: p.konseling || '',
                rujukan: p.rujukan === 1 || p.rujukan === true,
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
        const action = selectedPemeriksaan && selectedPemeriksaan.id ? route('pemeriksaan-lansia.update', selectedPemeriksaan.id) : route('pemeriksaan-lansia.store');
        
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
        <AuthenticatedLayout header={<span>Layanan Posbindu <span className="text-seafoam-500 mx-2">/</span> Pemeriksaan Lansia</span>}>
            <Head title="Pemeriksaan Lansia" />

            <div className="space-y-6">
                {/* Panel Antrian Aktif */}
                {antrian_aktif && (
                    <div className="bg-amber-500 rounded-3xl p-6 text-white shadow-2xl shadow-amber-200 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="h-20 w-20 bg-white rounded-2xl flex flex-col items-center justify-center text-amber-500 shadow-xl">
                                <span className="text-[9px] font-black uppercase tracking-tighter leading-none mb-1">Nomor</span>
                                <span className="text-3xl font-black leading-none">{antrian_aktif.nomor_antrian}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{antrian_aktif.penduduk?.nama}</h2>
                                <p className="text-amber-50 font-bold opacity-80 uppercase tracking-widest text-[10px] mt-1">Status: {antrian_aktif.status}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 relative z-10 w-full md:w-auto">
                            {antrian_aktif.status === 'menunggu' ? (
                                <button 
                                    onClick={() => router.post(route('pemeriksaan-lansia.panggil', antrian_aktif.id))}
                                    className="flex-1 md:flex-none px-8 py-4 bg-white text-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-50 transition-all shadow-xl active:scale-95"
                                >
                                    Panggil Sekarang
                                </button>
                            ) : (
                                <button 
                                    onClick={() => openModal({ lansia_id: lansias.find(l => l.nik === antrian_aktif.penduduk.nik)?.id, tanggal_periksa: new Date().toISOString().split('T')[0] })}
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
                            <input type="text" placeholder="Cari Nama Lansia..." className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <PrimaryButton onClick={() => openModal()} className="w-full sm:w-auto rounded-xl px-5 py-2.5 bg-amber-500 hover:bg-amber-600 border-none font-bold text-white text-[10px] uppercase tracking-widest shrink-0 shadow-lg shadow-amber-100">
                            + Catat
                        </PrimaryButton>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-5 py-2 rounded-full border border-slate-100 shrink-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Data:</span>
                        <span className="text-[12px] font-black text-slate-600 ml-1 leading-none">{pemeriksaans.total}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto text-[12px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Nama Lansia</th>
                                    <th className="px-6 py-4 text-center">Tensi / BB / TB</th>
                                    <th className="px-6 py-4 text-center">Gula / Kolest / Asam</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {pemeriksaans.data.map((p) => (
                                                                            <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                                                                                <td className="px-6 py-3 whitespace-nowrap font-bold text-slate-900">{p.tanggal_periksa}</td>
                                                                                <td className="px-6 py-3 whitespace-nowrap">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-black text-[10px]">{p.lansia?.nama?.charAt(0)}</div>
                                                                                        <div><p className="text-[12px] font-extrabold text-slate-900 leading-tight">{p.lansia?.nama}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{p.lansia?.no_rm}</p></div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-6 py-3 whitespace-nowrap text-center font-bold text-slate-600">{p.tekanan_darah} / {p.berat_badan}kg / {p.tinggi_badan}cm</td>
                                                                                <td className="px-6 py-3 whitespace-nowrap text-center">
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <span className="text-[10px] font-black text-seafoam-600">G: {p.gula_darah || '-'} | K: {p.kolesterol || '-'} | A: {p.asam_urat || '-'}</span>
                                                                                    </div>
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
                                    <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium italic font-bold text-[11px] uppercase tracking-widest">Tidak ada data ditemukan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
                        <span className="font-black text-slate-400 uppercase tracking-widest">Menampilkan {pemeriksaans.from || 0} - {pemeriksaans.to || 0} dari {pemeriksaans.total} Data</span>
                        <Pagination links={pemeriksaans.links} />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col h-[85vh]">
                    <div className="shrink-0 p-6 pb-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedPemeriksaan && selectedPemeriksaan.id ? 'Edit' : 'Catat'} Skrining</h2>
                            <p className="text-xs text-slate-500 font-medium">Formulir Pemeriksaan Lengkap Posbindu PTM</p>
                        </div>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-white p-1.5 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                                <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    Kesalahan:
                                </p>
                                <ul className="text-rose-500 text-[11px] font-bold">
                                    {Object.values(errors).map((err, i) => <li key={i}>• {err}</li>)}
                                </ul>
                            </div>
                        )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Kiri: Fisik & Lab */}
                            <div className="space-y-8">
                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-amber-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 scale-75"><ActivityIcon size={18} /></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">1. Identitas & Vital Sign</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div><InputLabel value="Pilih Lansia" /><select className="w-full rounded-xl border-none bg-slate-50 py-2.5 font-bold text-sm focus:ring-4 focus:ring-amber-500/10 transition-all" value={data.lansia_id} onChange={(e) => setData('lansia_id', e.target.value)} required><option value="">-- Pilih --</option>{lansias.map(l => <option key={l.id} value={l.id}>{l.no_rm} - {l.nama}</option>)}</select></div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><InputLabel value="Tanggal" /><TextInput type="date" className="w-full py-2 text-sm" value={data.tanggal_periksa} onChange={(e) => setData('tanggal_periksa', e.target.value)} required /></div>
                                            <div><InputLabel value="Tensi" /><TextInput placeholder="120/80" className="w-full py-2 text-sm" value={data.tekanan_darah} onChange={(e) => setData('tekanan_darah', e.target.value)} required /></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div><InputLabel value="BB (kg)" /><TextInput type="number" step="0.1" className="w-full py-2 text-sm" value={data.berat_badan} onChange={(e) => setData('berat_badan', e.target.value)} required /></div>
                                            <div><InputLabel value="TB (cm)" /><TextInput type="number" step="0.1" className="w-full py-2 text-sm" value={data.tinggi_badan} onChange={(e) => setData('tinggi_badan', e.target.value)} required /></div>
                                            <div><InputLabel value="L.Perut" /><TextInput type="number" step="0.1" className="w-full py-2 text-sm" value={data.lingkar_perut} onChange={(e) => setData('lingkar_perut', e.target.value)} /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><InputLabel value="Nadi" /><TextInput type="number" className="w-full py-2 text-sm" value={data.nadi} onChange={(e) => setData('nadi', e.target.value)} /></div>
                                            <div><InputLabel value="Suhu" /><TextInput type="number" step="0.1" className="w-full py-2 text-sm" value={data.suhu_tubuh} onChange={(e) => setData('suhu_tubuh', e.target.value)} /></div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-seafoam-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-seafoam-50 flex items-center justify-center text-seafoam-600 scale-75"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-1.96.051l-2.387.477a2 2 0 01-1.406 0l-2.387-.477a6 6 0 00-1.96-.051l-2.387.477a2 2 0 01-1.022.547l-2.387.477a2 2 0 00-1.406 1.406l-.477 2.387a2 2 0 00.547 1.022l2.387 2.387a2 2 0 001.406.547h12.142a2 2 0 001.406-.547l2.387-2.387a2 2 0 00.547-1.022l-.477-2.387a2 2 0 00-1.406-1.406l-2.387-.477z" /></svg></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-seafoam-600">2. Hasil Laboratorium</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div><InputLabel value="Gula (mg/dL)" /><TextInput type="number" className="w-full py-2 text-sm" value={data.gula_darah} onChange={(e) => setData('gula_darah', e.target.value)} /></div>
                                        <div><InputLabel value="Kolest (mg/dL)" /><TextInput type="number" className="w-full py-2 text-sm" value={data.kolesterol} onChange={(e) => setData('kolesterol', e.target.value)} /></div>
                                        <div><InputLabel value="Asam Urat" /><TextInput type="number" step="0.1" className="w-full py-2 text-sm" value={data.asam_urat} onChange={(e) => setData('asam_urat', e.target.value)} /></div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 scale-75"><ClipboardIcon size={18} /></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">3. Riwayat Penyakit</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div><InputLabel value="Riwayat Penyakit (Dulu/Sekarang)" /><textarea className="w-full rounded-xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[80px]" value={data.riwayat_penyakit} onChange={(e) => setData('riwayat_penyakit', e.target.value)} placeholder="Contoh: Hipertensi, Diabetes, Jantung..." /></div>
                                    </div>
                                </section>
                            </div>

                            {/* Kanan: Kebiasaan & Intervensi */}
                            <div className="space-y-8">
                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 scale-75"><UsersIcon size={18} /></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">4. Kebiasaan & Keluhan</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <Checkbox label="Merokok" value={data.riwayat_merokok} onChange={v => setData('riwayat_merokok', v)} />
                                        <Checkbox label="Alkohol" value={data.riwayat_alkohol} onChange={v => setData('riwayat_alkohol', v)} />
                                        <Checkbox label="Gg. Mata" value={data.gangguan_penglihatan} onChange={v => setData('gangguan_penglihatan', v)} />
                                        <Checkbox label="Gg. Teli" value={data.gangguan_pendengaran} onChange={v => setData('gangguan_pendengaran', v)} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div><InputLabel value="Olahraga (/mgg)" /><TextInput type="number" className="w-full py-2 text-sm" value={data.frekuensi_olahraga_per_minggu} onChange={(e) => setData('frekuensi_olahraga_per_minggu', e.target.value)} /></div>
                                        <div><InputLabel value="Keluhan Utama" /><textarea className="w-full rounded-xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[60px]" value={data.keluhan_utama} onChange={(e) => setData('keluhan_utama', e.target.value)} /></div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-4 border-b border-rose-100 pb-2">
                                        <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 scale-75"><ClipboardIcon size={18} /></div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">5. Intervensi</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div><InputLabel value="Obat yang Diberikan" /><TextInput className="w-full py-2 text-sm" value={data.obat} onChange={(e) => setData('obat', e.target.value)} placeholder="Contoh: Amlodipine 5mg, Paracetamol..." /></div>
                                        <div><InputLabel value="Konseling" /><textarea className="w-full rounded-xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[60px]" value={data.konseling} onChange={(e) => setData('konseling', e.target.value)} /></div>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex-1"><InputLabel value="Status Gizi" /><select className="w-full rounded-xl border-none bg-slate-50 py-2.5 font-bold text-sm" value={data.status_gizi} onChange={(e) => setData('status_gizi', e.target.value)}><option value="Kurus">Kurus</option><option value="Normal">Normal</option><option value="Gemuk">Gemuk</option><option value="Obesitas">Obesitas</option></select></div>
                                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer h-full mt-6">
                                                <input type="checkbox" checked={data.rujukan} onChange={e => setData('rujukan', e.target.checked)} className="rounded text-rose-600 focus:ring-rose-500" />
                                                <span className="text-[10px] font-black uppercase text-rose-600">Rujukan</span>
                                            </div>
                                        </div>
                                        <div><InputLabel value="Nama Kader" /><TextInput className="w-full py-2 text-sm" value={data.nama_kader} onChange={(e) => setData('nama_kader', e.target.value)} /></div>
                                    </div>
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
                            <p className="text-xs text-slate-500 font-medium">Informasi lengkap hasil skrining kesehatan lansia.</p>
                        </div>
                        <button type="button" onClick={() => setIsDetailModalOpen(false)} className="rounded-xl bg-white p-1.5 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-amber-600 font-black text-xl shadow-sm">
                                {selectedPemeriksaan?.lansia?.nama?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 leading-tight">{selectedPemeriksaan?.lansia?.nama}</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No. RM: {selectedPemeriksaan?.lansia?.no_rm}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Periksa</p>
                                <p className="text-sm font-black text-slate-900">{selectedPemeriksaan?.tanggal_periksa}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tanda-tanda Vital</h4>
                                <div className="grid grid-cols-2 gap-y-3 text-xs">
                                    <DetailItem label="Tekanan Darah" value={selectedPemeriksaan?.tekanan_darah + ' mmHg'} />
                                    <DetailItem label="Nadi" value={selectedPemeriksaan?.nadi ? selectedPemeriksaan.nadi + ' bpm' : '-'} />
                                    <DetailItem label="Berat Badan" value={selectedPemeriksaan?.berat_badan + ' kg'} />
                                    <DetailItem label="Tinggi Badan" value={selectedPemeriksaan?.tinggi_badan + ' cm'} />
                                    <DetailItem label="Lingkar Perut" value={selectedPemeriksaan?.lingkar_perut ? selectedPemeriksaan.lingkar_perut + ' cm' : '-'} />
                                    <DetailItem label="Suhu Tubuh" value={selectedPemeriksaan?.suhu_tubuh ? selectedPemeriksaan.suhu_tubuh + ' °C' : '-'} />
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Hasil Laboratorium</h4>
                                <div className="grid grid-cols-1 gap-y-3 text-xs">
                                    <DetailItem label="Gula Darah" value={selectedPemeriksaan?.gula_darah ? selectedPemeriksaan.gula_darah + ' mg/dL' : '-'} />
                                    <DetailItem label="Kolesterol" value={selectedPemeriksaan?.kolesterol ? selectedPemeriksaan.kolesterol + ' mg/dL' : '-'} />
                                    <DetailItem label="Asam Urat" value={selectedPemeriksaan?.asam_urat ? selectedPemeriksaan.asam_urat + ' mg/dL' : '-'} />
                                    <DetailItem label="Status Gizi" value={selectedPemeriksaan?.status_gizi} />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Kebiasaan & Riwayat</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Status & Gangguan</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPemeriksaan?.riwayat_merokok ? <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold">Merokok</span> : null}
                                        {selectedPemeriksaan?.riwayat_alkohol ? <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold">Alkohol</span> : null}
                                        {selectedPemeriksaan?.gangguan_penglihatan ? <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold">Gg. Penglihatan</span> : null}
                                        {selectedPemeriksaan?.gangguan_pendengaran ? <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold">Gg. Pendengaran</span> : null}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <DetailItem label="Olahraga" value={selectedPemeriksaan?.frekuensi_olahraga_per_minggu ? selectedPemeriksaan.frekuensi_olahraga_per_minggu + ' kali / minggu' : '-'} />
                                    <DetailItem label="Riwayat Penyakit" value={selectedPemeriksaan?.riwayat_penyakit || '-'} />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keluhan & Intervensi</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Keluhan Utama</p>
                                        <p className="text-sm text-slate-700 font-medium">{selectedPemeriksaan?.keluhan_utama || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Obat yang Diberikan</p>
                                        <p className="text-sm text-slate-700 font-medium">{selectedPemeriksaan?.obat || '-'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Konseling / Saran</p>
                                    <p className="text-sm text-slate-700 font-medium">{selectedPemeriksaan?.konseling || '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kader Pemeriksa</p>
                                <p className="text-sm font-black uppercase tracking-tight">{selectedPemeriksaan?.nama_kader || '-'}</p>
                            </div>
                            {selectedPemeriksaan?.rujukan ? (
                                <div className="px-4 py-2 bg-rose-500 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-rose-500/20">
                                    Perlu Rujukan
                                </div>
                            ) : (
                                <div className="px-4 py-2 bg-seafoam-500 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-seafoam-500/20">
                                    Kondisi Baik
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                        <button onClick={() => setIsDetailModalOpen(false)} className="rounded-xl px-8 py-2.5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                            Tutup Detail
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md"><div className="flex flex-col items-center text-center p-12"><div className="h-24 w-24 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 ring-[12px] ring-rose-50/50"><DeleteIcon size="48" /></div><h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Hapus Data?</h2><p className="text-slate-500 mb-6 text-sm font-medium">Tindakan ini permanen.</p><div className="flex w-full gap-3"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded-2xl font-black text-xs text-slate-600">Batal</button><button onClick={() => destroy(route('pemeriksaan-lansia.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-2 bg-rose-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-rose-200 text-xs">Hapus</button></div></div></Modal>
        </AuthenticatedLayout>
    );
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "16" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const ActivityIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const ClipboardIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M9 12l2 2 4-4"></path></svg>;
const UsersIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

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