import Sidebar from '@/Components/Sidebar';
import Toast from '@/Components/Toast';
import { usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'success' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Load preference from localStorage if exists
        const savedState = localStorage.getItem('sidebar-collapsed');
        if (savedState !== null) {
            setIsSidebarCollapsed(savedState === 'true');
        }
    }, []);

    const toggleSidebarCollapse = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', newState);
    };

    useEffect(() => {
        let startEvent = router.on('start', () => setProcessing(true));
        let finishEvent = router.on('finish', () => setProcessing(false));

        return () => {
            startEvent();
            finishEvent();
        };
    }, []);

    useEffect(() => {
        if (flash.message) {
            setToast({ message: flash.message, type: 'success' });
        } else if (flash.error) {
            setToast({ message: flash.error, type: 'error' });
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-seafoam-950 flex flex-col sm:flex-row font-sans">
            {/* Global Toast Notification */}
            {toast.message && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ message: '', type: 'success' })} 
                />
            )}

            {/* Mobile Header */}
            <div className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-seafoam-800 bg-seafoam-900 p-3 sm:hidden">
                <span className="text-base font-black tracking-tighter text-white">SiPos</span>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex sm:hidden">
                    <div className="fixed inset-0 bg-seafoam-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
                    <div className="relative flex w-64 flex-col transition-transform">
                        <Sidebar user={auth.user} isCollapsed={false} />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className={`hidden sm:fixed sm:inset-y-0 sm:left-0 sm:z-40 sm:block transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'sm:w-20' : 'sm:w-60'}`}>
                <Sidebar user={auth.user} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebarCollapse} />
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out min-h-screen ${isSidebarCollapsed ? 'sm:ps-20' : 'sm:ps-60'}`}>
                <div className="flex-1 p-1.5 sm:p-2 lg:p-2.5 flex flex-col">
                    {/* The Main Content Card */}
                    <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <main className="flex-1 px-3 py-4 sm:px-4 lg:px-6 text-[13px] overflow-y-auto custom-scrollbar"> {/* Font reduced to 13px */}
                            <div className="mx-auto max-w-7xl">
                                {/* Page Header - Compact */}
                                {header && (
                                    <div className="mb-4 flex items-center justify-between border-b border-slate-50 pb-3">
                                        <div className="flex items-center gap-2.5">
                                            <button 
                                                onClick={toggleSidebarCollapse}
                                                className="h-5 w-1.5 bg-seafoam-500 rounded-full hover:bg-seafoam-600 hover:scale-x-125 transition-all duration-300 hidden sm:block"
                                                title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                                            ></button>
                                            <div className="h-5 w-1 bg-seafoam-500 rounded-full sm:hidden"></div>
                                            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase"> {/* Title slightly smaller */}
                                                {header}
                                            </h2>
                                        </div>
                                        
                                        {processing && (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-seafoam-50 rounded-lg border border-seafoam-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-seafoam-500 animate-spin"></div>
                                                <span className="text-[8px] font-black text-seafoam-600 uppercase tracking-widest">Loading...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Page Content */}
                                <div className="text-slate-600 font-medium">
                                    {children}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
