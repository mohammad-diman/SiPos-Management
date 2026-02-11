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
        if (route().current('pemeriksaan-lansia.*') || route().current('lansia.index')) {
            menusToOpen.push('posbindu');
        }
        if (route().current('desa.*') || route().current('penduduk.*')) {
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

    const NavLink = ({ href, active, children, icon: Icon, isSubmenu = false, iconSize = 18 }) => (
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
                    <Icon size={iconSize} strokeWidth={active ? 2.5 : 2} />
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
                        <NavLink href={route('kader.index')} active={route().current('kader.*')} icon={UserIcon} iconSize={22}>Kader</NavLink>
                        <NavLink href={route('users.index')} active={route().current('users.*')} icon={SettingsIcon} iconSize={22}>Manajemen Akun</NavLink>
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5.0 -10.0 110.0 135.0" fill="currentColor">
            <path d="m37.234 77.383 4.875-4.4961 5.4062 11.379zm20.648-4.4805-5.3867 11.34 10.246-6.8594zm7.5-9.0664c-0.92578-0.35938-1.8281-0.71875-2.6797-1.082l-3.5703 7.5117h6.25zm-24.52 6.4297-3.5703-7.5117c-0.85938 0.36328-1.7695 0.73047-2.707 1.0898v6.4219zm32.824-10.277c-3.7656 0.75781-10.191 1.1523-17.074-2.3359-2.2148 1.3828-4.4961 2.1719-6.6133 2.1719s-4.3984-0.78906-6.6094-2.168c-6.8828 3.4844-13.312 3.0898-17.074 2.3359-1.4727-0.29688-2.082-2.043-1.1484-3.2188 4.8555-6.1172 5.7812-17.328 5.957-21.652-0.32812-1.418-0.52344-2.8906-0.52344-4.4062 0-4.6211 1.6445-8.8438 4.3438-12.172v-5.5469c0-2.1562 1.3633-4.1094 3.3984-4.8516 3.9141-1.4375 9.1133-3.1445 11.656-3.1445s7.7422 1.707 11.66 3.1406c2.0312 0.74609 3.3984 2.6953 3.3984 4.8516v5.5469c2.6992 3.332 4.3438 7.5508 4.3438 12.172 0 1.5195-0.19141 2.9883-0.52344 4.4062 0.17578 4.3242 1.1016 15.531 5.957 21.652 0.92969 1.1797 0.32031 2.9258-1.1484 3.2188zm-37.238-38.73c0 0.51563 0.26562 0.98438 0.70703 1.2539 0.4375 0.26562 0.94141 0.28125 1.3867 0.046875 2.4531-1.2812 6.4336-2.8125 11.457-2.8125s9.0039 1.5312 11.453 2.8125c0.44531 0.23047 0.95312 0.21484 1.3867-0.050782 0.44531-0.26953 0.70703-0.73828 0.70703-1.2539l0.003906-8.2617c0-1.5312-0.96875-2.9102-2.4102-3.4414-5.3711-1.9648-9.3281-3.0469-11.141-3.0469s-5.7695 1.082-11.141 3.0508c-1.4414 0.52734-2.4102 1.9102-2.4102 3.4414zm30.621 16.402c-0.38281-0.79688-0.96094-1.543-1.4492-2.1445-1.2695-1.5742-2.8398-2.9258-4.582-3.9531-0.9375-0.55469-1.9453-1.0156-2.9766-1.3555-1.25-0.41406-2.7852-0.40625-4.0977-0.57422-1.2227-0.15234-2.4141-0.25-3.5742-0.68359-1.7773-0.67188-3.375-1.7734-4.6914-3.1406-0.41406-0.42969-0.80469-0.88672-1.1562-1.3711-0.066407-0.089844-0.38672-0.42969-0.375-0.55469-1.3164 11.418-9.4062 12.766-11.27 12.926 0.35937 8.8047 6.1836 16.809 12.023 20.02 0.41797 0.23047 0.83203 0.42969 1.2461 0.60938 0.035156 0.015625 0.066406 0.03125 0.10156 0.042969 0.39844 0.16797 0.79297 0.3125 1.1836 0.42969 0.046875 0.015625 0.09375 0.027344 0.14453 0.042969 0.38672 0.10938 0.76562 0.19922 1.1406 0.26172 0.042969 0.007812 0.082031 0.011718 0.125 0.015625 0.38672 0.058593 0.76953 0.09375 1.1406 0.09375s0.75391-0.035157 1.1406-0.09375c0.042969-0.007813 0.082031-0.011719 0.125-0.015625 0.375-0.0625 0.75781-0.14844 1.1406-0.26172 0.046875-0.015625 0.09375-0.027344 0.14453-0.042969 0.39062-0.11719 0.78516-0.26172 1.1836-0.42969 0.035157-0.015625 0.066407-0.027344 0.10156-0.042969 0.41406-0.17969 0.83203-0.37891 1.2461-0.60938 5.6445-3.1094 11.297-10.699 11.984-19.168zm-12.738-26.078h-2.1797c-0.29297 0-0.53516-0.23828-0.53516-0.53516v-2.1797c0-0.29297-0.23828-0.53516-0.53516-0.53516h-2.168c-0.29297 0-0.53516 0.23828-0.53516 0.53516v2.1797c0 0.29297-0.23828 0.53516-0.53516 0.53516h-2.1797c-0.29297 0-0.53516 0.23828-0.53516 0.53516v2.168c0 0.29297 0.23828 0.53516 0.53516 0.53516h2.1797c0.29297 0 0.53516 0.23828 0.53516 0.53516v2.1797c0 0.29297 0.23828 0.53516 0.53516 0.53516h2.168c0.29297 0 0.53516-0.23828 0.53516-0.53516v-2.1797c0-0.29297 0.23828-0.53516 0.53516-0.53516h2.1797c0.29297 0 0.53516-0.23828 0.53516-0.53516v-2.168c0-0.29688-0.23828-0.53516-0.53516-0.53516zm28.887 80.977c-5.7461 1.0977-17.094 2.4414-33.219 2.4414s-27.473-1.3438-33.219-2.4414c-3.0898-0.58984-5.0547-3.1758-4.4648-5.8281l3.1367-14.047c0.51172-2.2969 2.5312-4.1523 5.1953-4.7031 4.5781-0.94922 8.75-2.2188 12.434-3.5703v6.6055c0 0.41406 0.33594 0.75391 0.75391 0.75391h7.2617l-5.5859 5.1523c-0.16797 0.15625-0.25781 0.38281-0.23828 0.61328 0.019531 0.23047 0.14062 0.4375 0.33203 0.56641l13.969 9.3477c0.046875 0.03125 0.09375 0.050781 0.14453 0.070312 0.074219 0.03125 0.14453 0.050781 0.22266 0.054688 0.011719 0 0.023438 0.007812 0.035156 0.007812 0.003907 0 0.007813-0.003906 0.011719-0.003906 0.003907 0 0.007813 0.003906 0.011719 0.003906 0.011719 0 0.023438-0.007812 0.035156-0.007812 0.074219-0.007813 0.14844-0.023438 0.22266-0.054688 0.050782-0.019531 0.097657-0.039062 0.14453-0.070312l13.969-9.3477c0.19141-0.12891 0.3125-0.33594 0.33203-0.56641 0.019531-0.23047-0.070313-0.45703-0.23828-0.61328l-5.5859-5.1523h7.2578c0.41406 0 0.75391-0.33594 0.75391-0.75391v-6.6172c3.6914 1.3555 7.875 2.6289 12.461 3.582 2.6641 0.55078 4.6836 2.4062 5.1953 4.7031l3.1367 14.047c0.58984 2.6562-1.3789 5.2383-4.4648 5.8281zm-4.75-9.6289c0-0.37891-0.30859-0.68359-0.68359-0.68359h-2.8008c-0.37891 0-0.68359-0.30859-0.68359-0.68359v-2.8008c0-0.37891-0.30859-0.68359-0.68359-0.68359h-2.7852c-0.37891 0-0.68359 0.30859-0.68359 0.68359v2.8008c0 0.37891-0.30859 0.68359-0.68359 0.68359h-2.8008c-0.37891 0-0.68359 0.30859-0.68359 0.68359v2.7852c0 0.37891 0.30859 0.68359 0.68359 0.68359h2.8008c0.37891 0 0.68359 0.30859 0.68359 0.68359v2.8008c0 0.37891 0.30859 0.68359 0.68359 0.68359h2.7852c0.37891 0 0.68359-0.30859 0.68359-0.68359v-2.8008c0-0.37891 0.30859-0.68359 0.68359-0.68359h2.8008c0.37891 0 0.68359-0.30469 0.68359-0.68359z"/>
        </svg>
    </div>
);

const CalendarIcon = ({ size = 18, ...props }) => (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
            <g>
                <path d="M55.834,10v7.1h-48V10c0-1.1,0.9-2,2-2h2.07v2.75c0,1.91,1.55,3.46,3.46,3.46c0.55,0,1-0.44,1-1c0-0.55-0.45-1-1-1 c-0.81,0-1.46-0.65-1.46-1.46V8h8.98v2.75c0,1.91,1.55,3.46,3.46,3.46c0.56,0,1-0.44,1-1c0-0.55-0.44-1-1-1 c-0.8,0-1.46-0.65-1.46-1.46V8h8.98v2.75c0,1.91,1.56,3.46,3.47,3.46c0.55,0,1-0.44,1-1c0-0.55-0.45-1-1-1 c-0.81,0-1.47-0.65-1.47-1.46V8h8.98v2.75c0,1.91,1.56,3.46,3.47,3.46c0.55,0,1-0.44,1-1c0-0.55-0.45-1-1-1 c-0.81,0-1.47-0.65-1.47-1.46V8h6.99C54.944,8,55.834,8.9,55.834,10z"/>
                <g><path d="M18.834,5.46V8c0,0.55-0.45,1-1,1c-0.56,0-1-0.45-1-1V5.46c0-0.8-0.66-1.46-1.47-1.46c-0.81,0-1.46,0.66-1.46,1.46V8h-2 V5.46c0-1.91,1.55-3.46,3.46-3.46C17.274,2,18.834,3.55,18.834,5.46z"/></g>
                <g><path d="M29.814,5.46V8c0,0.55-0.45,1-1,1s-1-0.45-1-1V5.46c0-0.8-0.66-1.46-1.47-1.46c-0.8,0-1.46,0.66-1.46,1.46V8h-2V5.46 c0-1.91,1.55-3.46,3.46-3.46C28.254,2,29.814,3.55,29.814,5.46z"/></g>
                <g><path d="M40.794,5.46V8c0,0.55-0.45,1-1,1c-0.55,0-1-0.45-1-1V5.46c0-0.8-0.66-1.46-1.46-1.46c-0.81,0-1.47,0.66-1.47,1.46V8h-2 V5.46c0-1.91,1.56-3.46,3.47-3.46C39.244,2,40.794,3.55,40.794,5.46z"/></g>
                <g><path d="M51.774,5.46V8c0,0.55-0.45,1-1,1c-0.55,0-1-0.45-1-1V5.46c0-0.8-0.65-1.46-1.46-1.46s-1.47,0.66-1.47,1.46V8h-2V5.46 c0-1.91,1.56-3.46,3.47-3.46S51.774,3.55,51.774,5.46z"/></g>
                <path d="M7.464,19.1V59c0,1.1,0.9,2,2,2h23.65c9.32-4.68,15.46-15.47,15.52-15.59c0.18-0.31,0.51-0.51,0.87-0.51c0,0,0,0,0.01,0 c0.35,0,0.69,0.19,0.86,0.51c1.01,1.75,3.49,1.61,5.09,1.3V19.1H7.464z M17.392,55.84c0,1.104-0.895,1.999-1.999,1.999h-2.269 c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999h2.269c1.104,0,1.999,0.895,1.999,1.999V55.84z M17.392,46.054c0,1.104-0.895,1.999-1.999,1.999h-2.269c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999 h2.269c1.104,0,1.999,0.895,1.999,1.999V46.054z M17.392,36.268c0,1.104-0.895,1.999-1.999,1.999h-2.269 c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999h2.269c1.104,0,1.999,0.895,1.999,1.999V36.268z M28.999,55.84c0,1.104-0.895,1.999-1.999,1.999H24.73c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999 h2.269c1.104,0,1.999,0.895,1.999,1.999V55.84z M28.999,46.054c0,1.104-0.895,1.999-1.999,1.999H24.73 c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999h2.269c1.104,0,1.999,0.895,1.999,1.999V46.054z M28.999,36.268c0,1.104-0.895,1.999-1.999,1.999H24.73c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999 h2.269c1.104,0,1.999,0.895,1.999,1.999V36.268z M28.999,26.483c0,1.104-0.895,1.999-1.999,1.999H24.73 c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999h2.269c1.104,0,1.999,0.895,1.999,1.999V26.483z M40.606,46.054c0,1.104-0.895,1.999-1.999,1.999h-2.269c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999 h2.269c1.104,0,1.999,0.895,1.999,1.999V46.054z M40.606,36.268c0,1.104-0.895,1.999-1.999,1.999h-2.269 c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999h2.269c1.104,0,1.999,0.895,1.999,1.999V36.268z M40.606,26.483c0,1.104-0.895,1.999-1.999,1.999h-2.269c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999 h2.269c1.104,0,1.999,0.895,1.999,1.999V26.483z M52.213,36.268c0,1.104-0.895,1.999-1.999,1.999h-2.269 c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999h2.269c1.104,0,1.999,0.895,1.999,1.999V36.268z M52.213,26.483c0,1.104-0.895,1.999-1.999,1.999h-2.269c-1.104,0-1.999-0.895-1.999-1.999v-2.269c0-1.104,0.895-1.999,1.999-1.999 h2.269c1.104,0,1.999,0.895,1.999,1.999V26.483z"/>
                <path d="M49.639,47.624c-1.6,2.534-5.673,8.398-11.517,12.646c6.039-1.75,14.344-5.163,17.346-11.125v-0.394 C53.733,49.035,51.308,49.075,49.639,47.624z"/>
                <path d="M42.424,61h11.045c1.105,0,2-0.895,2-2v-6.211C52.263,56.677,47.12,59.294,42.424,61z"/>
            </g>
        </svg>
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
