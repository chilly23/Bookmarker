import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

let NEXT_PUBLIC_SUPABASE_URL = "https://rzhbaitscdwoeozwewoy.supabase.co";
let 
NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_LRpKLIRHDH8gyPtms820IQ_0eyuCe7e";


export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
