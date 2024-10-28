import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MinizincService {
  private apiUrl = 'http://localhost:3000/api/minPol';

  constructor(private http: HttpClient) { }

  ejecutarMinizinc(data: any): Observable<{ resultado: string }> {
    return this.http.post<{ resultado: string }>(this.apiUrl, data);
  }
}
