// minizinc.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MinizincService {
  private apiUrl = 'http://localhost:3000/api/minPol';

  constructor(private http: HttpClient) { }

  ejecutarMinizinc(data: any): Observable<{ polarizacion: number, movimientos: number[][] }> {
    return this.http.post<{ polarizacion: number, movimientos: number[][] }>(this.apiUrl, data);
  }
}
