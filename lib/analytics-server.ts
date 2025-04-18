// Función para rastrear eventos desde el servidor
export async function trackServerEvent({ name, params }: { name: string; params?: Record<string, any> }) {
    try {
      if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        console.error("Missing GA_MEASUREMENT_ID environment variable")
        return
      }
  
      // Usar la API de medición de Google Analytics 4
      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: "server-side-client-id",
            events: [
              {
                name,
                params: {
                  ...params,
                  engagement_time_msec: "100",
                  session_id: `server_${Date.now()}`,
                },
              },
            ],
          }),
        },
      )
  
      if (!response.ok) {
        throw new Error(`Error tracking event: ${response.statusText}`)
      }
  
      return true
    } catch (error) {
      console.error("Error tracking server event:", error)
      return false
    }
  }
  