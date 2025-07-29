"use client"

import { useAppContext, UserType } from "@/context/app-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Megaphone, TrendingUp } from "lucide-react"

export default function CompanyApp() {
  const { user, userType, isLoadingUser, logout } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && (!user || userType !== UserType.EMPRESA)) {
      router.push("/") // Redirect if not logged in or not a company user
    }
  }, [user, userType, isLoadingUser, router])

  if (isLoadingUser || !user || userType !== UserType.EMPRESA) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando panel de empresa...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Panel de Empresa</h1>
        <Button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white">
          Cerrar Sesión
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto de Campaña</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${user.campaignBudget?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Fondos disponibles para tus campañas.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div> {/* Placeholder data */}
            <p className="text-xs text-muted-foreground">Número de campañas en curso.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impresiones Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150,000</div> {/* Placeholder data */}
            <p className="text-xs text-muted-foreground">Total de veces que tus anuncios han sido vistos.</p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Mis Campañas</h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Aquí verás y gestionarás tus campañas publicitarias.</p>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">Crear Nueva Campaña</Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Gestión de Fondos</h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground mb-2">Añade fondos a tu presupuesto de campaña.</p>
            <Button className="bg-green-500 hover:bg-green-600 text-white">Añadir Fondos</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
