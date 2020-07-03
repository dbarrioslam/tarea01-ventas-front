import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Venta } from './../model/venta';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService extends GenericService<Venta> {

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/ventas`);
  }

  registrarTransaccion(venta: Venta) {
    return this.http.post(this.url, venta);
  }
}
