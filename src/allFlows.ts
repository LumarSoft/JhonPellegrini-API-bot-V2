import { blackListFlow } from "./flows/blacklistflow";
import {
  continuacionCotizacion,
  flowCotizacionCliente,
  flowCotizarAp,
  flowCotizarAutomotor,
  flowCotizarComercio,
  flowCotizarHogar,
  flowCotizarOtrosRiesgos,
} from "./flows/clientes/flowCotizacion";
import {
  flowConfirmacionCuponera,
  flowConfirmacionPoliza,
  flowCuponera,
  flowDocumentacion,
  flowPoliza,
} from "./flows/clientes/flowDocumentacion";
import { flowGrua } from "./flows/clientes/flowGrua";
import {
  FlowContinuar,
  flowOtraConsulta,
} from "./flows/clientes/flowOtraConsulta";
import {
  flowConsultaSiniestro,
  flowContinuacionSiniestro,
  flowDenunciaSiniestro,
  flowOtraConsultaSiniestro,
  flowSiniestro,
} from "./flows/clientes/flowSiniestro";
import {
  flowBienvenida,
  flowConsulta,
  flowRechazoCreditoDebito,
  flowRechazoRapipago,
  flowRechazoTransferencia,
} from "./flows/flowBienvenida";
import { flowSiCliente } from "./flows/flowCliente";
import {
  flowCotizacionOtrosRiesgosNoCliente,
  flowCotizacionVehiculoNoCliente,
  flowNoCliente,
  flowTipoCotizacionNoCliente,
} from "./flows/flowNoCliente";
import { inactivityFlow } from "./flows/inactivityFlow";
import { idleFlow } from "./idleCustom";

export const allFlows = [
  blackListFlow,
  flowBienvenida,
  flowRechazoRapipago,
  flowRechazoCreditoDebito,
  flowRechazoTransferencia,
  flowConsulta,
  flowNoCliente,
  flowTipoCotizacionNoCliente,
  flowCotizacionVehiculoNoCliente,
  flowCotizacionOtrosRiesgosNoCliente,
  flowSiCliente,
  flowDocumentacion,
  flowPoliza,
  flowCuponera,
  flowConfirmacionPoliza,
  flowConfirmacionCuponera,
  flowSiniestro,
  flowDenunciaSiniestro,
  flowConsultaSiniestro,
  flowOtraConsultaSiniestro,
  flowContinuacionSiniestro,
  flowGrua,
  flowCotizacionCliente,
  flowCotizarAutomotor,
  flowCotizarHogar,
  flowCotizarComercio,
  flowCotizarAp,
  flowCotizarOtrosRiesgos,
  continuacionCotizacion,
  flowOtraConsulta,
  FlowContinuar,
  idleFlow,
  inactivityFlow,
];
