import { PersonaDialogoComponent } from './persona-dialogo/persona-dialogo.component';
import { Persona } from './../../model/persona';
import { PersonaService } from './../../service/persona.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  dataSource: MatTableDataSource<Persona>
  displayedColumns: string[] = ['idPersona', 'nombres', 'apellidos', 'acciones'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private personaService: PersonaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {

    this.personaService.getPersonaCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.personaService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      })
    })

    this.personaService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  abrirDialogo(persona?: Persona) {
    this.dialog.open(PersonaDialogoComponent, {
      width: '250px',
      data: persona != null ? persona : new Persona()
    });
  }

  eliminar(persona: Persona) {
    this.personaService.eliminar(persona.idPersona).pipe(switchMap( () => {
      return this.personaService.listar();
    })).subscribe(data => {
      this.personaService.setPersonaCambio(data);
      this.personaService.setMensajeCambio('SE ELIMINO');
    });
  }

}
