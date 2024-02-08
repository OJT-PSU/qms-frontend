import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueueCustomer, TransactionType } from './interfaces/queueCustomer';

import { environment } from '../environments/environment.development';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  constructor(private http: HttpClient) {}
  async createQueueCustomer(
    name: string,
    email?: string | null,
    contactNumber?: string | null,
    transactionType?: TransactionType | null
  ) {
    return await this.http.post<HttpResponse<QueueCustomer>>(`${URL}/queue`, {
      name,
      email,
      contactNumber,
      transactionType,
    });
  }

  getQueueCustomer(): Observable<any[]> {
    return this.http.get<any[]>(`${URL}/queue`);
  }

  getConfig(): Observable<any[]> {
    return this.http.get<any[]>(`${URL}/display`);
  }

  getTerminalList(): Observable<any[]> {
    return this.http.get<any[]>(`${URL}/terminal`);
  }
}
