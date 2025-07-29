"use server"

import { createClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function signIn(email: string, password: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  // No need to redirect here, AppContext will handle it on session change
  return { success: true, message: "Inicio de sesión exitoso." }
}

export async function signUp(email: string, password: string, role: "user" | "company") {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: role, // Store role in user_metadata
      },
    },
  })

  if (error) {
    return { success: false, message: error.message }
  }

  // Insert into profiles table
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user?.id,
    email: data.user?.email,
    role: role,
    balance: 0,
    campaign_budget: 0,
    referral_code: Math.random().toString(36).substring(2, 10), // Simple random code
    referred_users_count: 0,
  })

  if (profileError) {
    console.error("Error inserting profile:", profileError.message)
    // Optionally, you might want to delete the user if profile creation fails
    await supabase.auth.admin.deleteUser(data.user!.id)
    return { success: false, message: "Error al crear el perfil de usuario." }
  }

  // No need to redirect here, AppContext will handle it on session change
  return { success: true, message: "Registro exitoso. Por favor, verifica tu correo electrónico si es necesario." }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error al cerrar sesión:", error.message)
    return { success: false, message: error.message }
  }

  // Redirect to home page after sign out
  redirect("/")
}
