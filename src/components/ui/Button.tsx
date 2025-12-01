import React from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'gold' | 'high-contrast';
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    isLoading,
    variant = 'primary',
    icon,
    disabled,
    ...props
}) => {
    const baseStyles = "w-full font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-transparent cursor-pointer";

    const variants = {
        primary: "bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20",
        secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border hover:border-primary/50",
        success: "bg-green-600 hover:bg-green-500 text-white", // Keeping green for success as it's specific
        danger: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
        gold: "bg-amber-400 hover:bg-amber-300 text-black border border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]",
        "high-contrast": "bg-black text-white border-2 border-white dark:bg-white dark:text-black dark:border-black hover:opacity-90 shadow-lg",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className, "justify-center px-6")}
            disabled={isLoading || disabled}
            {...props}
        >
            <span className="text-center whitespace-nowrap">{children}</span>
            {(isLoading || icon) && (
                <div className="flex items-center pl-2 h-full">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
                </div>
            )}
        </button>
    );
};
