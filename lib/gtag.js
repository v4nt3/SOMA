// lib/gtag.js
export const GA_TRACKING_ID = 'G-N6TYQCE95K'; // tu ID real

// Para registrar una vista de página
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
