import { Descuento } from './descuento';
import { Generic } from './generic';
import { Medico } from './medico';
import { Paciente } from './paciente';
import { Pago } from './pago';
import { VentaConceptos } from './venta-conceptos';

export class OrdenVenta implements Generic {
  id: number;
  totalSinDescuento: number;
  totalDespuesDescuento: number;
  paciente: Paciente;
  fechaVenta: string;
  medicoReferente: Medico;
  motivo: string;
  requiereFactura: boolean;
  pagado: boolean;
  aplicarDescuento: boolean;
  codigoPromocional: string;
  estudios: string;
  usuarioAgendo: string;
  folioInstitucion: string;
  pagos: Pago[];
  descuentos?: Descuento[];
  estudiosList?: VentaConceptos[];
}
