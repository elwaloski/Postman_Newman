const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Logger simple
function log(msg) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}\n`;
  fs.appendFileSync("log.txt", line);
  console.log(line.trim());
}


async function waitForFile(path, timeout = 10000) {
  const start = Date.now();
  
  while (true) {
    if (fs.existsSync(path)) return true;

    if (Date.now() - start > timeout) {
      throw new Error("El archivo reporte.html no apareció a tiempo.");
    }

    await new Promise(res => setTimeout(res, 500)); // espera 0.5s
  }
}

async function sendMail() {
  const reportePath = "./reporte.html";
  log("Esperando a que se genere reporte.html...");

  await waitForFile(reportePath);
  log("Archivo encontrado.");

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "waldo.gonzalez0900@gmail.com",
      pass: "uukm sciv dovu goed" // NO la clave normal
    }
  });
	log("Enviando correo...");
  let info = await transporter.sendMail({
    from: '"Reporte Automatizado" <waldo.gonzalez0900@gmail.com>',
    to: "w.b.g.serrano@gmail.com",
    subject: "Reporte de ejecución de automatizacion APIFULLRESTNETCORE8",
    text: "Hola,\n\nSe adjunta el reporte generado por las pruebas actuomatizadas de postman para el WSS APIFULLRESTNETCORE8 .\n\nSaludos.",
    attachments: [
      {
        filename: "reporte.html",
        path: reportePath,
      }
    ]
  });

  log("Correo enviado ✔ ID: " + info.envelope.to);
}

sendMail().catch(err => {
  log("ERROR: " + err.message);
});