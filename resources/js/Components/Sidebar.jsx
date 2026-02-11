import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, Children, isValidElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalkingWithCane, faBaby, faCalendar, faGear, faUsers, faUserNurse } from '@fortawesome/free-solid-svg-icons';
import ApplicationLogo from './ApplicationLogo';

export default function Sidebar({ user, isCollapsed = false, onToggle }) {
    const { url } = usePage();
    const [openMenus, setOpenMenus] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Effect untuk mengatur menu terbuka berdasarkan URL saat pertama kali dimuat
    useEffect(() => {
        if (isCollapsed) {
            setOpenMenus([]);
            return;
        }

        const menusToOpen = [];
        if (route().current('pemeriksaan-balita.*') || route().current('pemeriksaan-ibu-hamil.*') || route().current('balita.index') || route().current('ibu-hamil.index')) {
            menusToOpen.push('posyandu');
        }
        if (route().current('pemeriksaan-lansia.*') || route().current('lansia.index')) {
            menusToOpen.push('posbindu');
        }
        if (route().current('desa.*') || route().current('penduduk.*') || route().current('kader.*')) {
            menusToOpen.push('master');
        }

        // Hanya update jika belum ada menu yang dibuka secara manual
        setOpenMenus(prev => prev.length > 0 ? prev : menusToOpen);
    }, [url, isCollapsed]);

    const toggleMenu = (menu) => {
        if (isCollapsed) {
            // Jika tertutup, buka sidebar DAN buka menu yang diklik
            onToggle();
            setOpenMenus([menu]);
            return;
        }
        setOpenMenus(prev =>
            prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
        );
    };

    const NavLink = ({ href, active, children, icon: Icon, isSubmenu = false }) => (
        <Link
            href={href}
            title={isCollapsed && !isSubmenu ? children : ''}
            className={`relative flex items-center transition-all duration-300 group ${
                isCollapsed && !isSubmenu ? 'justify-center h-12 w-12 mx-auto mb-1' : 'gap-2.5 px-4 py-2.5 mb-1'
            } ${
                isSubmenu
                ? 'px-3 py-2 rounded-xl text-[12px] font-semibold'
                : 'rounded-xl text-[13px] font-bold'
            } ${
                active
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-seafoam-100/70 hover:text-white hover:bg-white/5'
            }`}
        >
            {!isSubmenu && Icon && (
                <div className={`transition-all duration-300 ${active ? 'text-white scale-110' : 'text-seafoam-300/50 group-hover:text-seafoam-200'} ${isCollapsed ? 'flex items-center justify-center' : ''}`}>
                    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>
            )}
            {!isCollapsed && <span className={isSubmenu ? 'ml-2' : ''}>{children}</span>}

            {active && !isSubmenu && !isCollapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
            )}
            {active && isCollapsed && !isSubmenu && (
                <div className="absolute left-[-8px] w-1 h-6 bg-seafoam-400 rounded-r-full shadow-[0_0_8px_rgba(125,221,230,0.6)]"></div>
            )}
        </Link>
    );

    const DropdownMenu = ({ title, id, icon: Icon, children }) => {
        const isOpen = openMenus.includes(id);
        const isActive = Children.toArray(children).some(
            (child) => isValidElement(child) && child.props.active
        );

        return (
            <div className={`mb-1 transition-all duration-300 ${isOpen && !isCollapsed ? 'bg-white/5 p-1 rounded-xl' : ''}`}>
                <button
                    onClick={() => toggleMenu(id)}
                    title={isCollapsed ? title : ''}
                    className={`flex items-center transition-all duration-300 group rounded-xl ${
                        isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'w-full justify-between px-4 py-2.5'
                    } ${
                        isActive ? 'text-white' : 'text-seafoam-100/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-seafoam-300/50 group-hover:text-seafoam-200'} ${isCollapsed ? 'flex items-center justify-center' : ''}`}>
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">{title}</span>}
                    </div>
                    {!isCollapsed && (
                        <svg className={`w-3.5 h-3.5 text-seafoam-400/50 transition-transform duration-500 ${isOpen ? 'rotate-180 text-white' : ''}`} fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    )}
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out space-y-0.5 ${isOpen && !isCollapsed ? 'max-h-[400px] opacity-100 mt-1 pb-1 pl-8 pr-1' : 'max-h-0 opacity-0'}`}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-seafoam-950 text-white overflow-hidden border-r border-white/5 relative">
            {/* Logo Section */}
            <div className={`transition-all duration-500 flex items-center ${isCollapsed ? 'p-4 justify-center' : 'p-6 pb-8 justify-between'}`}>
                <Link href="/" className="flex items-center gap-3.5 group overflow-hidden">
                    <div className={`h-11 w-11 bg-white rounded-xl flex items-center justify-center group-hover:rotate-[10deg] transition-all duration-500 shadow-lg shadow-black/20 shrink-0 ${isCollapsed ? 'h-10 w-10' : ''}`}>
                        <ApplicationLogo className={`${isCollapsed ? 'w-6 h-6' : 'w-7 h-7'} text-seafoam-700`} />
                    </div>
                    {!isCollapsed && (
                        <div className="transition-all duration-500 opacity-100 translate-x-0">
                            <h1 className="text-xl font-black tracking-tighter leading-none">SiPos</h1>
                            <p className="text-[9px] font-black text-seafoam-400 uppercase tracking-[0.2em] mt-1.5">Management</p>
                        </div>
                    )}
                </Link>
            </div>

            <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 ${isCollapsed ? 'px-0' : 'px-4'} space-y-1`}>
                <NavLink href={route('dashboard')} active={route().current('dashboard')} icon={DashboardIcon}>Dashboard</NavLink>

                <div className={`transition-all duration-500 pt-4 pb-2 ${isCollapsed ? 'px-0 flex justify-center' : 'px-4'}`}>
                    {isCollapsed ? <div className="h-px w-8 bg-white/10" /> : <p className="text-[10px] font-black text-seafoam-500/50 uppercase tracking-[0.2em]">Pelayanan</p>}
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

                <div className={`transition-all duration-500 pt-4 pb-2 ${isCollapsed ? 'px-0 flex justify-center' : 'px-4'}`}>
                    {isCollapsed ? <div className="h-px w-8 bg-white/10" /> : <p className="text-[10px] font-black text-seafoam-500/50 uppercase tracking-[0.2em]">Master</p>}
                </div>
                
                <DropdownMenu title="Data Master" id="master" icon={UsersIcon}>
                    <NavLink isSubmenu href={route('desa.index')} active={route().current('desa.*')}>Desa</NavLink>
                    <NavLink isSubmenu href={route('penduduk.index')} active={route().current('penduduk.*')}>Penduduk</NavLink>
                </DropdownMenu>

                {user.role === 'admin' && (
                    <>
                        <div className={`transition-all duration-500 pt-4 pb-2 ${isCollapsed ? 'px-0 flex justify-center' : 'px-4'}`}>
                            {isCollapsed ? <div className="h-px w-8 bg-white/10" /> : <p className="text-[10px] font-black text-seafoam-500/50 uppercase tracking-[0.2em]">Sistem</p>}
                        </div>
                        <NavLink href={route('kader.index')} active={route().current('kader.*')} icon={UserIcon}>Kader</NavLink>
                        <NavLink href={route('users.index')} active={route().current('users.*')} icon={SettingsIcon}>Manajemen Akun</NavLink>
                    </>
                )}
            </div>

            <div className={`transition-all duration-500 ${isCollapsed ? 'p-2' : 'p-4'} relative`}>
                {!isCollapsed && isProfileOpen && (
                    <div className="absolute bottom-20 left-4 right-4 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] py-2 z-50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="px-5 py-2 mb-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Akun Saya</p>
                        </div>
                        <div className="px-2 space-y-0.5">
                            <Link href={route('profile.edit')} className="flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-slate-600 hover:bg-seafoam-50 hover:text-seafoam-600 rounded-xl transition-all group/item">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-white group-hover/item:text-seafoam-600 transition-colors shadow-sm border border-transparent group-hover/item:border-seafoam-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                </div>
                                Pengaturan Profil
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all group/logout">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/logout:bg-white group-hover/logout:text-rose-600 transition-colors shadow-sm border border-transparent group-hover/logout:border-rose-100">
                                    <LogoutIcon size={16} />
                                </div>
                                Keluar dari Sistem
                            </Link>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => isCollapsed ? onToggle() : setIsProfileOpen(!isProfileOpen)}
                    className={`bg-white/5 rounded-2xl transition-all duration-500 flex items-center group mx-auto ${
                        isCollapsed ? 'h-12 w-12 justify-center' : 'w-full p-2 pr-4 gap-3'
                    } ${isProfileOpen && !isCollapsed ? 'bg-white/10' : ''}`}
                >
                    <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center font-black text-xs text-seafoam-700 shadow-sm uppercase shrink-0">
                        {user.name.charAt(0)}
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0 text-left transition-all duration-500 opacity-100">
                                <p className="text-[13px] font-black text-white truncate leading-none">{user.name}</p>
                                <p className="text-[9px] font-bold text-seafoam-400 uppercase mt-1.5">{user.role}</p>
                            </div>
                            <svg className={`w-3 h-3 text-seafoam-400/50 transition-transform ${isProfileOpen ? 'rotate-180 text-white' : ''}`} fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </>
                    )}
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5.0 -10.0 110.0 135.0" fill="currentColor">
            <path d="m90.086 37.758v-6.9922c0-3.7539-3.043-6.8008-6.8008-6.8008h-24.578c-1.6484 0-3.1836-0.85156-4.0586-2.25l-3.4844-5.5742c-0.96875-1.5469-2.6641-2.4883-4.4883-2.4883h-31.469c-2.9219 0-5.293 2.3711-5.293 5.293v18.812c-3.0039 0.78516-5.1562 3.6133-4.8906 6.8633l3.0195 37.305c0.20312 2.4961 2.2891 4.4219 4.793 4.4219h74.328c2.5039 0 4.5898-1.9219 4.793-4.4219l3.0195-37.305c0.26172-3.25-1.8867-6.082-4.8906-6.8633zm-74.18-6.2539h68.184c0.41016 0 0.74219 0.33203 0.74219 0.74219v5.2773h-69.664v-5.2773c0-0.41016 0.33203-0.74219 0.74219-0.74219z"/>
        </svg>
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

