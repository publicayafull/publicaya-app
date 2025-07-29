"use server"

import { supabaseServerClient as supabase } from "@/lib/supabaseServer"
import { redirect } from "next/navigation"

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true, message: "Inicio de sesión exitoso." }
}

// Para signUp y signOut igual usa el mismo `supabase`
// y usa los métodos de Supabase Auth server
