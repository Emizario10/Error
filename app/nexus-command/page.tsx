import NexusCommandClient from './NexusCommandClient';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * NEXUS_COMMAND: Central Intelligence Dashboard.
 * Protected administrative vault for real-time extraction monitoring.
 * Upgraded to Military Grade with React Query and Intelligent Alerts.
 */
export default async function NexusCommandPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const ADMIN_EMAIL = "juanfe13lasso@gmail.com";

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/catalog?system_alert=ACCESS_DENIED_UNAUTHORIZED_IP_LOGGED');
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-8 lg:px-20 relative overflow-hidden">
      {/* CRT_SCANLINE_EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%] opacity-20" />
      
      <NexusCommandClient />

      {/* AMBIENT_BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#111_1px,transparent_0)] bg-[length:50px_50px] opacity-30" />
    </div>
  );
}
