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
  async createQueueCustomer(
    name: string,
    email: string = '',
    contactNumber: string = ''
  ) {
    return await this.http.post<HttpResponse<QueueCustomer>>(
      'http://localhost:3000/queue',
      {
        name,
        email,
        contactNumber,
      }
    );
  }

  getQueueCustomer(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/queue');
  }

  getConfig(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/display');
  }

  getTerminalList(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/terminal');
  }
}
