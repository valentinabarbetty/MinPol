import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MinizincService } from './minizinc.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    CommonModule 
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'min-pol';
  selectedFile: File | null = null;
  parsedData: any = {}; 
  errorMessage: string = ''; 
  resultadoMinizinc: string | null = null;

  polarizacion_inicial: number | null = null; 
  polarizacion_final: number | null = null;
  movimientos_totales: number | null = null;
  distribucion_final: number[] | null = null;
  costo_total: number | null = null;
  constructor(private minizincService: MinizincService) { }

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string).split('\n');
        this.parseFileContent(content);
      };
      reader.readAsText(file);
    }
  }


  parseFileContent(content: string[]) {
    try {
      this.parsedData.numPersonas = parseInt(content[0]);
      this.parsedData.numOpiniones = parseInt(content[1]);
      this.parsedData.distribucionOpiniones = content[2].split(',').map(Number);
      this.parsedData.valoresOpiniones = content[3].split(',').map(Number);
      this.parsedData.costosExtras = content[4].split(',').map(Number);
      this.parsedData.costosDesplazamiento = [];
      for (let i = 0; i < this.parsedData.numOpiniones; i++) {
        this.parsedData.costosDesplazamiento.push(
          content[5 + i].split(',').map(Number)
        );
      }
      this.parsedData.costoTotalMax = parseFloat(content[5 + this.parsedData.numOpiniones]);
      this.parsedData.maxMovimientos = parseInt(content[6 + this.parsedData.numOpiniones]);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Error al procesar el archivo. Verifica el formato.';
    }
  }
  
  ejecutarMinizinc() {
    this.minizincService.ejecutarMinizinc(this.parsedData).subscribe({
      next: (response) => {
        console.log('Respuesta de MiniZinc:', response);
        // Asignar los datos recibidos desde el backend
        this.polarizacion_inicial = response.polarizacion_inicial;
        this.polarizacion_final = response.polarizacion_final;
        this.movimientos_totales = response.movimientos_totales;
        this.costo_total = response.costo_total;
        this.distribucion_final = response.distribucion_final;
      },
      error: (err) => {
        console.error('Error al ejecutar MiniZinc:', err);
      }
    });
  }
}




