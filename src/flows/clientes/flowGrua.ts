import { flowSiCliente } from "../flowCliente";
import { blackListFlow } from "../blacklistflow";
import { IDLETIME, reset, start } from "../../idleCustom";
import { addKeyword, EVENTS } from "@builderbot/bot";

export const flowGrua = addKeyword(EVENTS.ACTION)
  .addAnswer("Si necesita una grúa puede llamar al numero 08106660302.")
  .addAnswer("Recordatorio: La cobertura A no posee asistencia de grúa.")
  .addAnswer([
    "👉 *1* - Volver al menú cliente.",
    "👉 *0* - Finalizar conversación.",
  ])
  .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, IDLETIME))
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const option = ctx.body;
    switch (option) {
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
