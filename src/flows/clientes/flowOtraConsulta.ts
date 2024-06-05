import { flowSiCliente } from "../flowCliente";
import { blackListFlow } from "../blacklistflow";
import { IDLETIME, reset, start } from "../../idleCustom";
import { addKeyword, EVENTS } from "@builderbot/bot";

export const FlowContinuar = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Perfecto. ¿Necesita realizar algo más?",
    "👉 *1* - Menú cliente.",
    "👉 *0* - ¡Nos vemos luego!",
  ])
  .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, IDLETIME))
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const response = ctx.body;
    switch (response) {
      case "1":
        return gotoFlow(flowSiCliente);
      case "0":
        return gotoFlow(blackListFlow);
      default:
        reset(ctx, gotoFlow, IDLETIME);
        return fallBack(
          "❌ Opción no válida, por favor seleccione una opción válida"
        );
    }
  });

export const flowOtraConsulta = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Deje escrita su consulta y nos comunicaremos con usted a la brevedad.",
    "*RECORDATORIO*: Nuestro horario de atención es de *8* a *16* hs",
    "👉 *0* - Para cancelar",
  ])
  .addAnswer("*IMPORTANTE:*Por favor, adjunte su consulta en un solo mensaje")
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, globalState, flowDynamic }) => {
      const resp = ctx.body;
      if (resp === "0") {
        return gotoFlow(flowSiCliente);
      }
      if (resp.length > 6) {
        globalState.update({ readyForBL: true });
        await flowDynamic(
          "Perfecto, responderemos tu consulta cuanto antes (cod#1500)"
        );
        return gotoFlow(FlowContinuar);
      }
      return fallBack(
        "❌ Debe ingresar una consulta válida, por favor intente nuevamente."
      );
    }
  );
