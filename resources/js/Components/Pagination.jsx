import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center gap-1.5">
            {links.map((link, i) => {
                const isActive = link.active;
                const isDisabled = !link.url;
                const isFirst = i === 0;
                const isLast = i === links.length - 1;

                // Konten untuk tombol
                let content = link.label;

                if (isFirst) {
                    content = (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    );
                } else if (isLast) {
                    content = (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    );
                }

                if (isDisabled) {
                    return (
                        <div
                            key={i}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed"
                        >
                            {typeof content === 'string' ? (
                                <span dangerouslySetInnerHTML={{ __html: content }} />
                            ) : content}
                        </div>
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all text-xs font-black ${
                            isActive
                                ? 'bg-seafoam-600 border-seafoam-600 text-white shadow-lg shadow-seafoam-100'
                                : 'bg-white border-slate-200 text-slate-500 hover:text-seafoam-600 hover:border-seafoam-200 hover:bg-seafoam-50/50'
                        }`}
                    >
                        {typeof content === 'string' ? (
                            <span dangerouslySetInnerHTML={{ __html: content }} />
                        ) : content}
                    </Link>
                );
            })}
        </div>
    );
}