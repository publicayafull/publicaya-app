"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Users, DollarSign, BarChart2 } from "lucide-react"
import { useAppContext, UserType } from "@/context/app-context"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  email: string
  role: "user" | "company" | "admin"
  balance: number
  created_at: string
}

interface Ad {
  id: string
  title: string
  company_id: string
  budget: number
  status: "active" | "paused" | "completed"
  views_count: number
  referrals_count: number
}

interface Transaction {
  id: string
  user_id: string
  amount: number
  type: "deposit" | "withdrawal" | "ad_reward" | "referral_reward" | "ad_spend"
  created_at: string
  status: "pending" | "approved" | "rejected"
}

export default function AdminApp() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [companies, setCompanies] = useState<UserProfile[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeAds, setActiveAds] = useState<number>(0)
  const [pendingTransactions, setPendingTransactions] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()
  const { user, userType, isLoadingUser, logout } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && (!user || userType !== UserType.ADMIN)) {
      router.push("/") // Redirect to home/auth if not logged in or not an admin
    }
    if (!isLoadingUser && user && userType === UserType.ADMIN) {
      fetchData()
    }
  }, [user, userType, isLoadingUser, router])

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([
      fetchUsers(),
      fetchCompanies(),
      fetchTransactions(),
      fetchActiveAds(),
      fetchPendingTransactions(),
    ])
    setLoading(false)
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*").eq("role", "user")
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios.",
        variant: "destructive",
      })
      return
    }
    setUsers(data)
  }

  const fetchCompanies = async () => {
    const { data, error } = await supabase.from("profiles").select("*").eq("role", "company")
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las empresas.",
        variant: "destructive",
      })
      return
    }
    setCompanies(data)
  }

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false })
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las transacciones.",
        variant: "destructive",
      })
      return
    }
    setTransactions(data)
  }

  const fetchActiveAds = async () => {
    const { data, error } = await supabase.from("ads").select("*").eq("status", "active")
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las campañas activas.",
        variant: "destructive",
      })
      return
    }
    setActiveAds(data.length)
  }

  const fetchPendingTransactions = async () => {
    const { data, error } = await supabase.from("transactions").select("*").eq("status", "pending")
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las transacciones pendientes.",
        variant: "destructive",
      })
      return
    }
    setPendingTransactions(data.length)
  }

  const handleApproveTransaction = async (transactionId: string, userId: string, amount: number) => {
    const { error: transactionError } = await supabase
      .from("transactions")
      .update({ status: "approved" })
      .eq("id", transactionId)

    if (transactionError) {
      toast({
        title: "Error",
        description: "No se pudo aprobar la transacción.",
        variant: "destructive",
      })
      return
    }

    const { error: balanceError } = await supabase.rpc("update_user_balance", {
      p_user_id: userId,
      p_amount: amount,
    })

    if (balanceError) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el balance del usuario.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Transacción Aprobada",
      description: "La transacción ha sido aprobada y el balance del usuario actualizado.",
      variant: "success",
    })
    fetchData()
  }

  const handleRejectTransaction = async (transactionId: string) => {
    const { error } = await supabase.from("transactions").update({ status: "rejected" }).eq("id", transactionId)

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la transacción.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Transacción Rechazada",
      description: "La transacción ha sido marcada como rechazada.",
      variant: "success",
    })
    fetchData()
  }

  if (isLoadingUser || !user || userType !== UserType.ADMIN) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando panel de administrador...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando panel de administración...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Panel de Administrador</h1>
        <Button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white">
          Cerrar Sesión
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Usuarios registrados en la plataforma.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones Pendientes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">Solicitudes de retiro o depósito pendientes.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAds}</div>
            <p className="text-xs text-muted-foreground">Número de campañas publicitarias en curso.</p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Gestión de Usuarios</h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Administra y modera las cuentas de usuario.</p>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">Ver Usuarios</Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Gestión de Transacciones</h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Revisa y aprueba las transacciones financieras.</p>
            <Button className="bg-green-500 hover:bg-green-600 text-white">Ver Transacciones</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
