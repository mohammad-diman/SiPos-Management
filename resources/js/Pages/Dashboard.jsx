import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBaby, faPersonWalkingWithCane, faPersonDress } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard({ auth, stats, upcoming_jadwals, chart_data, antrian_hari_ini }) {
    const user = auth.user;
    const totalWarga = chart_data.distribution.reduce((a, b) => a + b, 0);

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [
            {
                label: 'Periksa',
                data: chart_data.monthly,
                borderColor: 'rgb(125, 221, 230)',
                backgroundColor: 'rgba(125, 221, 230, 0.5)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const doughnutData = {
        labels: ['Balita', 'Ibu Hamil', 'Lansia'],
        datasets: [
            {
                data: chart_data.distribution,
                backgroundColor: [
                    'rgba(125, 221, 230, 0.9)', // Seafoam Blue
                    'rgba(244, 63, 94, 0.9)',  // Rose
                    'rgba(245, 158, 11, 0.9)', // Amber
                ],
                hoverBackgroundColor: [
                    '#7DDDE6',
                    '#fb7185',
                    '#fbbf24',
                ],
                borderWidth: 0,
                borderRadius: 12,
                spacing: 2,
                cutout: '60%',
            },
        ],
    };

    // Custom Plugin for Center Text - Updated for larger size
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart) => {
            const { ctx, width, height } = chart;
            ctx.restore();

            // Total Number
            ctx.font = "bold 32px sans-serif"; // Increased from 24px
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = "#0f172a"; // slate-900
            const text = totalWarga.toString();
            const textY = height / 2 - 8;
            ctx.fillText(text, width / 2, textY);

            // "Warga" Label
            ctx.font = "800 10px sans-serif"; // Slightly increased
            ctx.fillStyle = "#64748b"; // slate-500
            ctx.fillText("TOTAL DATA", width / 2, textY + 25);

            ctx.save();
        }
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-3 pb-3">
                {/* Welcome & Calendar Section */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex-1">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Halo, {user.name}!
                        </h1>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            Panel kendali kesehatan SiPos (Sistem Informasi Posyandu & Posbindu).
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-seafoam-50 px-3 py-1.5 rounded-xl border border-seafoam-100 text-right shrink-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-seafoam-600 leading-none">Hari Ini</p>
                            <p className="text-xs font-black text-seafoam-900 mt-1 leading-none">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 shrink-0">
                            <div className="h-8 w-8 rounded-full bg-seafoam-600 flex items-center justify-center text-white text-xs font-black uppercase">
                                {user.name.charAt(0)}
                            </div>
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-4">
                    <StatCard title="Penduduk" value={stats.total_penduduk} icon={<FontAwesomeIcon icon={faUsers} />} color="indigo" />
                    <StatCard title="Balita" value={stats.total_posyandu} icon={<FontAwesomeIcon icon={faBaby} />} color="seafoam" />
                    <StatCard title="Ibu Hamil" value={stats.total_ibu_hamil} icon={<FontAwesomeIcon icon={faPersonDress} />} color="rose" />
                    <StatCard title="Lansia" value={stats.total_posbindu} icon={<FontAwesomeIcon icon={faPersonWalkingWithCane} />} color="amber" />
                </div>

                {/* Status Antrian Section */}
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-base font-black tracking-tight uppercase">Status Antrian Hari Ini</h3>
                                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">Real-time Update • {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="h-9 w-9 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse text-indigo-400"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <QueueStatus label="Posyandu Balita" data={antrian_hari_ini.balita} color="seafoam" />
                            <QueueStatus label="Layanan Ibu Hamil" data={antrian_hari_ini.ibu_hamil} color="rose" />
                            <QueueStatus label="Posbindu Lansia" data={antrian_hari_ini.lansia} color="amber" />
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
                    <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Tren Pemeriksaan</h3>
                        <div className="h-[220px]">
                            <Line
                                data={lineData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 10 } } },
                                        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider self-start">Distribusi Data</h3>
                        <div className="h-44 w-44 relative flex items-center justify-center">
                            <Doughnut
                                data={doughnutData}
                                plugins={[centerTextPlugin]}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: '#1e293b',
                                            padding: 10,
                                            titleFont: { size: 11, weight: 'bold' },
                                            bodyFont: { size: 11 },
                                            cornerRadius: 8,
                                            displayColors: true
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2.5 w-full">
                            {['Balita', 'Ibu', 'Lansia'].map((label, i) => (
                                <div key={label} className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className={`w-1.5 h-1.5 rounded-full mb-1 ${['bg-seafoam-500', 'bg-rose-500', 'bg-amber-500'][i]}`}></div>
                                    <span className="text-[10px] font-black text-slate-900 leading-none">{chart_data.distribution[i]}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Schedules Section */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Jadwal Mendatang</h3>
                        <Link href={route('jadwal.index')} className="text-[9px] font-black text-seafoam-600 uppercase tracking-[0.2em] hover:text-seafoam-700">Semua Jadwal</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {upcoming_jadwals.length > 0 ? (
                            upcoming_jadwals.map((jadwal) => (
                                <div key={jadwal.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-seafoam-50 transition-all group">
                                    <div className="h-9 w-9 rounded-lg bg-white shadow-sm flex flex-col items-center justify-center border border-slate-100 shrink-0">
                                        <span className="text-[7px] font-black text-seafoam-600 uppercase leading-none">{new Date(jadwal.tanggal).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                        <span className="text-sm font-black text-slate-900 leading-none mt-0.5">{new Date(jadwal.tanggal).getDate()}</span>
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[11px] font-black text-slate-900 truncate leading-tight">{jadwal.nama_kegiatan}</p>
                                        <p className="text-[9px] font-bold text-seafoam-600 uppercase tracking-tighter mt-0.5">{jadwal.waktu_mulai.substring(0,5)} WIB</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-3">
                                <p className="text-slate-400 font-medium italic text-xs">Tidak ada jadwal terdekat.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function QueueStatus({ label, data, color }) {
    const colors = {
        seafoam: 'text-seafoam-400 bg-seafoam-400/5 border-seafoam-400/20',
        rose: 'text-rose-400 bg-rose-400/5 border-rose-400/20',
        amber: 'text-amber-400 bg-amber-400/5 border-amber-400/20'
    };

    const statusText = data?.status === 'dipanggil' ? 'Dipanggil' : (data?.status === 'selesai' ? 'Selesai' : 'Kosong');

    return (
        <div className={`p-4 rounded-3xl border ${colors[color]} flex flex-col items-center text-center relative overflow-hidden backdrop-blur-sm`}>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-3">{label}</span>
            <div className="text-4xl font-black tracking-tighter mb-1.5">{data?.nomor_antrian || '-'}</div>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${data?.status === 'dipanggil' ? 'bg-indigo-500/20 text-indigo-300 animate-pulse' : 'bg-slate-500/20 text-slate-400'}`}>
                {statusText}
            </span>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    const cardColors = {
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-900',
        seafoam: 'bg-seafoam-50 border-seafoam-100 text-seafoam-900',
        rose: 'bg-rose-50 border-rose-100 text-rose-900',
        amber: 'bg-amber-50 border-amber-100 text-amber-900',
    };

    const iconColors = {
        indigo: 'bg-indigo-600 text-white',
        seafoam: 'bg-seafoam-600 text-white',
        rose: 'bg-rose-600 text-white',
        amber: 'bg-amber-600 text-white',
    };

    return (
        <div className={`${cardColors[color]} p-3 rounded-2xl shadow-sm border flex flex-col justify-between h-20 transition-all hover:shadow-md hover:-translate-y-0.5`}>
            <div className="flex justify-between items-start">
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${iconColors[color]} shadow-sm`}>
                    <div className="scale-[0.65]">{icon}</div>
                </div>
                <span className="text-xl font-black leading-none">{value}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-70">{title}</p>
        </div>
    );
}

