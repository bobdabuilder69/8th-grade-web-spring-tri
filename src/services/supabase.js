import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://zerallzfhrrvlotapitk.supabase.co";

console.log("[Supabase] Initializing client with URL:", SUPABASE_URL);
console.log("[Supabase] Key type: publishable");
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(
	SUPABASE_URL,
	SUPABASE_KEY,
);

console.log("[Supabase] Client initialized successfully");

export default supabase