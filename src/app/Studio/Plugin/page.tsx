import { Suspense } from 'react';
import Navigation from "@/components/afterNav";
import PluginClient from '@/components/Studio/PluginPage';

export default function PluginPage() {
    return (
        <>
            <Navigation />
            <main className="min-h-screen px-4 py-10">
                <Suspense fallback={<p className="text-center">Loading stream details...</p>}>
                    <PluginClient />
                </Suspense>
            </main>
        </>
    );
}
