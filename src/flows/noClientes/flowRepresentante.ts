import { addKeyword, EVENTS } from "@builderbot/bot";
import { flowNoCliente } from "../flowNoCliente";
import { blackListFlow } from "../blacklistflow";

export const flowRepresentanteDeVentas = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Un representante se comunicará con usted a la brevedad. (cod#1600)",
    "¿Desea realizar otra consulta?",
    "👉 *1* - Volver al menu.",
    "👉 *0* - Finalizar conversación.",
  ])
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const option = ctx.body;
    if (option === "1") {
      return gotoFlow(flowNoCliente);
    }

    if (option === "0") {
      return gotoFlow(blackListFlow);
    }

    return fallBack(
      "❌ Opción no válida, por favor seleccione una opción válida."
    );
  });
