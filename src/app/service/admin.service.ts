import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

const URL = environment.apiUrl;
type AdminStatus = 'active' | 'inactive';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getAllTerminals() {
    return this.http.get<any[]>(`${URL}/terminal`);
  }

  updateTerminal(
    id: number,
    terminalName: string,
    status: AdminStatus,
    remarks: string
  ) {
    const data = {
      terminalName,
      status,
      remarks,
    };

    return this.http.patch<any>(`${URL}/terminal/${id}`, data);
  }

  deleteTerminals(ids: number[]) {
    const options = {
      body: { ids: ids }, // or simply { ids } in ES6 shorthand
      headers: { 'Content-Type': 'application/json' },
    };
    return this.http.delete<any>(`${URL}/terminal`, options);
  }

  createTerminal(
    terminalName?: string,
    status?: AdminStatus,
    remarks?: string
  ) {
    const data = {
      terminalName,
      status,
      remarks,
    };

    return this.http.post<any>(`${URL}/terminal`, data);
  }
}
