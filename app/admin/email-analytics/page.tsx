import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function EmailAnalyticsPage() {
  const supabase = createServerSupabaseClient()

  // Obtener estadísticas generales
  const { data: totalEmails, error: totalError } = await supabase.from("email_logs").select("*", { count: "exact" })

  // Obtener correos exitosos
  const { data: successfulEmails, error: successError } = await supabase
    .from("email_logs")
    .select("*", { count: "exact" })
    .eq("success", true)

  // Obtener correos fallidos
  const { data: failedEmails, error: failedError } = await supabase
    .from("email_logs")
    .select("*", { count: "exact" })
    .eq("success", false)

  // Obtener estadísticas por día (últimos 7 días)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString()

  const { data: dailyStats, error: dailyError } = await supabase
    .from("email_logs")
    .select("sent_at, success")
    .gte("sent_at", sevenDaysAgoStr)
    .order("sent_at", { ascending: true })

  // Procesar datos para gráfico diario
  const dailyData: Record<string, { total: number; success: number; failed: number }> = {}

  dailyStats?.forEach((log) => {
    const date = new Date(log.sent_at).toISOString().split("T")[0]
    if (!dailyData[date]) {
      dailyData[date] = { total: 0, success: 0, failed: 0 }
    }
    dailyData[date].total++
    if (log.success) {
      dailyData[date].success++
    } else {
      dailyData[date].failed++
    }
  })

  const chartData = Object.entries(dailyData).map(([date, stats]) => ({
    date,
    total: stats.total,
    success: stats.success,
    failed: stats.failed,
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Análisis de Correos Electrónicos</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-2">Total de Correos</h2>
          <p className="text-3xl font-bold text-primary">{totalEmails?.length || 0}</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-2">Correos Exitosos</h2>
          <p className="text-3xl font-bold text-green-500">{successfulEmails?.length || 0}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {totalEmails?.length
              ? `${Math.round(((successfulEmails?.length || 0) / (totalEmails?.length || 1)) * 100)}% de tasa de éxito`
              : "0% de tasa de éxito"}
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-2">Correos Fallidos</h2>
          <p className="text-3xl font-bold text-destructive">{failedEmails?.length || 0}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {totalEmails?.length
              ? `${Math.round(((failedEmails?.length || 0) / totalEmails?.length) * 100)}% de tasa de error`
              : "0% de tasa de error"}
          </p>
        </div>
      </div>

      {/* Tabla de correos recientes */}
      <div className="bg-card p-6 rounded-lg border border-border mb-8">
        <h2 className="text-lg font-medium mb-4">Correos Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Correo</th>
                <th className="text-left py-3 px-4">Fecha</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Error</th>
              </tr>
            </thead>
            <tbody>
              {totalEmails?.slice(0, 10).map((log) => (
                <tr key={log.id} className="border-b border-border">
                  <td className="py-3 px-4">{log.email}</td>
                  <td className="py-3 px-4">{new Date(log.sent_at).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        log.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.success ? "Éxito" : "Error"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-destructive">{log.error_message || "-"}</td>
                </tr>
              ))}
              {(!totalEmails || totalEmails.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-muted-foreground">
                    No hay registros de correos enviados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico de correos por día (representación visual) */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-lg font-medium mb-4">Correos por Día (Últimos 7 días)</h2>
        {chartData.length > 0 ? (
          <div className="h-64 flex items-end space-x-2">
            {chartData.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center space-y-1">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${(day.success / Math.max(...chartData.map((d) => d.total))) * 200}px` }}
                  ></div>
                  <div
                    className="w-full bg-red-500 rounded-t"
                    style={{ height: `${(day.failed / Math.max(...chartData.map((d) => d.total))) * 200}px` }}
                  ></div>
                </div>
                <div className="text-xs mt-2 text-muted-foreground">{day.date.split("-").slice(1).join("/")}</div>
                <div className="text-xs font-medium">{day.total}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No hay datos para mostrar.</p>
        )}
      </div>
    </div>
  )
}
