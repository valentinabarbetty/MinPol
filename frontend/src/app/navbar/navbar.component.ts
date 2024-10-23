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
  tooltipContent: string = "Integrantes:<br> Brayan Gomez Muñoz<br>    Valentina Barbetty Arango<br>    Jheison Estiben Gomez Muñoz";
    
  

}
