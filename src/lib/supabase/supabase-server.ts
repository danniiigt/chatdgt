import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Cliente para componentes del servidor
export const createServerSupabase = async () => {
  const cookieStore = await cookies();
  return createServerComponentClient({ cookies: () => cookieStore as any });
};
