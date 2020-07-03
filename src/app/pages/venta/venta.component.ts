import { VentaService } from './../../service/venta.service';
import { Venta } from './../../model/venta';
import { DetalleVenta } from './../../model/detalleVenta';
import { ProductoService } from './../../service/producto.service';
import { Producto } from './../../model/producto';
import { PersonaService } from './../../service/persona.service';
import { Persona } from './../../model/persona';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  personas$: Observable<Persona[]>;
  productos$: Observable<Producto[]>;
  idPersonaSeleccionada: number;
  idProductoSeleccionado: number;
  maxFecha: Date = new Date();
  fechaSeleccionada: Date;
  importe: number;
  cantidad: number;
  detalleVenta: DetalleVenta[] = [];

  constructor(
    private personaService: PersonaService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.listarPersonas();
    this.listarProductos();
  }

  listarPersonas() {
    this.personas$ = this.personaService.listar();
  }
  
  listarProductos() {
    this.productos$ = this.productoService.listar();
  }

  agregar() {
    if (this.idProductoSeleccionado && this.cantidad) {

      let cont = 0;
      for (let i = 0; i < this.detalleVenta.length; i++) {
        let detVenta = this.detalleVenta[i];
        if (detVenta.producto.idProducto === this.idProductoSeleccionado) {
          cont ++;
          break;
        }
      }

      if (cont > 0) {
        this.snackBar.open('El producto se encuentra en la lista', 'Aviso', { duration: 2000 });
      } else {
        if (this.cantidad > 0) {
          let detalleVentaBean = new DetalleVenta();
          this.productoService.listaPorId(this.idProductoSeleccionado).subscribe(data => {
            detalleVentaBean.producto = data;
            detalleVentaBean.cantidad = this.cantidad;
            this.detalleVenta.push(detalleVentaBean);
      
            this.idProductoSeleccionado = null;
            this.cantidad = null;
          });
        } else {
          this.snackBar.open('La cantidad no puede ser de 0', 'Aviso', { duration: 2000 });
        }
      } 
    } else {
      this.snackBar.open('Llenar los campos producto y cantidad', 'Aviso', { duration: 2000 });
    }
  }

  removerDiagnostico(index: number) {
    this.detalleVenta.splice(index, 1);
  }

  estadoBotonRegistrar() {
    return (this.detalleVenta.length === 0 || !this.idPersonaSeleccionada || !this.importe || this.importe == 0 || !this.fechaSeleccionada);
  }
  
  aceptar() {
    let venta = new Venta();
    let persona = new Persona();
    persona.idPersona = this.idPersonaSeleccionada;

    venta.persona = persona;
    venta.importe = this.importe;
    venta.detalleVenta = this.detalleVenta;
    venta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');

    this.ventaService.registrarTransaccion(venta).subscribe(() => {
      this.snackBar.open('Se registró la venta', 'Aviso', { duration: 2000 });
      setTimeout(() => {
        this.limpiarCampos();
      })
    });
  }

  limpiarCampos() {
    this.detalleVenta = [];
    this.idPersonaSeleccionada = null;
    this.idProductoSeleccionado = null;
    this.fechaSeleccionada = null;
    this.importe = null;
    this.cantidad = null;
  }

}
