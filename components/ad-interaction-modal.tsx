"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle } from "lucide-react"

interface AdInteractionModalProps {
  adId: string
  onAdViewed: (adId: string, success: boolean) => void
}

export default function AdInteractionModal({ adId, onAdViewed }: AdInteractionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewed, setViewed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleViewAd = async () => {
    setLoading(true)
    // Simulate ad viewing process
    await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate 3-second ad view
    const success = Math.random() > 0.2 // 80% chance of success
    setViewed(success)
    onAdViewed(adId, success)
    setLoading(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setViewed(false) // Reset state for next open
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Ver Anuncio</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Interacción con Anuncio</DialogTitle>
          <DialogDescription>
            {viewed
              ? viewed
                ? "¡Anuncio visto con éxito!"
                : "Hubo un problema al ver el anuncio."
              : "Por favor, mira el anuncio completo para ganar tu recompensa."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {viewed ? (
            <div className="flex flex-col items-center justify-center text-center">
              {viewed ? (
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
              )}
              <p className="text-lg font-semibold">{viewed ? "¡Recompensa obtenida!" : "Inténtalo de nuevo."}</p>
            </div>
          ) : (
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
              {loading ? "Cargando anuncio..." : "Contenido del Anuncio Aquí"}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          {!viewed && (
            <Button onClick={handleViewAd} disabled={loading}>
              {loading ? "Viendo Anuncio..." : "Iniciar Anuncio"}
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
