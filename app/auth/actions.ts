"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function signIn(email: string, password: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: "Inicio de sesión exitoso." }
}

export async function signUp(email: string, password: string, role: "user" | "company") {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: role,
      },
    },
  })

  if (error) {
    return { success: false, message: error.message }
  }

  // Insertar perfil en tabla profiles
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user?.id,
    email: data.user?.email,
    role: role,
    balance: 0,
    campaign_budget: 0,
    referral_code: Math.random().toString(36).substring(2, 10),
    referred_users_count: 0,
  })

  if (profileError) {
    console.error("Error inserting profile:", profileError.message)
    // Opcional: eliminar usuario si fallo el perfil
    await supabase.auth.admin.deleteUser(data.user!.id)
    return { success: false, message: "Error al crear el perfil de usuario." }
  }

  return { success: true, message: "Registro exitoso. Por favor, verifica tu correo electrónico si es necesario." }
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error al cerrar sesión:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/")
}
