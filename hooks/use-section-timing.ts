"use client"

import { useEffect, useRef } from "react"
import { useAnalytics } from "./use-analytics"

export function useSectionTiming() {
  const { trackEvent } = useAnalytics()
  const sectionTimings = useRef<Record<string, number>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id

          if (entry.isIntersecting) {
            // Usuario entró en la sección
            sectionTimings.current[sectionId] = Date.now()
          } else if (sectionTimings.current[sectionId]) {
            // Usuario salió de la sección
            const timeSpent = Math.floor((Date.now() - sectionTimings.current[sectionId]) / 1000)

            if (timeSpent > 2) {
              // Solo registrar si pasó más de 2 segundos
              trackEvent("section_time", JSON.stringify({
                category: "engagement",
                label: sectionId,
                value: timeSpent,
                metric_id: "time_on_section",
              }))
            }

            delete sectionTimings.current[sectionId]
          }
        })
      },
      { threshold: 0.5 },
    )

    // Observar todas las secciones
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [trackEvent])
}
