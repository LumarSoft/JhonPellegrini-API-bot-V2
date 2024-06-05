import { flowConsulta, flowContactoPendiente } from "./flowBienvenida";
import { blackListFlow } from "./blacklistflow";
import { flowOtraConsulta } from "./clientes/flowOtraConsulta";
import { addKeyword, EVENTS } from "@builderbot/bot";

export const flowTipoCotizacionNoCliente = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Por favor, seleccione que tipo de cotización desea realizar.",
    "👉 *1* - Vehículos.",
    "👉 *2* - Otros bienes o riesgos.",
    "👉 *0* - Cancelar.",
  ])
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, endFlow }) => {
      const option = ctx.body;
      switch (option) {
        case "1":
          return gotoFlow(flowCotizacionVehiculosNoCliente);
        case "2":
          return gotoFlow(flowCotizacionNoCliente);
        case "0":
          return endFlow("¡Nos vemos luego!");
        default:
          return fallBack(
            "❌ Opción no válida, por favor seleccione una opción válida."
          );
      }
    }
  );

export const flowCotizacionVehiculosNoCliente = addKeyword(EVENTS.ACTION)
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
        return gotoFlow(flowNoCliente);
      }
      if (response.length > 5) {
        globalState.update({ readyForBL: true });
        await flowDynamic(
          "Datos de cotización procesados. (cod#1100)"
        );
        return gotoFlow(blackListFlow);
      }
      return fallBack(
        "❌ Debe ingresar una localidad y descripción del bien. 0 para cancelar."
      );
    }
  );

export const flowCotizacionNoCliente = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Por favor, realice una breve descripción del bien o tipo de riesgo que desea consultar/cotizar, y su localidad.",
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
        return gotoFlow(flowNoCliente);
      }
      if (response.length > 5) {
        globalState.update({ readyForBL: true });
        await flowDynamic(
          "Datos de cotización procesados. (cod#1100)"
        );
        return gotoFlow(blackListFlow);
      }
      return fallBack(
        "❌ Debe ingresar una localidad y descripción del bien. 0 para cancelar."
      );
    }
  );

export const flowNoCliente = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "GRACIAS POR COMUNICARTE! Nos alegra poder ayudarte con nuestros servicios.",
    "*RECORDATORIO*: Nuestro horario de atención es de Lunes a Viernes de 8 a 16hs.",
  ])
  .addAnswer([
    "¿En que podemos asistirte?",
    "👉 *1* - Solicitar una cotización.",
    "👉 *2* - Solicitar que lo contacte un representante de ventas.",
    "👉 *3* - Otras consultas.",
    "👉 *0* - Finalizar conversación.",
  ])
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, endFlow }) => {
      const option = ctx.body;
      switch (option) {
        case "1":
          return gotoFlow(flowTipoCotizacionNoCliente);
        case "2":
          return gotoFlow(flowContactoPendiente);
        case "3":
          return gotoFlow(flowOtraConsulta);
        case "0":
          return endFlow("¡Nos vemos luego!");
        default:
          return fallBack(
            "❌ Opción no válida, por favor seleccione una opción válida."
          );
      }
    }
  );
