import { flowSiCliente } from "../flowCliente";
import { blackListFlow } from "../blacklistflow";
import { IDLETIME, reset, start } from "../../idleCustom";
import { addKeyword, EVENTS } from "@builderbot/bot";

export const flowContinuacionSiniestro = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "¿Necesita realizar algo más?",
    "👉 *1* - Otra consulta.",
    "👉 *2* - Menú cliente.",
    "👉 *0* - Finalizar conversación.",
  ])
  .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, IDLETIME))
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const response = ctx.body;
    switch (response) {
      case "1":
        return gotoFlow(flowSiniestro);
      case "2":
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

export const flowDenunciaSiniestro = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "A continuación deje la siguiente información",
    "DNI del involucrado, Numero de póliza, Fecha del siniestro, Lugar del siniestro, Descripción del siniestro.",
    "👉 *0* - Cancelar",
  ])
  .addAnswer(
    "*IMPORTANTE:* Porfavor adjunte todos los datos en un solo mensaje"
  )
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic, globalState }) => {
      const response = ctx.body;
      if (response === "0") {
        return gotoFlow(flowSiniestro);
      }
      if (response.length > 3) {
        globalState.update({ readyForBL: true });
        await flowDynamic(
          "Gracias, en breve nos comunicaremos con usted para la denuncia de su siniestro (cod#1300)"
        );
        return gotoFlow(flowContinuacionSiniestro);
      }
      return fallBack(
        "❌ Debe ingresar una información valida. 0 para cancelar"
      );
    }
  );

export const flowConsultaSiniestro = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "A continuación deje el número de siniestro que quiere consultar.",
    "👉 *0* - Cancelar",
  ])
  .addAnswer(
    "*IMPORTANTE:* Porfavor adjunte todos los datos en un solo mensaje"
  )
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, globalState, flowDynamic }) => {
      const response = ctx.body;
      if (response === "0") {
        return gotoFlow(flowSiniestro);
      }
      if (response.length > 3) {
        globalState.update({ readyForBL: true });
        await flowDynamic(
          "Gracias, en breve nos comunicaremos con usted para la consulta de su siniestro (cod#1301)"
        );
        return gotoFlow(flowContinuacionSiniestro);
      }
      return fallBack(
        "❌ Debe ingresar un número de siniestro válido. 0 para cancelar"
      );
    }
  );

export const flowOtraConsultaSiniestro = addKeyword(EVENTS.ACTION)
  .addAnswer(["Aqui iria otra consulta"])
  .addAnswer(
    "*IMPORTANTE:* Porfavor adjunte todos los datos en un solo mensaje"
  )
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, globalState, flowDynamic }) => {
      const response = ctx.body;
      if (response === "4") {
        return gotoFlow(flowSiCliente);
      } else {
        globalState.update({ readyForBL: true });
        await flowDynamic(
          "Gracias, en breve nos comunicaremos con usted para otra consulta sobre siniestro (cod#1302)"
        );
        return gotoFlow(flowContinuacionSiniestro);
      }
    }
  );

export const flowSiniestro = addKeyword(EVENTS.ACTION)
  .addAnswer("Usted puede...")
  .addAnswer([
    "👉 *1* - Denunciar siniestro.",
    "👉 *2* - Consultar siniestro.",
    "👉 *3* - Otras consultas.",
    "👉 *4* - Volver al menú cliente.",
    "👉 *0* - Finalizar conversación.",
  ])
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const option = ctx.body;
    switch (option) {
      case "1":
        return gotoFlow(flowDenunciaSiniestro);
      case "2":
        return gotoFlow(flowConsultaSiniestro);
      case "3":
        return gotoFlow(flowOtraConsultaSiniestro);
      case "4":
        return gotoFlow(flowSiCliente);
      case "0":
        return gotoFlow(blackListFlow);
      default:
        return fallBack(
          "❌ Opción no válida, por favor seleccione una opción válida"
        );
    }
  });
