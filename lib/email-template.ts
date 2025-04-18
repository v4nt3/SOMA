export const emailTemplates = {
  welcome: (userName: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a SOMA</title>
  <style type="text/css">
    /* Estilos base */
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body style="background-color: #f9f9f9; margin: 0; padding: 0;">
  <!-- Contenedor principal -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #1a1a2e; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          
          <!-- Encabezado -->
          <tr>
            <td align="center" style="padding: 40px 30px 30px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">SOMA</h1>
                    <p style="margin: 10px 0 0; font-size: 18px; color: #a2d2ff; font-style: italic;">Equilibrio digital para un mejor descanso</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Contenido principal -->
          <tr>
            <td style="padding: 40px 30px; background-color: #1a1a2e;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #7ee8fa; font-weight: bold;">¡Hola ${userName}!</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff;">Gracias por unirte a SOMA. Estamos emocionados de acompañarte en tu camino hacia un mejor equilibrio digital y hábitos de sueño más saludables.</p>
                    <p style="margin: 0 0 30px; font-size: 16px; color: #ffffff;">Adjunto encontrarás nuestra guía exclusiva que te ayudará a transformar tu relación con la tecnología, especialmente durante las horas nocturnas.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Sección de consejos -->
          <tr>
            <td style="padding: 0 30px 40px; background-color: #1a1a2e;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.05); border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin: 0 0 15px; font-size: 18px; color: #7ee8fa; font-weight: bold;">Consejos rápidos para empezar:</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="20" valign="top" style="padding: 5px 10px 5px 0;">
                          <div style="background-color: #7ee8fa; width: 8px; height: 8px; border-radius: 50%; margin-top: 8px;"></div>
                        </td>
                        <td style="padding: 5px 0; color: #e0e0e0; font-size: 15px;">Establece horarios fijos para el uso del celular</td>
                      </tr>
                      <tr>
                        <td width="20" valign="top" style="padding: 5px 10px 5px 0;">
                          <div style="background-color: #7ee8fa; width: 8px; height: 8px; border-radius: 50%; margin-top: 8px;"></div>
                        </td>
                        <td style="padding: 5px 0; color: #e0e0e0; font-size: 15px;">Activa los filtros de luz azul por la noche</td>
                      </tr>
                      <tr>
                        <td width="20" valign="top" style="padding: 5px 10px 5px 0;">
                          <div style="background-color: #7ee8fa; width: 8px; height: 8px; border-radius: 50%; margin-top: 8px;"></div>
                        </td>
                        <td style="padding: 5px 0; color: #e0e0e0; font-size: 15px;">Usa la función de escala de grises para reducir la estimulación visual</td>
                      </tr>
                      <tr>
                        <td width="20" valign="top" style="padding: 5px 10px 5px 0;">
                          <div style="background-color: #7ee8fa; width: 8px; height: 8px; border-radius: 50%; margin-top: 8px;"></div>
                        </td>
                        <td style="padding: 5px 0; color: #e0e0e0; font-size: 15px;">Desactiva las notificaciones al menos una hora antes de dormir</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Botón de acción -->
          <tr>
            <td style="padding: 0 30px 40px; background-color: #1a1a2e; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://soma-landing-page.vercel.app" style="display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #7ee8fa 0%, #80d0c7 100%); color: #1a1a2e; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0;">Visitar SOMA</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Pie de página -->
          <tr>
            <td style="padding: 30px; background-color: #16213e; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #a2d2ff; font-weight: bold;">SOMA</p>
                    <p style="margin: 0 0 20px; font-size: 13px; color: #7a8599;">Equilibrio digital para un mejor descanso</p>
                    <p style="margin: 0; font-size: 12px; color: #7a8599;">© 2025 SOMA. Todos los derechos reservados.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,

  // Puedes añadir más plantillas aquí
  reminder: (userName: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recordatorio de SOMA</title>
</head>
<body style="background-color: #f9f9f9; margin: 0; padding: 0;">
  <!-- Contenedor principal -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #1a1a2e; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          
          <!-- Encabezado -->
          <tr>
            <td align="center" style="padding: 40px 30px 30px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">SOMA</h1>
                    <p style="margin: 10px 0 0; font-size: 18px; color: #a2d2ff; font-style: italic;">Recordatorio de bienestar digital</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Contenido principal -->
          <tr>
            <td style="padding: 40px 30px; background-color: #1a1a2e;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #7ee8fa; font-weight: bold;">Hola de nuevo, ${userName}</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; color: #ffffff;">¿Cómo va tu experiencia con SOMA? Queremos recordarte la importancia de mantener hábitos digitales saludables.</p>
                    <p style="margin: 0 0 30px; font-size: 16px; color: #ffffff;">¿Has probado ya la función de escala de grises? Muchos usuarios reportan una mejora significativa en su calidad de sueño después de implementarla.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Botón de acción -->
          <tr>
            <td style="padding: 0 30px 40px; background-color: #1a1a2e; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://soma-landing-page.vercel.app" style="display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #7ee8fa 0%, #80d0c7 100%); color: #1a1a2e; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0;">Visitar SOMA</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Pie de página -->
          <tr>
            <td style="padding: 30px; background-color: #16213e; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #a2d2ff; font-weight: bold;">SOMA</p>
                    <p style="margin: 0 0 20px; font-size: 13px; color: #7a8599;">Equilibrio digital para un mejor descanso</p>
                    <p style="margin: 0; font-size: 12px; color: #7a8599;">© 2025 SOMA. Todos los derechos reservados.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
}
