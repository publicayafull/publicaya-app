// lib/supabase.ts
import { createBrowserClient, createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies, headers } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key environment variables.")
}

// Cliente para navegador
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Cliente para servidor (Next.js 13+ App Router)
export function createServerSideClient() {
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      headers: headers(),
      cookies: cookies(),
    }
  )
}
