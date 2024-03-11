import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  QueueCustomer,
  TransactionType,
  PriorityType,
} from './interfaces/queueCustomer';

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
    transactionType?: TransactionType | null,
    priorityType: PriorityType | null = 'normal'
  ) {
    const data = {
      name,
      email,
      contactNumber,
      transactionType,
      priorityType,
    };
    return await this.http.post<HttpResponse<QueueCustomer>>(
      `${URL}/queue`,
      data
    );
  }

  getQueueCustomer(): Observable<any[]> {
    return this.http.get<any[]>(`${URL}/queue`);
  }

  updateToDisplayList(): Observable<any[]> {
    return this.http.patch<any>(`${URL}/queue/reset-queue`, {});
  }
}
