import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-seafoam-100 selection:text-seafoam-900 overflow-x-hidden">
            <Head title="Selamat Datang" />
            
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group">
                        <div className="h-11 w-11 bg-seafoam-900 rounded-2xl flex items-center justify-center shadow-lg shadow-seafoam-900/20 group-hover:rotate-6 transition-transform duration-500">
                            <ApplicationLogo className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase block leading-none">
                                SiPos
                            </span>
                            <span className="text-[10px] font-black text-seafoam-600 uppercase tracking-[0.2em] leading-none">Management</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2.5 bg-seafoam-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-seafoam-800 transition-all active:scale-95 shadow-xl shadow-seafoam-900/20"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="px-6 py-2.5 bg-seafoam-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-seafoam-700 transition-all active:scale-95 shadow-xl shadow-seafoam-600/20"
                            >
                                Masuk Petugas
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-40 pb-20 px-6 relative">
                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-seafoam-500/5 blur-[120px] rounded-full -z-10"></div>
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-seafoam-100 shadow-sm text-seafoam-700 text-[11px] font-black uppercase tracking-[0.15em]">
                            <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-seafoam-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-seafoam-600"></span>
                            </span>
                            Sistem Terpadu Posyandu & Posbindu
                        </div>
                        
                        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
                            Sehatkan <br />
                            <span className="text-seafoam-600">Generasi</span> <br />
                            Masa Depan.
                        </h1>
                        
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                            Platform digital cerdas untuk pemantauan kesehatan balita, ibu hamil, dan lansia secara real-time dan terintegrasi dalam satu sistem manajemen.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            {!auth.user && (
                                <Link
                                    href={route('login')}
                                    className="px-10 py-5 bg-seafoam-600 text-white rounded-3xl text-sm font-black hover:bg-seafoam-700 transition-all shadow-2xl shadow-seafoam-600/30 text-center uppercase tracking-[0.2em] active:scale-95"
                                >
                                    Mulai Sekarang
                                </Link>
                            )}
                            <button className="px-10 py-5 bg-white text-slate-600 border border-slate-200 rounded-3xl text-sm font-black hover:bg-slate-50 transition-all shadow-sm text-center uppercase tracking-[0.2em]">
                                Pelajari Fitur
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-10 pt-12 border-t border-slate-200/60">
                            <StatItem number="100%" label="Akurasi Data" />
                            <StatItem number="Real-time" label="Monitoring" />
                            <StatItem number="Cloud" label="Integrated" />
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-6 bg-seafoam-500/10 rounded-[4rem] blur-3xl group-hover:bg-seafoam-500/15 transition-all duration-700"></div>
                        <div className="relative bg-white p-5 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white overflow-hidden transform hover:-translate-y-3 transition-transform duration-700">
                            <img 
                                src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=2070" 
                                alt="Healthcare Innovation"
                                className="rounded-[2.5rem] w-full aspect-[4/3] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute bottom-12 left-12 right-12 bg-seafoam-900/90 backdrop-blur-xl p-7 rounded-[2.5rem] border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 bg-seafoam-500 rounded-3xl flex items-center justify-center shadow-lg shadow-seafoam-500/20">
                                        <CheckIcon className="text-white w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-lg tracking-tight leading-none uppercase">E-HEALTH READY</p>
                                        <p className="text-xs text-seafoam-400 font-bold uppercase tracking-widest mt-2">Standar Nasional Indonesia</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="bg-white py-32 border-t border-slate-100 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-[11px] font-black text-seafoam-600 uppercase tracking-[0.4em]">Solusi Terintegrasi</h2>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter">Layanan Kesehatan Digital</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-10">
                        <FeatureCard 
                            title="Posyandu Balita" 
                            desc="Pantau tumbuh kembang anak dengan grafik KMS digital, riwayat imunisasi, dan manajemen vitamin yang akurat."
                            color="seafoam"
                            icon={<BabyIcon />}
                        />
                        <FeatureCard 
                            title="Layanan Ibu Hamil" 
                            desc="Catat pemeriksaan kehamilan berkala, pantau tensi, detak jantung janin, hingga estimasi persalinan."
                            color="rose"
                            icon={<MotherIcon />}
                        />
                        <FeatureCard 
                            title="Posbindu Lansia" 
                            desc="Skrining dini faktor risiko penyakit tidak menular melalui pemeriksaan vitalitas dan laboratorium sederhana."
                            color="amber"
                            icon={<ElderlyIcon />}
                        />
                    </div>
                </div>
            </section>

            <footer className="bg-slate-900 py-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-seafoam-600 rounded-xl flex items-center justify-center">
                            <ApplicationLogo className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-black tracking-tighter uppercase">SiPos <span className="text-seafoam-500">2026</span></span>
                    </div>
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em]">
                        Dikembangkan untuk Transformasi Digital Kesehatan Masyarakat
                    </p>
                    <div className="flex gap-6">
                        <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 hover:text-seafoam-500 hover:border-seafoam-500 transition-all cursor-pointer">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-1.015-2.178-1.648-3.597-1.648-2.722 0-4.928 2.206-4.928 4.929 0 .386.043.762.128 1.123-4.097-.205-7.73-2.168-10.163-5.152-.424.73-.667 1.578-.667 2.476 0 1.71.87 3.219 2.193 4.099-.808-.026-1.568-.248-2.23-.616-.001.021-.001.042-.001.063 0 2.388 1.698 4.38 3.953 4.856-.413.112-.849.171-1.299.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.379 4.6 3.419-1.685 1.321-3.809 2.108-6.115 2.108-.397 0-.79-.023-1.175-.068 2.179 1.396 4.768 2.212 7.548 2.212 9.057 0 14.01-7.507 14.01-14.01 0-.213-.005-.426-.014-.637.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function StatItem({ number, label }) {
    return (
        <div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{number}</p>
            <p className="text-[10px] text-seafoam-600 font-black uppercase tracking-widest mt-2">{label}</p>
        </div>
    );
}

function FeatureCard({ title, desc, color, icon }) {
    const colors = {
        seafoam: 'bg-seafoam-50 text-seafoam-600 group-hover:bg-seafoam-600 group-hover:text-white shadow-seafoam-100',
        rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white shadow-rose-100',
        amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white shadow-amber-100'
    };
    
    return (
        <div className="p-10 rounded-[3rem] border border-slate-100 hover:border-transparent hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 group bg-white">
            <div className={`h-16 w-16 ${colors[color]} rounded-[1.8rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-xl group-hover:shadow-none group-hover:scale-110`}>
                <div className="scale-125">
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
        </div>
    );
}

const BabyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M10 16c.5 1 1.5 1 2 1s1.5 0 2-1"></path><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path></svg>
);

const MotherIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M12 7v10"></path><path d="M8 11h8"></path></svg>
);

const ElderlyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"></path><circle cx="12" cy="7" r="4"></circle><path d="M12 11v4"></path></svg>
);

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);
