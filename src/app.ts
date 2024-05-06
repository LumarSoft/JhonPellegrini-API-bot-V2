import { createBot, createProvider, createFlow } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { Contact } from "./types/contact";
import { allFlows } from "./allFlows";
import cors from "cors";

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

  adapterProvider.server.use(cors({ origin: "*", methods: ["GET", "POST"] }));

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
        await bot.sendMessage(number, "Te meti a la blacklist", {});
        bot.blacklist.add(number);
        res.end("Numero agregado a la blacklist");
      } catch (error) {
        console.log("Error al agregar a la blacklist:", error);
      }

      setTimeout(() => {
        console.log("Saque a ", number, " de la blacklist");
        bot.blacklist.remove(number);
      }, 10000);
    })
  );

  httpServer(+PORT);
};

main();
