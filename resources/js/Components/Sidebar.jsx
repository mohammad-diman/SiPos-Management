import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, Children, isValidElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalkingWithCane, faBaby, faCalendar, faGear, faUsers, faUserNurse } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ user }) {
    const { url } = usePage();
    const [openMenus, setOpenMenus] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const menusToOpen = [];
        if (route().current('pemeriksaan-balita.*') || route().current('pemeriksaan-ibu-hamil.*') || route().current('balita.index') || route().current('ibu-hamil.index')) {
            menusToOpen.push('posyandu');
        }
        if (route().current('pemeriksaan-lansia.*') || route().current('lansia.index')) {
            menusToOpen.push('posbindu');
        }
        setOpenMenus(menusToOpen);
    }, [url]);

    const toggleMenu = (menu) => {
        setOpenMenus(prev => 
            prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
        );
    };

    const NavLink = ({ href, active, children, icon: Icon, isSubmenu = false }) => (
        <Link
            href={href}
            className={`relative flex items-center gap-2.5 transition-all duration-300 group ${
                isSubmenu 
                ? 'px-3 py-2 rounded-xl text-[12px] font-semibold'
                : 'px-4 py-2.5 rounded-xl text-[13px] font-bold'
            } ${
                active 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-seafoam-100/70 hover:text-white hover:bg-white/5'
            }`}
        >
            {!isSubmenu && Icon && (
                <div className={`transition-all duration-300 ${active ? 'text-white scale-110' : 'text-seafoam-300/50 group-hover:text-seafoam-200'}`}>
                    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>
            )}
            <span className={isSubmenu ? 'ml-2' : ''}>{children}</span>
            {active && !isSubmenu && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
            )}
        </Link>
    );

    const DropdownMenu = ({ title, id, icon: Icon, children }) => {
        const isOpen = openMenus.includes(id);
        const isActive = Children.toArray(children).some(
            (child) => isValidElement(child) && child.props.active
        );
        
        return (
            <div className={`mb-1 rounded-xl transition-all duration-300 ${isOpen ? 'bg-white/5 p-1' : ''}`}>
                <button 
                    onClick={() => toggleMenu(id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                        isActive ? 'text-white' : 'text-seafoam-100/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-seafoam-300/50 group-hover:text-seafoam-200'}`}>
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="text-[13px] font-bold tracking-tight">{title}</span>
                    </div>
                    <svg className={`w-3.5 h-3.5 text-seafoam-400/50 transition-transform duration-500 ${isOpen ? 'rotate-180 text-white' : ''}`} fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out pl-8 pr-1 space-y-0.5 ${isOpen ? 'max-h-[400px] opacity-100 mt-1 pb-1' : 'max-h-0 opacity-0'}`}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-seafoam-950 text-white overflow-hidden">
            <div className="p-6 pb-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center group-hover:rotate-[10deg] transition-all duration-500 shadow-lg shadow-black/20">
                        <svg className="w-6 h-6 text-seafoam-700" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter leading-none">SiPos</h1>
                        <p className="text-[9px] font-black text-seafoam-400 uppercase tracking-[0.2em] mt-1">Management</p>
                    </div>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-1">
                <NavLink href={route('dashboard')} active={route().current('dashboard')} icon={DashboardIcon}>Dashboard</NavLink>
                
                <div className="pt-4 pb-2 px-4">
                    <p className="text-[10px] font-black text-seafoam-500/50 uppercase tracking-[0.2em]">Data Master</p>
                </div>
                <NavLink href={route('penduduk.index')} active={route().current('penduduk.*')} icon={UsersIcon}>Penduduk</NavLink>
                <NavLink href={route('kader.index')} active={route().current('kader.*')} icon={UserIcon}>Kader</NavLink>

                <div className="pt-4 pb-2 px-4">
                    <p className="text-[10px] font-black text-seafoam-500/50 uppercase tracking-[0.2em]">Pelayanan</p>
                </div>

                <DropdownMenu title="Posyandu" id="posyandu" icon={BabyIcon}>
                    <NavLink isSubmenu href={route('balita.index')} active={route().current('balita.index')}>Balita</NavLink>
                    <NavLink isSubmenu href={route('pemeriksaan-balita.index')} active={route().current('pemeriksaan-balita.*')}>Pemeriksaan Balita</NavLink>
                    <div className="h-px bg-white/10 my-1.5 mx-4" />
                    <NavLink isSubmenu href={route('ibu-hamil.index')} active={route().current('ibu-hamil.index')}>Ibu Hamil</NavLink>
                    <NavLink isSubmenu href={route('pemeriksaan-ibu-hamil.index')} active={route().current('pemeriksaan-ibu-hamil.*')}>Pemeriksaan Ibu Hamil</NavLink>
                </DropdownMenu>

                <DropdownMenu title="Posbindu" id="posbindu" icon={ElderlyIcon}>
                    <NavLink isSubmenu href={route('lansia.index')} active={route().current('lansia.index')}>Lansia</NavLink>
                    <NavLink isSubmenu href={route('pemeriksaan-lansia.index')} active={route().current('pemeriksaan-lansia.*')}>Pemeriksaan Lansia</NavLink>
                </DropdownMenu>

                <NavLink href={route('jadwal.index')} active={route().current('jadwal.*')} icon={CalendarIcon}>Jadwal Pelayanan</NavLink>

                {user.role === 'admin' && (
                    <>
                        <div className="pt-4 pb-2 px-4">
                            <p className="text-[10px] font-black text-seafoam-500/50 uppercase tracking-[0.2em]">Sistem</p>
                        </div>
                        <NavLink href={route('users.index')} active={route().current('users.*')} icon={SettingsIcon}>Manajemen Akun</NavLink>
                    </>
                )}
            </div>

            <div className="p-4 relative">
                {isProfileOpen && (
                    <div className="absolute bottom-16 left-4 right-4 bg-white border border-slate-100 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Link href={route('profile.edit')} className="flex items-center gap-2.5 px-4 py-2 text-[12px] font-bold text-slate-600 hover:bg-seafoam-50 hover:text-seafoam-600 transition-colors">
                            <UserIcon size={14} />
                            Profil
                        </Link>
                        <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors text-left">
                            <LogoutIcon size={14} />
                            Keluar
                        </Link>
                    </div>
                )}

                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`w-full bg-white/5 rounded-2xl p-2 pr-4 border border-white/5 flex items-center gap-3 group transition-all ${isProfileOpen ? 'bg-white/10' : ''}`}
                >
                    <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center font-black text-xs text-seafoam-700 shadow-sm uppercase shrink-0">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-[13px] font-black text-white truncate leading-none">{user.name}</p>
                        <p className="text-[9px] font-bold text-seafoam-400 uppercase mt-1.5">{user.role}</p>
                    </div>
                    <svg className={`w-3 h-3 text-seafoam-400/50 transition-transform ${isProfileOpen ? 'rotate-180 text-white' : ''}`} fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
            </div>
        </div>
    );
}

