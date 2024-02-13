import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { TransactionType } from '../interfaces/queueCustomer';

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
    remarks: string,
    transactionType: TransactionType
  ) {
    const data = {
      terminalName,
      status,
      remarks,
      transactionType,
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
    remarks?: string,
    transactionType?: TransactionType
  ) {
    const data = {
      terminalName,
      status,
      remarks,
      transactionType,
    };

    return this.http.post<any>(`${URL}/terminal`, data);
  }
}
