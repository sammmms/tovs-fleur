import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ahxfeflxhpkxyfitarpn.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_4B_NhAHs7HK8MAn9S9K0Vg_cbl0oKX8";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
