import { AfterViewChecked, Component } from '@angular/core';
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
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { NgApexchartsModule } from "ng-apexcharts";
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
    CommonModule,
    BaseChartDirective,
    NgApexchartsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
  constructor(private minizincService: MinizincService) {}


  public p = [];
  public m = 0;


  triggerFileInput() {
    document.getElementById('fileInput')?.click();
    // this.updateChartData();
  }
  onTabChange(event: any) {
    if (event.index === 0) { // La pestaña 0 es "Datos Cargados"
     // this.updateChartData();
    }
  }
  public chartOptions: any;
  updateChartData() {
    this.chartOptions = {
      chart: {
        type: 'bar', // Tipo de gráfico
        height: 500, // Altura del gráfico más grande
        width: 500, // Ajusta el gráfico al ancho completo
      },
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: 'flat',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: Array.from(
          { length: this.m },
          (_, index) => `Opinión ${index + 1}`
        ), // Etiquetas basadas en 'm'
        title: {
          text: 'Opiniones', // Nombre del eje X
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Arial',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Valor', // Nombre del eje Y
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Arial',
          },
        },
      },
      series: [
        {
          name: 'Distribución de Opiniones',
          data: this.p, // Datos basados en 'p'
        },
      ],
      colors: ['#98bdea'], // Color personalizado para las barras
    };
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
      this.p = this.parsedData.distribucionOpiniones;
      this.m = this.parsedData.numOpiniones;
      this.parsedData.valoresOpiniones = content[3].split(',').map(Number);
      this.parsedData.costosExtras = content[4].split(',').map(Number);
      this.parsedData.costosDesplazamiento = [];
      
      for (let i = 0; i < this.parsedData.numOpiniones; i++) {
        this.parsedData.costosDesplazamiento.push(
          content[5 + i].split(',').map(Number)
        );
      }
      this.parsedData.costoTotalMax = parseFloat(
        content[5 + this.parsedData.numOpiniones]
      );
      this.parsedData.maxMovimientos = parseInt(
        content[6 + this.parsedData.numOpiniones]
      );
      this.updateChartData();
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Error al procesar el archivo. Verifica el formato.';
    }
  }

  ejecutarMinizinc() {
    this.minizincService.ejecutarMinizinc(this.parsedData).subscribe({
      next: (response) => {
        console.log('Respuesta de MiniZinc:', response);
        this.polarizacion_inicial = response.polarizacion_inicial;
        this.polarizacion_final = response.polarizacion_final;
        this.movimientos_totales = response.movimientos_totales;
        this.costo_total = response.costo_total;
        this.distribucion_final = response.distribucion_final;
        console.log('Distribución Final:', this.distribucion_final); // Verifica los datos
      },
      error: (err) => {
        console.error('Error al ejecutar MiniZinc:', err);
      },
    });
  }
}
