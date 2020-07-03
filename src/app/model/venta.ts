import { DetalleVenta } from './detalleVenta';
import { Persona } from './persona';
export class Venta {
    idVenta: number;
	fecha: string;
	persona: Persona;
	importe: number;
	detalleVenta: DetalleVenta[];
}