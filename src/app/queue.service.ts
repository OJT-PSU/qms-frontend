import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueueCustomer } from './interfaces/queueCustomer';
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
    return await this.http.post<HttpResponse<QueueCustomer>>(
      'http://192.168.50.162:3000/queue',
      {
        name,
        email,
        contactNumber,
      }
    );
  }

  getQueueCustomer(): Observable<any[]> {
    return this.http.get<any[]>('http://192.168.50.162:3000/queue');
  }

  getConfig(): Observable<any[]> {
    return this.http.get<any[]>('http://192.168.50.162:3000/display');
  }
}
