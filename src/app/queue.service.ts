import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return await this.http.post<HttpResponse<any>>(
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
}
