import React from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
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
    const baseStyles = "w-full font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-transparent hover-glow";

    const variants = {
        primary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md border border-primary/20",
        secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border hover:border-primary/50",
        success: "bg-green-600 hover:bg-green-500 text-white shadow-sm hover:shadow-md", // Keeping green for success as it's specific
        danger: "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm hover:shadow-md",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
            {children}
        </button>
    );
};
