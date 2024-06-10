import { flowConsulta } from "./flowBienvenida";
import { blackListFlow } from "./blacklistflow";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { flowTipoCotizacionNoCliente } from "./noClientes/flowCotizacion";
import { flowRepresentanteDeVentas } from "./noClientes/flowRepresentante";
import { flowOtraConsultaNoCliente } from "./noClientes/flowOtraConsulta";

export const flowNoCliente = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "GRACIAS POR COMUNICARTE! Nos alegra poder ayudarte con nuestros servicios.",
    "*RECORDATORIO*: Nuestros horarios de atención son de 8 a 16hs",
  ])
  .addAnswer([
    "¿En que podemos asistirte?",
    "👉 *1* - Solicitar una cotización.",
    "👉 *2* - Solicitar que lo contacte un representante de ventas.",
    "👉 *3* - Otras consultas",
    "👉 *0* - Finalizar conversación",
  ])
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, endFlow }) => {
      const option = ctx.body;
      switch (option) {
        case "1":
          return gotoFlow(flowTipoCotizacionNoCliente);
        case "2":
          return gotoFlow(flowRepresentanteDeVentas);
        case "3":
          return gotoFlow(flowOtraConsultaNoCliente);
        case "0":
          return gotoFlow(blackListFlow);
        default:
          return fallBack(
            "❌ Opción no válida, por favor seleccione una opción válida."
          );
      }
    }
  );
