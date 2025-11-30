

interface UseCaseCardProps {
    icon: string;
    title: string;
    description: string;
}

export function UseCaseCard({ icon, title, description }: UseCaseCardProps) {
    return (
        <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover-glow group h-full">
            <div className="text-4xl mb-4 transition-transform duration-300">{icon}</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    );
}
