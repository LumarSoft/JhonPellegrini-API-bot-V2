import { flowNoCliente } from "./flowNoCliente";
import { flowSiCliente } from "./flowCliente";
import { blackListFlow } from "./blacklistflow";
import { addKeyword, EVENTS } from "@builderbot/bot";

export const flowContactoPendiente = addKeyword(EVENTS.ACTION).addAnswer([
  "Un representante se comunicará con usted a la brevedad. (cod#1600)",
  "¿Desea realizar otra consulta?",
  "👉 *1* - Volver al menu.",
  "👉 *0* - Finalizar conversación.",
])
.addAction(
  { capture: true },
  async (ctx, { gotoFlow, fallBack, endFlow }) => {
    const option = ctx.body;
    switch (option) {
      case "1":
        return gotoFlow(flowNoCliente);
      case "0":
        // globalState.update({ readyForBL: true }); --necesario?
        return gotoFlow(blackListFlow);
      default:
        return fallBack(
          "❌ Opción no válida, por favor seleccione una opción válida."
        );
    }
  }
);

export const flowConsulta = addKeyword(EVENTS.ACTION)
  .addAnswer("¡Hola! Bienvenido a *John Pellegrini Management group SRL*.")
  .addAnswer("Seleccione una de las siguientes opciones *ESCRIBIENDO EL NÚMERO* correspondiente.")
  .addAnswer([
    "Para brindarte una mejor asistencia, necesitamos saber si eres cliente o no.",
    "👉 *1* - Si, soy cliente.",
    "👉 *2* - No, no soy cliente.",
    "👉 *0* - Finalizar conversación.",
  ])
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, fallBack, endFlow }) => {
      const message = ctx.body;
      if (message === "0") {
        return endFlow("¡Nos vemos luego!");
      } else if (message === "1") {
        return gotoFlow(flowSiCliente);
      } else if (message === "2") {
        return gotoFlow(flowNoCliente);
      }
      return fallBack(
        "❌ Opción no válida, por favor selecciona una opción válida."
      );
    }
  );

export const flowRechazoRapipago = addKeyword(EVENTS.ACTION).addAnswer([
  "Usted ha seleccionado la opción cupón de pago de rapipago.",
  "Dentro de las 24hs te estaremos enviando el cupon de pago. (cod#1000)",
]);

export const flowRechazoCreditoDebito = addKeyword(EVENTS.ACTION).addAnswer([
  "Usted ha seleccionado la opción de pago con tarjeta de crédito o débito.",
  "Dentro de las 24hs nos estaremos contactando para tomar el pago.",
  "O comunicate telefónicamente de lunes a viernes de 8 a 16hs. (cod#1001)",
]);

export const flowRechazoTransferencia = addKeyword(EVENTS.ACTION).addAnswer([
  "Usted ha seleccionado la opción de pago por transferencia bancaria.",
  "Realizar transferencia al CBU 0070081820000004432793 -   ALIAS:  TRUENO.VUELO.DELTA    -   CUENTA CORRIENTE EN PESOS: 4432-7 081-9         TRIUNFO COOP. DE SEGUROS LTDA.  CUIT  30-50006577-6 ",
  "Una vez realizado, por favor enviar el COMPROBANTE por este medio (cod#1002)",
]);

export const flowBienvenida = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { gotoFlow, globalState }) => {
    globalState.update({ readyForBL: false });

    const message = ctx.body;

    if (message.toLowerCase() === "ef") {
      return gotoFlow(flowRechazoRapipago);
    }
    if (message.toLowerCase() === "tc") {
      return gotoFlow(flowRechazoCreditoDebito);
    }
    if (message.toLocaleLowerCase() === "tr") {
      return gotoFlow(flowRechazoTransferencia);
    }
    return gotoFlow(flowConsulta);
  }
);
