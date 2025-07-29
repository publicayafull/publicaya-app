"use client"

import { Input } from "@/components/ui/input"

import { useAppContext, UserType } from "@/context/app-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Eye } from "lucide-react"

export default function UserApp() {
  const { user, userType, isLoadingUser, logout } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && (!user || userType !== UserType.PERSONAL)) {
      router.push("/") // Redirect if not logged in or not a personal user
    }
  }, [user, userType, isLoadingUser, router])

  if (isLoadingUser || !user || userType !== UserType.PERSONAL) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando panel de usuario...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Panel de Usuario</h1>
        <Button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white">
          Cerrar Sesión
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Actual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${user.balance?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Tu saldo disponible para retirar o usar.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anuncios Vistos</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div> {/* Placeholder data */}
            <p className="text-xs text-muted-foreground">Total de anuncios que has interactuado.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.referredUsersCount || 0}</div>
            <p className="text-xs text-muted-foreground">Usuarios que se registraron con tu código.</p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Tus Anuncios</h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Aquí verás los anuncios disponibles para interactuar.</p>
            <Button className="mt-4">Ver Anuncios</Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Programa de Referidos</h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground mb-2">Comparte tu código de referido para ganar más:</p>
            <div className="flex items-center space-x-2">
              <Input readOnly value={user.referralCode || "Generando código..."} className="flex-grow" />
              <Button onClick={() => navigator.clipboard.writeText(user.referralCode || "")}>Copiar</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Gana una comisión por cada usuario que se registre y gane dinero con tu código.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
