// lib/supabase.ts
import { createBrowserClient, createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies, headers } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function createServerSupabaseClient() {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    headers: headers(),
    cookies: cookies(),
  })
}
