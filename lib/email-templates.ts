export const emailTemplates = {
  welcome: (userName = "allí") => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6366F1;">¡Hola ${userName}!</h1>
      <p>Gracias por unirte a SOMA. Estamos emocionados de tenerte con nosotros.</p>
      <p>Adjunto encontrarás la guía que te prometimos para comenzar a mejorar tu relación con la tecnología.</p>
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      <div style="margin-top: 30px; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
        <p style="margin: 0; font-weight: bold;">El equipo de SOMA</p>
      </div>
    </div>
  `,

  reminder: (userName = "allí") => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6366F1;">¡Hola de nuevo, ${userName}!</h1>
      <p>Queríamos recordarte que tienes acceso a nuestra guía de bienestar digital.</p>
      <p>¿Has tenido oportunidad de revisarla? Nos encantaría saber tu opinión.</p>
      <div style="margin-top: 30px; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
        <p style="margin: 0; font-weight: bold;">El equipo de SOMA</p>
      </div>
    </div>
  `,

  // Puedes agregar más plantillas según sea necesario
}
