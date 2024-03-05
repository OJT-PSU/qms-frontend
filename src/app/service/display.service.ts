import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class DisplayService {
  constructor(private http: HttpClient) {}

  getConfig(): Observable<any[]> {
    return this.http.get<any[]>(`${URL}/display`);
  }

  checkThemeActive(): Observable<any> {
    return this.http.get<any>(`${URL}/display/theme`);
  }

  updateThemeType(themeType: number, displayId: number = 1): Observable<any> {
    return this.http.patch<any>(`${URL}/display/theme`, {
      displayId,
      themeType,
    });
  }
}
