import { PersonaService } from './../../../service/persona.service';
import { Persona } from './../../../model/persona';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-persona-dialogo',
  templateUrl: './persona-dialogo.component.html',
  styleUrls: ['./persona-dialogo.component.css']
})
export class PersonaDialogoComponent implements OnInit {

  persona: Persona;

  constructor(
    private dialogRef: MatDialogRef<PersonaDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Persona,
    private personaService: PersonaService
  ) { }

  ngOnInit(): void {
    this.persona = new Persona();
    this.persona.idPersona = this.data.idPersona;
    this.persona.nombres = this.data.nombres;
    this.persona.apellidos = this.data.apellidos;
  }

  operar() {
    if (this.persona.idPersona) {
      this.personaService.modificar(this.persona).pipe(switchMap( () => {
        return this.personaService.listar();
      })).subscribe(data => {
        this.personaService.setPersonaCambio(data);
        this.personaService.setMensajeCambio('SE MODIFICO');
      });
    } else {
      this.personaService.registrar(this.persona).pipe(switchMap( () => {
        return this.personaService.listar();
      })).subscribe(data => {
        this.personaService.setPersonaCambio(data);
        this.personaService.setMensajeCambio('SE REGISTRO');
      });
    }
    this.cancelar();
  }

  cancelar() {
    this.dialogRef.close();
  }

}
