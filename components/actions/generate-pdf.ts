"use server"

import PDFDocument from "pdfkit"
import { put } from "@vercel/blob"

export async function generateCustomPDF(userName: string) {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // Crear un buffer para almacenar el PDF
      const chunks: Buffer[] = []

      // Crear un nuevo documento PDF
      const doc = new PDFDocument()

      // Pipe el PDF a un buffer
      doc.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)))

      doc.on("end", async () => {
        // Concatenar todos los chunks en un solo buffer
        const pdfBuffer = Buffer.concat(chunks)

        // Subir el PDF a Vercel Blob
        const fileName = `guia-personalizada-${Date.now()}.pdf`
        const { url } = await put(fileName, pdfBuffer, {
          access: "public",
        })

        resolve(url)
      })

      // Agregar contenido al PDF
      doc.font("Helvetica-Bold").fontSize(25).text("SOMA - Guía de Bienestar Digital", {
        align: "center",
      })

      doc.moveDown()
      doc.font("Helvetica").fontSize(16).text(`Preparado especialmente para: ${userName}`, {
        align: "center",
      })

      doc.moveDown()
      doc.fontSize(12).text("Esta guía te ayudará a mejorar tu relación con la tecnología...")

      // Agregar más contenido según sea necesario

      // Finalizar el documento
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
