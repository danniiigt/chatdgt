import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Cliente para componentes del servidor
export const createServerSupabase = async () => {
  return createServerComponentClient({ cookies });
};
