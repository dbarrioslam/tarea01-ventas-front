import { GenericService } from './generic.service';
import { Producto } from './../model/producto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto> {

  private productoCambio = new Subject<Producto[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/productos`);
  }

  getProductoCambio() {
    return this.productoCambio.asObservable();
  }

  setProductoCambio(productos: Producto[]) {
    this.productoCambio.next(productos);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
