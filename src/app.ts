import { createBot, createProvider, createFlow } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { Contact } from "./types/contact";
import { allFlows } from "./allFlows";
import cors from "cors";
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';



const PORT = process.env.PORT ?? 3008;

const main = async () => {
  const adapterFlow = createFlow(allFlows);
  const adapterProvider = createProvider(Provider);
  const adapterDB = new Database();

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  adapterProvider.server.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  const expressApp = adapterProvider.server;

  expressApp.get("/restart", async (req, res) => {
    try {
      // Ruta a la carpeta bot_sessions
      const sessionPath = path.join(__dirname, '..', 'bot_sessions');
      
      // Eliminar la carpeta bot_sessions si existe
      if (fs.existsSync(sessionPath)) {
        const rmdir = promisify(fs.rm);
        await rmdir(sessionPath, { recursive: true, force: true });
        console.log('Carpeta bot_sessions eliminada exitosamente');
      }

      // Trigger a graceful restart using PM2
      setTimeout(() => {
        process.exit(0); // PM2 will automatically restart the process
      }, 1000);
      console.log("exito")
      res.end("Bot restarting and sessions cleared...");
    } catch (error) {
      console.error("Error during bot restart:", error);
      res.status(500).send("Failed to restart bot and clear sessions");
    }
  });

  adapterProvider.server.get("/funciona", (req, res) => res.end("Funciona"));

  adapterProvider.server.post(
    "/rechazos",
    handleCtx(async (bot, req, res) => {
      const contacts = req.body;
      try {
        const promises = contacts.map(async (contact: Contact) => {
          const name = contact.Asegurado;
          const phone = Number("549" + contact["Tel. Celular"]);
          const amount = contact.Importe;

          const message1 = `Hola ${name}, nos comunicamos desde JPMG para informarte que nos llego rechazado el débito automatico de la cuota del seguro. El importe a pagar es de ${amount}. Seleccioná las opciones para gestionar y abonar el mismo dentro de las 48 hs para evitar quedar sin cobertura`;
          const message2 = `
            👉 *EF* - Envío cupon de pago para abonar en Rapipago, pago fácil o santa fe servicios.
            👉 *TC* - Pago con tarjeta de crédito o débito.
            👉 *TR* - Pago por transferencia.`;
          await bot.sendMessage(phone.toString(), message1, {});
          await bot.sendMessage(phone.toString(), message2, {});
        });
        await Promise.all(promises);
      } catch (error) {
        console.error("Error al enviar mensajes:", error);
      }
      res.end("Mensajes enviados.");
    })
  );

  adapterProvider.server.post(
    "/blacklist",
    handleCtx(async (bot, req, res) => {
      const number = req.body.number.toString();
      console.log(number);

      try {
        await bot.sendMessage(
          number,
          "Hola! Me comunico como asesor de parte de JPMG...",
          {}
        );
        bot.blacklist.add(number);
        res.end("Numero agregado a la blacklist");
      } catch (error) {
        console.log("Error al agregar a la blacklist:", error);
      }

      setTimeout(() => {
        console.log("Saque a ", number, " de la blacklist");
        bot.blacklist.remove(number);
      }, 1800000);
    })
  );

  httpServer(+PORT);
};

main();
