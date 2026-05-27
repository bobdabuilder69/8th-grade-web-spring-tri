import { createClient } from "@supabase/supabase-js";
const SUPABASE_KEY = "sb_publishable_C8l0g37Mh6OE0yvgtAK7kA_lCp6aaiY";
const SUPABASE_URL = "https://zerallzfhrrvlotapitk.supabase.co";

console.log("[Supabase] Initializing client with URL:", SUPABASE_URL);
console.log("[Supabase] Key type: publishable");

const supabase = createClient(
	SUPABASE_URL,
	SUPABASE_KEY,
);

console.log("[Supabase] Client initialized successfully");

export default supabase