import { Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 500); // Wait for animation to finish
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    const icons = {
        success: (
            <svg className="h-6 w-6 text-seafoam-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        error: (
            <svg className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    const bgColors = {
        success: 'bg-white border-seafoam-100 shadow-seafoam-100',
        error: 'bg-white border-rose-100 shadow-rose-100',
    };

    return (
        <div className="fixed bottom-10 right-10 z-[100] pointer-events-none">
            <Transition
                show={show}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-[1.5rem] border bg-white p-4 shadow-2xl ${bgColors[type]}`}>
                    <div className="flex items-center gap-4">
                        <div className="shrink-0">{icons[type]}</div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-slate-900">{type === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}</p>
                            <p className="mt-0.5 text-xs font-bold text-slate-500 leading-relaxed">{message}</p>
                        </div>
                        <button
                            onClick={() => setShow(false)}
                            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    );
}
