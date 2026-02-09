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

export default function Index({ auth, lansias, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedLansia, setSelectedLansia] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    
    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        no_rm: '', nama: '', nik: '', tanggal_lahir: '', jenis_kelamin: 'L',
        alamat: '', no_hp: '', golongan_darah: '', riwayat_penyakit: '', alergi: ''
    });

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(
                route('lansia.index'),
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

    const openModal = (l = null) => {
        if (l) {
            setSelectedLansia(l);
            setData({
                no_rm: l.no_rm || '', nama: l.nama || '', nik: l.nik || '', tanggal_lahir: l.tanggal_lahir || '', 
                jenis_kelamin: l.jenis_kelamin || 'L', alamat: l.alamat || '', no_hp: l.no_hp || '', 
                golongan_darah: l.golongan_darah || '', riwayat_penyakit: l.riwayat_penyakit || '', alergi: l.alergi || ''
            });
        } else {
            setSelectedLansia(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setSelectedLansia(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        const action = selectedLansia ? route('lansia.update', selectedLansia.id) : route('lansia.store');
        const method = selectedLansia ? patch : post;
        method(action, { onSuccess: () => closeModal() });
    };

    return (
        <AuthenticatedLayout header={<span>Data Master <span className="text-seafoam-500 mx-2">/</span> Lansia</span>}>
            <Head title="Data Lansia" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-80 group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><SearchIcon /></span>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Cari No. RM atau Nama..." 
                                                            className="w-full rounded-2xl border-none bg-slate-50 py-3 pl-11 pr-4 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-seafoam-500/10 transition-all" 
                                                            value={searchQuery} 
                                                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                                                        />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total:</span>
                            <span className="text-xs font-black text-slate-600">{lansias.total} Data</span>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <a 
                            href={route('export.excel', 'lansia')} 
                            className="flex-1 md:flex-none rounded-2xl px-6 py-2.5 bg-white border border-seafoam-200 text-seafoam-600 hover:bg-seafoam-50 font-bold text-[10px] uppercase tracking-widest shadow-sm transition-all text-center"
                        >
                            Excel
                        </a>
                        <a 
                            href={route('export.pdf', 'lansia')} 
                            className="flex-1 md:flex-none rounded-2xl px-6 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[10px] uppercase tracking-widest shadow-sm transition-all text-center"
                        >
                            PDF
                        </a>
                        <PrimaryButton onClick={() => openModal()} className="flex-[2] md:flex-none rounded-2xl px-6 py-2.5 bg-amber-500 hover:bg-amber-600 border-none font-bold text-white text-[10px] uppercase tracking-widest shrink-0">+ Tambah</PrimaryButton>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-8 py-5">No. Rekam Medis / Nama</th>
                                    <th className="px-8 py-5">NIK</th>
                                    <th className="px-8 py-5 text-center">Jenis Kelamin</th>
                                    <th className="px-8 py-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                                {lansias.data.map((l) => (
                                    <tr key={l.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-xs">{l.nama?.charAt(0)}</div>
                                                <div><p className="text-sm font-extrabold text-slate-900">{l.nama}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{l.no_rm}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-xs font-bold text-slate-500">{l.nik}</td>
                                        <td className="px-8 py-5 whitespace-nowrap text-center">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${l.jenis_kelamin === 'L' ? 'bg-seafoam-50 text-seafoam-600' : 'bg-pink-50 text-pink-600'}`}>
                                                {l.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2 text-slate-400">
                                                <ActionButton title="Lihat Detail" onClick={() => { setSelectedLansia(l); setIsDetailModalOpen(true); }} color="seafoam"><ViewIcon /></ActionButton>
                                                <ActionButton title="Edit Data" onClick={() => openModal(l)} color="indigo"><EditIcon /></ActionButton>
                                                <ActionButton title="Hapus Data" onClick={() => { setDeletingId(l.id); setIsDeleteModalOpen(true); }} color="rose"><DeleteIcon /></ActionButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menampilkan {lansias.from || 0} - {lansias.to || 0} dari {lansias.total} Data</span>
                        <Pagination links={lansias.links} />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
                    <div className="shrink-0 p-6 pb-4 bg-gradient-to-r from-seafoam-50/50 to-white border-b border-seafoam-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedLansia ? 'Edit' : 'Registrasi'} Lansia</h2>
                            <p className="text-slate-500 font-medium italic">Data Master Posbindu PTM</p>
                        </div>
                        <button type="button" onClick={closeModal} className="rounded-xl bg-white p-1.5 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all hover:rotate-90">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar"><div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                        <div><InputLabel value="No. RM" /><TextInput className="w-full" value={data.no_rm} onChange={(e) => setData('no_rm', e.target.value)} required /><p className="text-rose-500 text-xs mt-1">{errors.no_rm}</p></div>
                        <div><InputLabel value="Nama Lengkap" /><TextInput className="w-full" value={data.nama} onChange={(e) => setData('nama', e.target.value)} required /><p className="text-rose-500 text-xs mt-1">{errors.nama}</p></div>
                        <div><InputLabel value="NIK" /><TextInput className="w-full" value={data.nik} onChange={(e) => setData('nik', e.target.value)} required /><p className="text-rose-500 text-xs mt-1">{errors.nik}</p></div>
                        <div><InputLabel value="Tgl Lahir" /><TextInput type="date" className="w-full" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} required /><p className="text-rose-500 text-xs mt-1">{errors.tanggal_lahir}</p></div>
                        <div><InputLabel value="Jenis Kelamin" /><select className="w-full rounded-2xl border-none bg-slate-50 py-2 text-sm font-bold text-slate-700" value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} required><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                        <div><InputLabel value="No. HP" /><TextInput className="w-full" value={data.no_hp} onChange={(e) => setData('no_hp', e.target.value)} /><p className="text-rose-500 text-xs mt-1">{errors.no_hp}</p></div>
                        <div><InputLabel value="Golongan Darah" /><select className="w-full rounded-2xl border-none bg-slate-50 py-2 text-sm font-bold text-slate-700" value={data.golongan_darah} onChange={(e) => setData('golongan_darah', e.target.value)}><option value="">-- Pilih --</option><option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option></select></div>
                        <div className="md:col-span-2"><InputLabel value="Riwayat Penyakit" /><textarea className="w-full rounded-2xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[80px] focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={data.riwayat_penyakit} onChange={(e) => setData('riwayat_penyakit', e.target.value)} /></div>
                        <div className="md:col-span-2"><InputLabel value="Alergi" /><textarea className="w-full rounded-2xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[80px] focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={data.alergi} onChange={(e) => setData('alergi', e.target.value)} /></div>
                        <div className="md:col-span-2"><InputLabel value="Alamat" /><textarea className="w-full rounded-2xl border-none bg-slate-50 py-2 px-4 text-sm font-bold min-h-[80px] focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} required /><p className="text-rose-500 text-xs mt-1">{errors.alamat}</p></div>
                    </div></div>
                    <div className="shrink-0 p-6 border-t border-slate-100 bg-gradient-to-r from-white to-seafoam-50/30 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={closeModal} className="rounded-2xl px-6 py-2 border-none bg-white shadow-sm text-slate-600 font-bold text-xs">Batal</SecondaryButton>
                        <PrimaryButton disabled={processing} className="rounded-2xl px-12 py-2 bg-seafoam-600 hover:bg-seafoam-700 text-white border-none font-black text-xs uppercase tracking-widest active:scale-95 shadow-xl shadow-seafoam-200 min-w-[200px] flex justify-center">
                            {processing ? 'Menyimpan...' : 'Simpan Data Lansia'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} maxWidth="5xl">
                <div className="p-6 flex flex-col max-h-[90vh]">
                    <div className="shrink-0 flex justify-between items-start mb-8"><div className="flex items-center gap-5"><div className="h-16 w-16 rounded-[1.5rem] bg-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-200">{selectedLansia?.nama?.charAt(0)}</div><div><h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedLansia?.nama}</h2><p className="text-slate-500 font-bold text-sm uppercase tracking-widest">RM: {selectedLansia?.no_rm}</p></div></div><button onClick={() => setIsDetailModalOpen(false)} className="rounded-2xl bg-slate-50 p-3 text-slate-400 hover:text-slate-600 active:scale-95 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-10">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4 flex items-center gap-2"><span className="w-8 h-px bg-amber-100"></span> Identitas & Informasi Personal</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
                                <DetailItem label="NIK" value={selectedLansia?.nik} />
                                <DetailItem label="Tgl Lahir" value={selectedLansia?.tanggal_lahir} />
                                <DetailItem label="JK" value={selectedLansia?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                                <DetailItem label="Gol. Darah" value={selectedLansia?.golongan_darah || '-'} />
                                <DetailItem label="No. HP" value={selectedLansia?.no_hp || '-'} />
                                <div className="col-span-2 md:col-span-3"><DetailItem label="Alamat Lengkap" value={selectedLansia?.alamat} /></div>
                                <div className="col-span-2 md:col-span-2"><DetailItem label="Riwayat Penyakit" value={selectedLansia?.riwayat_penyakit || '-'} /></div>
                                <div className="col-span-2 md:col-span-2"><DetailItem label="Alergi" value={selectedLansia?.alergi || '-'} /></div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-seafoam-500 mb-4 flex items-center gap-2"><span className="w-8 h-px bg-seafoam-100"></span> Riwayat Pemeriksaan Posbindu</h3>
                            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            <th className="px-6 py-2">Tanggal</th>
                                            <th className="px-6 py-2 text-center">Tensi</th>
                                            <th className="px-6 py-2 text-center">BB/TB</th>
                                            <th className="px-6 py-2 text-center">Gula/Kolest/Asam</th>
                                            <th className="px-6 py-2">Keluhan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {selectedLansia?.pemeriksaans?.length > 0 ? (
                                            selectedLansia.pemeriksaans.map((p) => (
                                                <tr key={p.id} className="text-xs">
                                                    <td className="px-6 py-2 font-bold text-slate-700">{p.tanggal_periksa}</td>
                                                    <td className="px-6 py-2 text-center font-black text-rose-600">{p.tekanan_darah}</td>
                                                    <td className="px-6 py-2 text-center text-slate-600">{p.berat_badan}kg / {p.tinggi_badan}cm</td>
                                                    <td className="px-6 py-2 text-center">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] font-bold text-slate-500">G: {p.gula_darah || '-'} | K: {p.kolesterol || '-'} | A: {p.asam_urat || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-2 text-slate-500 max-w-[200px] truncate">{p.keluhan_utama || '-'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400 italic">Belum ada riwayat pemeriksaan.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                    <div className="shrink-0 mt-8 flex justify-end"><button onClick={() => setIsDetailModalOpen(false)} className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 py-2 text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200">Tutup Detail</button></div>
                </div>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md"><div className="flex flex-col items-center text-center p-12"><div className="h-24 w-24 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 ring-[12px] ring-rose-50/50"><DeleteIcon size="48" /></div><h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Hapus Data?</h2><p className="text-slate-500 mb-6 text-sm font-medium">Tindakan ini permanen.</p><div className="flex w-full gap-3"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded-2xl font-black text-xs text-slate-600">Batal</button><button onClick={() => destroy(route('lansia.destroy', deletingId), { onSuccess: () => setIsDeleteModalOpen(false) })} className="flex-1 py-2 bg-rose-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-rose-200 text-xs">Hapus</button></div></div></Modal>
        </AuthenticatedLayout>
    );
}

function ActionButton({ children, onClick, color, title }) {
    const colors = { seafoam: 'text-seafoam-500 bg-seafoam-50 hover:bg-seafoam-600 hover:text-white', indigo: 'text-indigo-500 bg-indigo-50 hover:bg-indigo-600 hover:text-white', rose: 'text-rose-500 bg-rose-50 hover:bg-rose-600 hover:text-white' };
    return (<button title={title} onClick={onClick} className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm active:scale-90 ${colors[color]}`}>{children}</button>);
}

function DetailItem({ label, value }) {
    return (<div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p><p className="text-sm font-extrabold text-slate-900">{value}</p></div>);
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>;
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = ({ size = "16" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
