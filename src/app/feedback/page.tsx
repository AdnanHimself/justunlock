'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Loader2, Send } from 'lucide-react';

export default function FeedbackPage() {
    const { showToast } = useToast();
    const [category, setCategory] = useState('general');
    const [message, setMessage] = useState('');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('feedback')
                .insert({
                    category,
                    message,
                    contact_info: contact,
                    created_at: new Date().toISOString(),
                });

            if (error) throw error;

            setSubmitted(true);
            showToast('Feedback sent! Thank you.', 'success');
        } catch (err) {
            console.error('Error sending feedback:', err);
            showToast('Failed to send feedback. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-[calc(100vh-7rem)] bg-background text-foreground p-8 transition-colors flex items-center justify-center">
                <div className="max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                        <Send className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Thank You!</h2>
                    <p className="text-muted-foreground">Your feedback helps us improve BaseLock.</p>
                    <Button onClick={() => setSubmitted(false)} variant="secondary">
                        Send Another
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-7rem)] bg-background text-foreground p-4 md:p-8 transition-colors">
            <div className="max-w-xl mx-auto space-y-6 md:space-y-8">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">Feedback</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Found a bug? Have a feature request? Let us know!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 bg-card border border-border p-4 md:p-6 rounded-2xl shadow-sm">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-card border border-input rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-primary transition-colors text-foreground appearance-none text-sm md:text-base"
                        >
                            <option value="general">General Feedback</option>
                            <option value="bug">Report a Bug</option>
                            <option value="feature">Feature Request</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you think..."
                            rows={4}
                            className="w-full bg-input/10 border border-input rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground resize-none text-sm md:text-base"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contact (Optional)</label>
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Email or Discord handle"
                            className="w-full bg-input/10 border border-input rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground text-sm md:text-base"
                        />
                    </div>

                    <Button type="submit" isLoading={loading} disabled={loading} className="w-full">
                        Send Feedback
                    </Button>
                </form>
            </div>
        </main>
    );
}
