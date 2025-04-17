"use client"

export function useAnalytics() {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  return { trackEvent }
}
