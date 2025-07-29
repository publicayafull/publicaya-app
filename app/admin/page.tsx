"use client"

import { useAppContext, UserType } from "@/context/app-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const { user, userType, isLoadingUser, logout } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && (!user || userType !== UserType.ADMIN)) {
      router.push("/") // Redirect if not logged in or not an admin user
    }
  }, [user, userType, isLoadingUser, router])

  if (isLoadingUser || !user || userType !== UserType.ADMIN) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Bienvenido, {user.name || user.email}!</h1>
      <p className="text-lg mb-8">Este es tu panel de administrador.</p>
      <Button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white">
        Cerrar Sesión
      </Button>
    </div>
  )
}
