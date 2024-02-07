import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueueCustomer } from './interfaces/queueCustomer';

import { environment } from '../environments/environment.development';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  constructor(private http: HttpClient) {}
  private configUrl = '../assets/Config.ini';
  async createQueueCustomer(
    name: string,
    email: string = '',
    contactNumber: string = ''
  ) {
    return await this.http.post<HttpResponse<QueueCustomer>>(`${URL}/queue`, {
      name,
      email,
      contactNumber,
    });
  }

  getQueueCustomer(): Observable<any[]> {
    return this.http.get<any[]>(`${URL}/queue`);
  }

  getConfig(): Observable<any[]> {
    return this.http.get<any[]>(`${URL}/display`);
  }
}
