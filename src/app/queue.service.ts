import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

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
    const response = await this.http
      .post('http://localhost:3000/queue', {
        name,
        email,
        contactNumber,
      })
      .subscribe((config) => {
        console.log(config);
      });
    console.log(name, email, contactNumber);
    console.log({ response });
  }
}