const DashboardIcon = ({ size = 18, ...props }) => (
    <svg width={size} height={size} {...props} viewBox="-5.0 -10.0 110.0 135.0" fill="currentColor">
        <path d="m89.875 5h-79.75c-2.875 0-5 2.25-5 5.125v15c0 2.875 2.25 5.125 5.125 5.125h79.625c2.75 0 5.125-2.375 5.125-5.125v-15c-0.125-2.75-2.375-5.125-5.125-5.125z"/>
        <path d="m56.625 38.25h-46.5c-2.875 0-5.125 2.25-5.125 5.25v46.375c0 2.875 2.25 5.25 5.125 5.25h46.5c2.75 0 5.125-2.375 5.125-5.25v-46.5c0-2.875-2.25-5.125-5.125-5.125z"/>
        <path d="m89.5 38.25h-13.375c-2.875 0-5.25 2.375-5.25 5.25v46.375c0 2.875 2.375 5.25 5.25 5.25h13.375c2.875 0 5.25-2.375 5.25-5.25v-46.5c0-2.875-2.375-5.125-5.25-5.125z"/>
    </svg>
);

const BabyIcon = ({ size = 18, ...props }) => (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <FontAwesomeIcon icon={faBaby} style={{ width: '100%', height: '100%' }} />
    </div>
);

const ElderlyIcon = ({ size = 18, ...props }) => (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <FontAwesomeIcon icon={faPersonWalkingWithCane} style={{ width: '100%', height: '100%' }} />
    </div>
);

const UsersIcon = ({ size = 18, ...props }) => (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <FontAwesomeIcon icon={faUsers} style={{ width: '100%', height: '100%' }} />
    </div>
);

const UserIcon = ({ size = 18, ...props }) => (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <FontAwesomeIcon icon={faUserNurse} style={{ width: '100%', height: '100%' }} />
    </div>
);

const CalendarIcon = ({ size = 18, ...props }) => (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <FontAwesomeIcon icon={faCalendar} style={{ width: '100%', height: '100%' }} />
    </div>
);

const SettingsIcon = ({ size = 18, ...props }) => (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <FontAwesomeIcon icon={faGear} style={{ width: '100%', height: '100%' }} />
    </div>
);

const LogoutIcon = ({ size = 18, strokeWidth = 2, ...props }) => (
    <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);