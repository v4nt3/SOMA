export function getSimpleTemplate(email: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1>¡Gracias por suscribirte!</h1>
      <p>Hola ${email.split("@")[0]},</p>
      <p>Aquí está tu guía gratuita.</p>
      <p><a href="https://ejemplo.com/guia.pdf">Descargar guía</a></p>
    </div>
  `
}
