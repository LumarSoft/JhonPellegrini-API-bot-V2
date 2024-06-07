import { flowSiCliente } from "../flowCliente";
import { blackListFlow } from "../blacklistflow";
import { IDLETIME, reset, start } from "../../idleCustom";
import { addKeyword, EVENTS } from "@builderbot/bot";

export const flowConfirmacionPoliza = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Gracias, a la brevedad nos comunicaremos para informarle el estado de su documentación. (cod#1201)",
    "¿Necesita algo más?",
    "👉 *1* - Solicitar otra documentación.",
    "👉 *2* - Menú cliente.",
    "👉 *0* - No, finalizar conversación.",
  ])
  .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, IDLETIME))
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const response = ctx.body;
    switch (response) {
      case "1":
        return gotoFlow(flowDocumentacion);
      case "2":
        return gotoFlow(flowSiCliente);
      case "0":
        return gotoFlow(blackListFlow);
      default:
        reset(ctx, gotoFlow, IDLETIME);
        return fallBack("❌ Opción no válida.");
    }
  });

export const flowConfirmacionCuponera = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Gracias, a la brevedad nos comunicaremos para informarle el estado de su cuponera. (cod#1201)",
    "¿Necesita algo más?",
    "👉 *1* - Solicitar otra documentación.",
    "👉 *2* - Menú cliente.",
    "👉 *0* - No, finalizar conversación.",
  ])
  .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, IDLETIME))
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const response = ctx.body;
    switch (response) {
      case "1":
        return gotoFlow(flowDocumentacion);
      case "2":
        return gotoFlow(flowSiCliente);
      case "0":
        return gotoFlow(blackListFlow);
      default:
        reset(ctx, gotoFlow, IDLETIME);
        return fallBack("❌ Opción no válida.");
    }
  });

export const flowPoliza = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Por favor, deje el dni del titular o patente en caso de ser un vehículo.",
    "👉 *0* - Para cancelar.",
  ])
  .addAnswer(
    "*IMPORTANTE:* Porfavor adjunte todos los datos en un solo mensaje"
  )
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, globalState }) => {
      const response = ctx.body;
      if (response === "0") {
        return gotoFlow(flowDocumentacion);
      }
      if (response.length > 3) {
        globalState.update({ readyForBL: true });
        return gotoFlow(flowConfirmacionPoliza);
      }
      return fallBack(
        "❌ Debe ingresar un dni o patente válida. 0 para cancelar"
      );
    }
  );

export const flowCuponera = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Por favor deje el dni del titular o patente en caso de ser un vehículo.",
    "👉 *0* - Para cancelar.",
  ])
  .addAnswer(
    "*IMPORTANTE:* Porfavor adjunte todos los datos en un solo mensaje"
  )
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, globalState }) => {
      const response = ctx.body;
      if (response === "0") {
        return gotoFlow(flowDocumentacion);
      }
      if (response.length > 3) {
        globalState.update({ readyForBL: true });
        return gotoFlow(flowConfirmacionCuponera);
      }
      return fallBack(
        "❌ Debe ingresar un dni o patente válida. 0 para cancelar"
      );
    }
  );

export const flowDocumentacion = addKeyword(EVENTS.ACTION)
  .addAnswer("¿Que documentación necesita?")
  .addAnswer([
    "👉 *1* - Póliza.",
    "👉 *2* - Cuponera.",
    "👉 *3* - Volver al menú cliente.",
    "👉 *0* - Finalizar.",
  ])
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const option = ctx.body;
    switch (option) {
      case "1":
        return gotoFlow(flowPoliza);
      case "2":
        return gotoFlow(flowCuponera);
      case "3":
        return gotoFlow(flowSiCliente);
      case "0":
        return gotoFlow(blackListFlow);
      default:
        return fallBack(
          "❌ Opción no válida, por favor seleccione una opción válida. 3 para volver al menu cliente"
        );
    }
  });
