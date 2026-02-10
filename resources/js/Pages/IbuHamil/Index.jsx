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

export default function Index({ auth, ibu_hamils, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedIbuHamil, setSelectedIbuHamil] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        no_rm: '', nama: '', nik: '', tanggal_lahir: '', nama_suami: '', alamat: '',
        no_hp: '', usia_kehamilan: '', hpht: '', tgl_lahir_anak_terakhir: '',
        golongan_darah: '', riwayat_penyakit: ''
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route('ibu-hamil.index'),
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

    const openModal = (ih = null) => {
        if (ih) {
            setSelectedIbuHamil(ih);
            setData({
                no_rm: ih.no_rm || '', nama: ih.nama || '', nik: ih.nik || '', tanggal_lahir: ih.tanggal_lahir || '', 
                nama_suami: ih.nama_suami || '', alamat: ih.alamat || '', no_hp: ih.no_hp || '', 
                usia_kehamilan: ih.usia_kehamilan || '', hpht: ih.hpht || '', 
                tgl_lahir_anak_terakhir: ih.tgl_lahir_anak_terakhir || '', 
                golongan_darah: ih.golongan_darah || '', riwayat_penyakit: ih.riwayat_penyakit || ''
            });
        } else {
            setSelectedIbuHamil(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setSelectedIbuHamil(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        const action = selectedIbuHamil ? route('ibu-hamil.update', selectedIbuHamil.id) : route('ibu-hamil.store');
        const method = selectedIbuHamil ? patch : post;
        method(action, { onSuccess: () => closeModal() });
    };

    return (
        <AuthenticatedLayout header={<span>Data Master <span className="text-seafoam-500 mx-2">/</span> Ibu Hamil</span>}>
            <Head title="Master Ibu Hamil" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-80 group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><SearchIcon /></span>
                            <input type="text" placeholder="Cari No. RM atau Nama..." className="w-full rounded-xl border-none bg-slate-50 py-3 pl-11 pr-4 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-emerald-500/10 transition-all" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <a 
                                href={route('export.excel', 'ibu-hamil')} 
                                className="flex-1 md:flex-none rounded-full px-5 py-2 bg-white border-2 border-seafoam-100 text-seafoam-600 hover:bg-seafoam-50 hover:border-seafoam-200 font-black text-[9px] uppercase tracking-[0.15em] shadow-sm transition-all text-center flex items-center justify-center"
                            >
                                Excel
                            </a>
                            <a 
                                href={route('export.pdf', 'ibu-hamil')} 
                                className="flex-1 md:flex-none rounded-full px-5 py-2 bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-black text-[9px] uppercase tracking-[0.15em] shadow-sm transition-all text-center flex items-center justify-center"
                            >
                                PDF
                            </a>
                            <PrimaryButton onClick={() => openModal()} className="flex-[2] md:flex-none rounded-full px-6 py-2 bg-rose-500 hover:bg-rose-600 border-none font-black text-white text-[9px] uppercase tracking-[0.15em] shadow-lg shadow-rose-100 shrink-0 flex items-center justify-center">+ Tambah</PrimaryButton>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-5 py-2 rounded-full border border-slate-100 shrink-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Data:</span>
                        <span className="text-[12px] font-black text-slate-600 ml-1 leading-none">{ibu_hamils.total}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden text-[12px]">
                    <div className="overflow-x-auto text-[12px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-6 py-4">No. Rekam Medis / Nama</th>
                                    <th className="px-6 py-4">Nama Suami</th>
                                    <th className="px-6 py-4 text-center">Usia Kehamilan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {ibu_hamils.data.map((ih) => (
                                    <tr key={ih.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 font-black text-[10px]">{ih.nama?.charAt(0)}</div>
                                                <div><p className="text-[12px] font-extrabold text-slate-900 leading-tight">{ih.nama}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{ih.no_rm}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-[12px] font-bold text-slate-600">{ih.nama_suami}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-center text-[12px]"><span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black">{ih.usia_kehamilan} Minggu</span></td>
                                        <td className="px-6 py-3 whitespace-nowrap text-right"><div className="flex justify-end gap-1.5"><ActionButton title="Lihat Detail" onClick={() => { setSelectedIbuHamil(ih); setIsDetailModalOpen(true); }} color="seafoam"><ViewIcon /></ActionButton><ActionButton title="Edit Data" onClick={() => openModal(ih)} color="indigo"><EditIcon /></ActionButton><ActionButton title="Hapus Data" onClick={() => { setDeletingId(ih.id); setIsDeleteModalOpen(true); }} color="rose"><DeleteIcon /></ActionButton></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between text-[11px]">
                        <span className="font-black text-slate-400 uppercase tracking-widest">Menampilkan {ibu_hamils.from || 0} - {ibu_hamils.to || 0} dari {ibu_hamils.total} Data</span>
                        <Pagination links={ibu_hamils.links} />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
                    <div className="shrink-0 p-6 pb-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedIbuHamil ? 'Edit' : 'Registrasi'} Ibu</h2>
                            <p className="text-xs text-slate-500 font-medium">Data Master Kehamilan & KIA</p>
                        </div>
                        <button type="button" onClick={closeModal} className="rounded-xl bg-white p-1.5 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                            <div><InputLabel value="No. RM" /><TextInput className="w-full py-2 text-sm font-bold" value={data.no_rm} onChange={(e) => setData('no_rm', e.target.value)} required /><p className="text-rose-500 text-[10px] mt-1">{errors.no_rm}</p></div>
                            <div><InputLabel value="Nama Lengkap" /><TextInput className="w-full py-2 text-sm font-bold" value={data.nama} onChange={(e) => setData('nama', e.target.value)} required /><p className="text-rose-500 text-[10px] mt-1">{errors.nama}</p></div>
                            <div><InputLabel value="NIK" /><TextInput className="w-full py-2 text-sm font-bold" value={data.nik} onChange={(e) => setData('nik', e.target.value)} required /><p className="text-rose-500 text-[10px] mt-1">{errors.nik}</p></div>
                            <div><InputLabel value="Nama Suami" /><TextInput className="w-full py-2 text-sm font-bold" value={data.nama_suami} onChange={(e) => setData('nama_suami', e.target.value)} required /><p className="text-rose-500 text-[10px] mt-1">{errors.nama_suami}</p></div>
                            <div><InputLabel value="Tgl Lahir" /><TextInput type="date" className="w-full py-2 text-sm font-bold" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} required /><p className="text-rose-500 text-[10px] mt-1">{errors.tanggal_lahir}</p></div>
                            <div><InputLabel value="Usia Hamil (mgg)" /><TextInput type="number" className="w-full py-2 text-sm font-bold" value={data.usia_kehamilan} onChange={(e) => setData('usia_kehamilan', e.target.value)} required /><p className="text-rose-500 text-[10px] mt-1">{errors.usia_kehamilan}</p></div>
                            <div><InputLabel value="HPHT" /><TextInput type="date" className="w-full py-2 text-sm font-bold" value={data.hpht} onChange={(e) => setData('hpht', e.target.value)} required /><p className="text-rose-500 text-[10px] mt-1">{errors.hpht}</p></div>
                            <div><InputLabel value="Anak Terakhir" /><TextInput type="date" className="w-full py-2 text-sm font-bold" value={data.tgl_lahir_anak_terakhir} onChange={(e) => setData('tgl_lahir_anak_terakhir', e.target.value)} /></div>
                            <div><InputLabel value="Gol. Darah" /><select className="w-full rounded-xl border-none bg-slate-50 py-2.5 text-sm font-bold text-slate-700" value={data.golongan_darah} onChange={(e) => setData('golongan_darah', e.target.value)}><option value="">-- Pilih --</option><option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option></select></div>
                            <div><InputLabel value="No. HP Ibu" /><TextInput className="w-full py-2 text-sm font-bold" value={data.no_hp} onChange={(e) => setData('no_hp', e.target.value)} /></div>
                            <div className="md:col-span-2"><InputLabel value="Riwayat Penyakit" /><textarea className="w-full rounded-xl border-none bg-slate-50 py-2.5 px-4 text-sm font-bold min-h-[60px]" value={data.riwayat_penyakit} onChange={(e) => setData('riwayat_penyakit', e.target.value)} /></div>
                            <div className="md:col-span-2"><InputLabel value="Alamat" /><textarea className="w-full rounded-xl border-none bg-slate-50 py-2.5 px-4 text-sm font-bold min-h-[60px]" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} required /></div>
                        </div>
                    </div>
                    <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={closeModal} className="rounded-xl px-5 py-2.5 border-none bg-white shadow-sm text-slate-600 font-bold text-[10px]">Batal</SecondaryButton>
                        <PrimaryButton processing={processing} className="rounded-xl px-6 py-2.5 bg-seafoam-600 hover:bg-seafoam-700 text-white border-none font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-xl shadow-seafoam-200/50 min-w-[150px] flex justify-center">
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} maxWidth="4xl">
                <div className="p-6 flex flex-col max-h-[90vh]">
                    <div className="shrink-0 flex justify-between items-start mb-6"><div className="flex items-center gap-4"><div className="h-14 w-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-rose-200">{selectedIbuHamil?.nama?.charAt(0)}</div><div><h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedIbuHamil?.nama}</h2><p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">RM: {selectedIbuHamil?.no_rm}</p></div></div><button onClick={() => setIsDetailModalOpen(false)} className="rounded-xl bg-slate-50 p-2 text-slate-400 hover:text-slate-600 transition-all active:scale-95"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-3 flex items-center gap-2"><span className="w-6 h-px bg-rose-100"></span> Informasi Kehamilan & Personal</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <DetailItem label="NIK" value={selectedIbuHamil?.nik} />
                                <DetailItem label="Tanggal Lahir" value={selectedIbuHamil?.tanggal_lahir} />
                                <DetailItem label="Nama Suami" value={selectedIbuHamil?.nama_suami} />
                                <DetailItem label="No. HP" value={selectedIbuHamil?.no_hp || '-'} />
                                <DetailItem label="Usia Hamil" value={selectedIbuHamil?.usia_kehamilan + ' mgg'} />
                                <DetailItem label="HPHT" value={selectedIbuHamil?.hpht} />
                                <DetailItem label="Anak Terakhir" value={selectedIbuHamil?.tgl_lahir_anak_terakhir || '-'} />
                                <DetailItem label="Gol. Darah" value={selectedIbuHamil?.golongan_darah || '-'} />
                                <div className="col-span-2 md:col-span-4"><DetailItem label="Alamat" value={selectedIbuHamil?.alamat} /></div>
                                <div className="col-span-2 md:col-span-4"><DetailItem label="Riwayat Penyakit" value={selectedIbuHamil?.riwayat_penyakit || 'Tidak ada riwayat penyakit.'} /></div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-seafoam-500 mb-3 flex items-center gap-2"><span className="w-6 h-px bg-seafoam-100"></span> Riwayat Pemeriksaan Klinis</h3>
                            <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="px-4 py-3">Tanggal</th>
                                            <th className="px-4 py-3">Tensi</th>
                                            <th className="px-4 py-3">BB (kg)</th>
                                            <th className="px-4 py-3 text-center">LILA/TFU</th>
                                            <th className="px-4 py-3 text-center">DJJ/Fe</th>
                                            <th className="px-4 py-3">Keluhan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {selectedIbuHamil?.pemeriksaans?.length > 0 ? (
                                            selectedIbuHamil.pemeriksaans.map((p) => (
                                                <tr key={p.id} className="text-[11px]">
                                                    <td className="px-4 py-3 font-bold text-slate-700">{p.tanggal_periksa}</td>
                                                    <td className="px-4 py-3 font-black text-rose-600">{p.tekanan_darah}</td>
                                                    <td className="px-4 py-3 text-slate-600">{p.berat_badan}</td>
                                                    <td className="px-4 py-3 text-center text-slate-600">{p.lila} / {p.tfu} cm</td>
                                                    <td className="px-4 py-3 text-center"><span className="bg-seafoam-50 text-seafoam-600 px-1.5 py-0.5 rounded text-[9px] font-bold">{p.djj} / {p.jumlah_fe}</span></td>
                                                    <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">{p.keluhan || '-'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-400 italic text-[11px]">Belum ada riwayat pemeriksaan.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                    <div className="shrink-0 mt-6 flex justify-end"><button onClick={() => setIsDetailModalOpen(false)} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">Tutup</button></div>
                </div>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md"><div className="flex flex-col items-center text-center p-8"><div className="h-20 w-20 rounded-[1.5rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-6 ring-[10px] ring-rose-50/50"><DeleteIcon size="40" /></div><h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Hapus Data?</h2><p className="text-slate-500 mb-8 text-xs font-medium">Tindakan ini permanen.</p><div className="flex w-full gap-3"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-black text-[10px] text-slate-600">Batal</button><button onClick={() => destroy(route('ibu-hamil.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black text-[10px] shadow-xl shadow-rose-200">Hapus</button></div></div></Modal>
        </AuthenticatedLayout>
    );
}

function ActionButton({ children, onClick, color, title }) {
    const colors = { seafoam: 'text-seafoam-500 bg-seafoam-50 hover:bg-seafoam-600 hover:text-white', indigo: 'text-indigo-500 bg-indigo-50 hover:bg-indigo-600 hover:text-white', rose: 'text-rose-500 bg-rose-50 hover:bg-rose-600 hover:text-white' };
    return (<button title={title} onClick={onClick} className={`h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm active:scale-90 ${colors[color]}`}>{children}</button>);
}

function DetailItem({ label, value }) {
    return (<div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p><p className="text-sm font-extrabold text-slate-900">{value}</p></div>);
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "16" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
