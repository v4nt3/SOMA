"use client"

import { useState } from "react"
import { sendWelcomeEmail } from "@/components/actions/email-action"

export default function PDFTestPage() {
  const [pdfInfo, setPdfInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailResult, setEmailResult] = useState<any>(null)
  const [emailLoading, setEmailLoading] = useState(false)

  const checkPDF = async () => {
    setLoading(true)
    setPdfInfo(null)

    try {
      const response = await fetch("/api/check-pdf")
      const data = await response.json()
      setPdfInfo(data)
    } catch (error) {
      setPdfInfo({
        success: false,
        error: `Error: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const testEmail = async () => {
    if (!email) return

    setEmailLoading(true)
    setEmailResult(null)

    try {
      const result = await sendWelcomeEmail(email)
      setEmailResult(result)
    } catch (error) {
      setEmailResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de PDF y Correo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección de prueba de PDF */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-4">Verificar URL del PDF</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Esta prueba verifica si la URL del PDF configurada en las variables de entorno es accesible desde el
            servidor.
          </p>

          <button
            onClick={checkPDF}
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 mb-4"
          >
            {loading ? "Verificando..." : "Verificar URL del PDF"}
          </button>

          {pdfInfo && (
            <div
              className={`p-4 rounded-md mt-4 ${
                pdfInfo.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              <h3 className="font-bold mb-2">{pdfInfo.success ? "PDF Accesible" : "Error"}</h3>
              {pdfInfo.success ? (
                <div>
                  <p className="mb-1">
                    <span className="font-medium">URL:</span> {pdfInfo.url}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Tipo:</span> {pdfInfo.contentType}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Tamaño:</span> {pdfInfo.size}
                  </p>
                </div>
              ) : (
                <p>{pdfInfo.error}</p>
              )}

              <div className="mt-4">
                <h4 className="font-medium mb-2">Headers de respuesta:</h4>
                <pre className="text-xs bg-black/10 p-2 rounded overflow-x-auto">
                  {JSON.stringify(pdfInfo.headers, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Sección de prueba de correo */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-4">Probar Envío de Correo con PDF</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Esta prueba envía un correo electrónico con el PDF adjunto a la dirección que especifiques.
          </p>

          <div className="mb-4">
            <label htmlFor="test-email" className="block text-sm font-medium mb-2">
              Correo electrónico de prueba
            </label>
            <input
              type="email"
              id="test-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder="tu@email.com"
            />
          </div>

          <button
            onClick={testEmail}
            disabled={emailLoading || !email}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50"
          >
            {emailLoading ? "Enviando..." : "Enviar Correo de Prueba"}
          </button>

          {emailResult && (
            <div
              className={`p-4 rounded-md mt-4 ${
                emailResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              <h3 className="font-bold mb-2">{emailResult.success ? "Correo Enviado" : "Error"}</h3>
              <p>{emailResult.message}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border mt-6">
        <h2 className="text-lg font-medium mb-4">Soluciones Comunes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">URL no accesible:</span> Asegúrate de que la URL del PDF sea accesible
            públicamente y no tenga restricciones de CORS.
          </li>
          <li>
            <span className="font-medium">Tamaño del PDF:</span> Si el PDF es demasiado grande (más de 10MB), considera
            comprimirlo o usar un enlace en lugar de un adjunto.
          </li>
          <li>
            <span className="font-medium">Formato de URL:</span> Asegúrate de que la URL comience con https:// y apunte
            directamente al archivo PDF.
          </li>
          <li>
            <span className="font-medium">Permisos de Vercel Blob:</span> Si estás usando Vercel Blob, verifica que el
            archivo tenga permisos de acceso público.
          </li>
        </ul>
      </div>
    </div>
  )
}
