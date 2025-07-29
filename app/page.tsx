"use client"

import { useEffect } from "react"
import AuthPage from "@/components/auth-page"
import UserApp from "@/components/user-app"
import CompanyApp from "@/components/company-app"
import AdminApp from "@/components/admin-app"
import { useAppContext, UserType } from "@/context/app-context"

export default function HomePage() {
  const { user, userType, isLoadingUser, logout } = useAppContext()

  useEffect(() => {
    // This effect will run when user or userType changes from AppContext
    // The redirection logic is now handled by AppContext and the individual app components
    // This page primarily acts as a router based on the global user state.
  }, [user, userType, isLoadingUser])

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando aplicación...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  switch (userType) {
    case UserType.PERSONAL:
      return <UserApp />
    case UserType.EMPRESA:
      return <CompanyApp />
    case UserType.ADMIN:
      return <AdminApp />
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Bienvenido a Publicaya</h1>
          <p className="text-lg mb-8">
            Tu rol no ha sido asignado o no es reconocido. Por favor, contacta al administrador.
          </p>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Cerrar Sesión
          </button>
        </div>
      )
  }
}
