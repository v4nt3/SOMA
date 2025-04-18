"use client"

import { useState } from "react"
import { debugSendEmail } from "@/components/actions/email-debug"

export default function EmailDebugPage() {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const debugResult = await debugSendEmail(email)
      setResult(debugResult)
    } catch (error) {
      setResult({
        success: false,
        message: `Error no capturado: ${error instanceof Error ? error.message : String(error)}`,
        step: "client_error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Depuración de Envío de Correos</h1>

      <div className="bg-card p-6 rounded-lg border border-border mb-6">
        <div className="mb-4">
          <label htmlFor="debug-email" className="block text-sm font-medium mb-2">
            Correo electrónico de prueba
          </label>
          <input
            type="email"
            id="debug-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="tu@email.com"
          />
        </div>

        <button
          onClick={handleTest}
          disabled={loading || !email}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50"
        >
          {loading ? "Probando..." : "Probar envío de correo"}
        </button>
      </div>

      {result && (
        <div
          className={`p-4 rounded-md mb-6 ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          <h2 className="font-bold mb-2">{result.success ? "Éxito" : "Error"}</h2>
          <p className="mb-2">{result.message}</p>
          <p className="text-sm">Paso: {result.step}</p>
        </div>
      )}

      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-lg font-medium mb-4">Pasos de depuración</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Validación del formato de correo electrónico</li>
          <li>Verificación de variables de entorno</li>
          <li>Inicialización de Resend</li>
          <li>Prueba de conexión con Resend</li>
          <li>Verificación de acceso al PDF</li>
          <li>Envío de correo simple (sin adjuntos)</li>
        </ol>
      </div>
    </div>
  )
}
