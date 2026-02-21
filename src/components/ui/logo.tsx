import { Zap } from "lucide-react";

interface LogoProps {
    className?: string;
    textClassName?: string;
    iconClassName?: string;
}

export function Logo({ className = "", textClassName = "", iconClassName = "" }: LogoProps) {
    return (
        <div className={`flex items-center justify-center gap-2 font-bold text-2xl tracking-tight text-slate-900 ${className}`}>
            <Zap className={`w-6 h-6 text-[#0ea5e9] fill-[#0ea5e9] shrink-0 ${iconClassName}`} />
            <span className={textClassName}>Keysprint</span>
        </div>
    );
}