const SettingsIcon = ({ size = 22, ...props }) => (
    <svg width={size} height={size} {...props} viewBox="0 0 32 32" fill="currentColor">
        <path d="M13.9863281,2c-2.7529297,0-4.9921875,2.2392578-4.9921875,4.9912109c0,2.7529297,2.2392578,4.9921875,4.9921875,4.9921875 c2.7519531,0,4.9912109-2.2392578,4.9912109-4.9921875C18.9775391,4.2392578,16.7382812,2,13.9863281,2z"/>
        <path d="M4.9873047,24.3017578c0,0.5527344,0.4472656,1,1,1s1-0.4472656,1-1v-2.5947266 c0-3.8642578,3.1396484-7.0078125,6.9980469-7.0078125c0.5814209,0,1.1478271,0.0939941,1.7016602,0.2352905 c0.173584,0.0443115,0.3513184,0.072876,0.5209961,0.1309204c0.5234375,0.1777344,1.0917969-0.0996094,1.2695312-0.6230469 c0.1787109-0.5224609-0.1005859-1.0908203-0.6230469-1.2695312c-0.9189453-0.3144531-1.8847656-0.4736328-2.8691406-0.4736328 c-4.9619141,0-8.9980469,4.0410156-8.9980469,9.0078125V24.3017578z"/>
        <path d="M26.9299927,20.7199707c0.1600342-0.5899658,0.0800171-1.2000122-0.2199707-1.7299805 c-0.3099976-0.5300293-0.8000488-0.9100342-1.3900146-1.0599976c-0.5700073-0.1500244-1.1500244-0.0900269-1.6600342,0.1799927 c-0.3199463-0.2299805-0.6699829-0.4299927-1.0299683-0.5900269c-0.039978-1.2199707-1.0499878-2.1999512-2.2800293-2.1999512 c-1.2299805,0-2.2399902,0.9799805-2.2799683,2.1999512c-0.3599854,0.1600342-0.710022,0.3600464-1.0300293,0.5900269 c-0.5099487-0.2700195-1.0999756-0.3300171-1.6599731-0.1799927c-0.5900269,0.1499634-1.0800171,0.5299683-1.3900146,1.0599976 c-0.2999878,0.5299683-0.3800049,1.1400146-0.2299805,1.7299805c0.1599731,0.5700073,0.5100098,1.0400391,1,1.3500366 c-0.0300293,0.1999512-0.0400391,0.3899536-0.0400391,0.5899658S14.7299805,23.0499878,14.7600098,23.25 c-0.4899902,0.3099976-0.8400269,0.789978-1,1.3499756c-0.1500244,0.5900269-0.0700073,1.2000122,0.2299805,1.7299805 c0.3099976,0.5300293,0.7999878,0.9100342,1.3900146,1.0600586c0.5599976,0.1499634,1.1500244,0.0899658,1.6599731-0.1800537 c0.3200073,0.2300415,0.6700439,0.4300537,1.0300293,0.5900269C18.1099854,29.0199585,19.1199951,30,20.3499756,30 c1.2300415,0,2.2400513-0.9800415,2.2800293-2.2000122c0.3599854-0.1599731,0.710022-0.3599854,1.0299683-0.5900269 c0.5100098,0.2700195,1.1000366,0.3300171,1.6600342,0.1800537c0.5899658-0.1500244,1.0800171-0.5300293,1.3900146-1.0600586 c0.2999878-0.5299683,0.3800049-1.1399536,0.2199707-1.7299805c-0.1499634-0.5700073-0.5-1.039978-0.9899902-1.3499756 c0.0299683-0.2000122,0.039978-0.3900146,0.039978-0.5900269s-0.0100098-0.3900146-0.039978-0.5899658 C26.4299927,21.7600098,26.7800293,21.289978,26.9299927,20.7199707z M20.3699951,23.6599731 c-0.5499878,0-1.0100098-0.4500122-1.0100098-1s0.4500122-1,1-1h0.0100098c0.5499878,0,1,0.4500122,1,1 S20.9199829,23.6599731,20.3699951,23.6599731z"/>
    </svg>
);

const LogoutIcon = ({ size = 18, strokeWidth = 2, ...props }) => (
    <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);
