export default function ApplicationLogo({ className = "", ...props }) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${className} group/logo`}
        >
            {/* Background Decorative Circle */}
            <circle 
                cx="50" 
                cy="50" 
                r="48" 
                className="stroke-current opacity-10" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
            />
            
            {/* The Pulse Line - Bergerak sedikit saat hover */}
            <path 
                d="M10 50h15l10-30 15 60 10-30h20" 
                className="stroke-current transition-all duration-700 group-hover/logo:stroke-[8px]" 
                strokeWidth="7" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            
            {/* The Plus Symbol */}
            <rect 
                x="65" 
                y="15" 
                width="22" 
                height="7" 
                rx="2" 
                className="fill-current transition-transform duration-500 group-hover/logo:translate-y-[-2px] group-hover/logo:translate-x-[2px]"
            />
            <rect 
                x="72.5" 
                y="7.5" 
                width="7" 
                height="22" 
                rx="2" 
                className="fill-current transition-transform duration-500 group-hover/logo:translate-y-[-2px] group-hover/logo:translate-x-[2px]"
            />
        </svg>
    );
}