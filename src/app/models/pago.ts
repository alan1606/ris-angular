import { FormaPago } from "./formaPago";

export class Pago {
  id: number;
  formaPago:FormaPago;
  total:number;
  factura:boolean;
  ordenId?:number;
  formaPagoId:number;
}
