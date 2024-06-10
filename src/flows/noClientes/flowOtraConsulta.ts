import { addKeyword, EVENTS } from "@builderbot/bot";
import { flowNoCliente } from "../flowNoCliente";

export const flowOtraConsultaNoCliente = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Deje escrita su consulta y nos comunicaremos con usted a la brevedad.",
    "*RECORDATORIO*: Nuestro horario de atención es de *8* a *16* hs",
    "👉 *0* - Para cancelar",
  ])
  .addAnswer("*IMPORTANTE:* Por favor, adjunte su consulta en un solo mensaje")
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, globalState, flowDynamic }) => {
      const resp = ctx.body;
      if (resp === "0") {
        return gotoFlow(flowNoCliente);
      }
      if (resp.length > 6) {
        globalState.update({ readyForBL: true });
        await flowDynamic(
          "Perfecto, responderemos tu consulta cuanto antes. (cod#1500)"
        );
        return gotoFlow(flowNoCliente);
      }
      return fallBack(
        "❌ Debe ingresar una consulta válida, por favor intente nuevamente."
      );
    }
  );
