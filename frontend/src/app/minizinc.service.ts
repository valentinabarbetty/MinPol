// src/app/minizinc.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MinizincService {
  private apiUrl = 'http://localhost:3000/api/suma';

  constructor(private http: HttpClient) { }

  sumar(x: number, y: number): Observable<{ resultado: string }> { // Cambia el tipo aquí
    return this.http.post<{ resultado: string }>(this.apiUrl, { x, y }); // Asegúrate de que envías { x, y }
  }
}
