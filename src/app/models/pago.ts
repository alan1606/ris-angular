import { FormaPago } from "./formaPago";

export class Pago {
  id: number;
  formaPago:FormaPago;
  cantidad:number;
  factura:boolean;
  ordenId:number;
  formaPagoId:number;
}
