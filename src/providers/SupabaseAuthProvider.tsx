"use client";

import { useState } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClientSupabase } from "@/lib/supabase/supabase";

// Types
interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider = ({ children }: SupabaseAuthProviderProps) => {
  // State
  const [supabaseClient] = useState(() => createClientSupabase());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};