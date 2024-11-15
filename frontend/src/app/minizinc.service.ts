import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MinizincService {
  ///private apiUrl = 'http://localhost:80/api/minPol';
  private apiUrl = 'https://minpoluv-ahdddchnhqdqgaa2.centralus-01.azurewebsites.net/api/minPol/';
  constructor(private http: HttpClient) { }
 
  ejecutarMinizinc(data: any): Observable<{
    polarizacion_inicial: number, 
    polarizacion_final: number, 
    movimientos_totales: number, 
    costo_total: number,  
    distribucion_final: number[],
    movimientos_realizados: any[]
  }> {
    return this.http.post<{
      polarizacion_inicial: number, 
      polarizacion_final: number, 
      movimientos_totales: number, 
      costo_total: number, 
      distribucion_final: number[],
      movimientos_realizados: any[]
    }>(this.apiUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 408) {
      return throwError('El servidor tardó demasiado en responder. Inténtalo de nuevo más tarde.');
    }
    return throwError('Ocurrió un error al procesar la solicitud.');
  }
}
