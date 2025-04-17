export default function getWelcomeEmailTemplate(downloadUrl: string) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366F1; margin-bottom: 10px;">¡Bienvenido a SOMA!</h1>
          <p style="font-size: 16px; line-height: 1.5;">Tu guía para el bienestar digital</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Gracias por unirte a nuestra comunidad. Estamos comprometidos a ayudarte a mejorar tu relación con la tecnología.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Hemos preparado una guía especial para ti que contiene consejos prácticos para comenzar tu viaje hacia un mejor bienestar digital.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" 
             style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Descargar mi guía
          </a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Si tienes alguna pregunta, simplemente responde a este correo. Estamos aquí para ayudarte.
        </p>
        
        <div style="margin-top: 40px; padding: 20px; background-color: #F3F4F6; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-weight: bold;">El equipo de SOMA</p>
          <p style="margin: 5px 0 0; font-size: 14px; color: #666;">Mejorando tu bienestar digital</p>
        </div>
      </div>
    `
  }
  