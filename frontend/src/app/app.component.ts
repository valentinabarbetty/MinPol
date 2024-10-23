// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { MinizincService } from './minizinc.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'min-pol';
  num1: number = 0;
  num2: number = 0;
  resultado: string | null = null; // Cambia el tipo aquí

  constructor(private minizincService: MinizincService) {}

  calcularSuma() {
    this.minizincService.sumar(this.num1, this.num2).subscribe({
      next: (res) => this.resultado = res.resultado, // Accede a la propiedad resultado
      error: (err) => console.error('Error en la solicitud:', err)
    });
  }
}
