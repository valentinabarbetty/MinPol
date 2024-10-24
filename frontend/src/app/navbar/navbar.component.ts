import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
 imports: [MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  tooltipContent: string = "Integrantes: Brayan Gomez Muñoz    Valentina Barbetty Arango   Jheison Estiben Gomez Muñoz";
}
