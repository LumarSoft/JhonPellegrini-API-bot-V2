import { flowCotizacionCliente } from "./clientes/flowCotizacion";
import { flowConsulta } from "./flowBienvenida";
import { flowGrua } from "./clientes/flowGrua";
import { flowSiniestro } from "./clientes/flowSiniestro";
import { flowDocumentacion } from "./clientes/flowDocumentacion";
import { flowOtraConsulta } from "./clientes/flowOtraConsulta";
import { blackListFlow } from "./blacklistflow";
import { IDLETIME, reset, start } from "../idleCustom";
import { addKeyword, EVENTS } from "@builderbot/bot";

export const flowSiCliente = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "¡Gracias por comunicarte! ¿En que podemos asistirte?",
    "*RECORDATORIO*: Nuestro horario de atención es de Lunes a Viernes de 8 a 16hs.",
  ])
  .addAnswer([
    "👉 *1* - Solicitud de documentación.",
    "👉 *2* - Siniestros.",
    "👉 *3* - Servicio de grúa.",
    "👉 *4* - Solicitar cotización",
    "👉 *5* - Otra consulta.",
    "👉 *6* - Volver al menú principal.",
    "👉 *0* - Finalizar conversación.",
  ])
  .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, IDLETIME))
  .addAction({ capture: true }, async (ctx, { gotoFlow, fallBack }) => {
    const resp = ctx.body;
    switch (resp) {
      case "1":
        return gotoFlow(flowDocumentacion);
      case "2":
        return gotoFlow(flowSiniestro);
      case "3":
        return gotoFlow(flowGrua);
      case "4":
        return gotoFlow(flowCotizacionCliente);
      case "5":
        return gotoFlow(flowOtraConsulta);
      case "6":
        return gotoFlow(flowConsulta);
      case "0":
        return gotoFlow(blackListFlow);
      default:
        reset(ctx, gotoFlow, IDLETIME);
        return fallBack(
          "❌ Opción no válida, por favor seleccione una opción válida."
        );
    }
  });
