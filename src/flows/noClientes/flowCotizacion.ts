import { addKeyword, EVENTS } from "@builderbot/bot";
import { blackListFlow } from "../blacklistflow";

export const flowTipoCotizacionNoCliente = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Por favor, seleccione que tipo de cotización desea realizar.",
    "👉 *1* - Vehículos.",
    "👉 *2* - Otros bienes o riesgos.",
    "👉 *0* - Finalizar conversacion.",
  ])
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const response = ctx.body;

    switch (response) {
      case "1":
        return gotoFlow(flowCotizacionVehiculoNoCliente);
      case "2":
        return gotoFlow(flowCotizacionOtrosRiesgosNoCliente);
      case "0":
        return gotoFlow(blackListFlow);
      default:
        return fallBack(
          "❌ Opción no válida, por favor seleccione una opción válida."
        );
    }
  });

export const flowCotizacionVehiculoNoCliente = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Por favor, realice una descripción del vehiculo a cotizar, incluyendo:",
    "*Marca, Modelo, Año, Si posee GNC, Localidad de residencia.*",
    "👉 *0* - Cancelar.",
  ])
  .addAnswer(
    "*IMPORTANTE:* Por favor, adjunte todos los datos en un solo mensaje"
  )
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, globalState, flowDynamic }) => {
      const response = ctx.body;

      if (response === "0") {
        return gotoFlow(flowTipoCotizacionNoCliente);
      }

      if (response.length < 5) {
        return fallBack(
          "❌ Debe ingresar una localidad y descripción del bien. 0 para cancelar."
        );
      }

      globalState.update({ readyForBL: true });
      await flowDynamic("Datos de cotizacion procesados. (cod#1100)");
      return gotoFlow(blackListFlow);
    }
  );

export const flowCotizacionOtrosRiesgosNoCliente = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Por favor, realice una breve descripción del bien o tipo de riesgo que desea consultar/cotizar, y su localidad.",
    "👉 *0* - Cancelar.",
  ])
  .addAnswer(
    "*IMPORTANTE:* Por favor, adjunte todos los datos en un solo mensaje."
  )
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, globalState, flowDynamic }) => {
      const response = ctx.body;

      if (response === "0") {
        return gotoFlow(flowTipoCotizacionNoCliente);
      }

      if (response.length < 5) {
        return fallBack(
          "❌ Debe ingresar una localidad y descripción del bien. 0 para cancelar."
        );
      }

      globalState.update({ readyForBL: true });
      await flowDynamic("Datos de cotizacion procesados. (cod#1101)");
      return gotoFlow(blackListFlow);
    }
  );
