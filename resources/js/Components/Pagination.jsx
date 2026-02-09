import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center gap-2">
            {links.map((link, i) => {
                if (link.url === null) {
                    return (
                        <div
                            key={i}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed shadow-sm"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        className={`p-2.5 min-w-[44px] flex items-center justify-center rounded-xl border transition-all shadow-sm text-[11px] font-black ${
                            link.active
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-100'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
