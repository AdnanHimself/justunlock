import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCases } from '@/lib/use-cases';
import { Button } from '@/components/ui/Button';
import { Check, ArrowRight } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const useCase = useCases.find((u) => u.slug === slug);

    if (!useCase) {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: `${useCase.title} | BaseLock`,
        description: useCase.description,
        openGraph: {
            title: `${useCase.title} | BaseLock`,
            description: useCase.description,
        },
    };
}

export async function generateStaticParams() {
    return useCases.map((useCase) => ({
        slug: useCase.slug,
    }));
}

export default async function UseCasePage({ params }: Props) {
    const { slug } = await params;
    const useCase = useCases.find((u) => u.slug === slug);

    if (!useCase) {
        notFound();
    }

    const Icon = useCase.icon;

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="container px-4 mx-auto relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4">
                            <Icon className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            {useCase.heroTitle}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                            {useCase.heroDescription}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/">
                                <Button className="text-lg px-8 py-6 h-auto w-full sm:w-auto">
                                    Start Selling Now <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background Gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-secondary/10 border-y border-border/50">
                <div className="container px-4 mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Why use BaseLock?</h2>
                            <div className="space-y-4">
                                {useCase.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-green-500" />
                                        </div>
                                        <span className="text-lg">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{useCase.title}</div>
                                            <div className="text-xs text-muted-foreground">Locked Content</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-lg">$50.00</div>
                                </div>
                                <div className="py-8 text-center space-y-2">
                                    <div className="text-4xl">🔒</div>
                                    <p className="text-sm text-muted-foreground">Content is hidden until payment</p>
                                </div>
                                <Button className="w-full" disabled>Unlock for $50.00</Button>
                                <p className="text-xs text-center text-muted-foreground">Demo Preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-24">
                <div className="container px-4 mx-auto max-w-3xl space-y-12">
                    <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
                    <div className="grid gap-6">
                        {useCase.faq.map((item, index) => (
                            <div key={index} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                                <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                                <p className="text-muted-foreground">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary/5 border-t border-border">
                <div className="container px-4 mx-auto text-center space-y-6">
                    <h2 className="text-3xl font-bold">Ready to monetize?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Create your first locked link in seconds. No account required.
                    </p>
                    <Link href="/">
                        <Button className="text-lg px-10 py-6 h-auto">
                            Create Link Now
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
