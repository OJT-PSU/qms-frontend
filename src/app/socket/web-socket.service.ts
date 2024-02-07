import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private socket: Socket) {}

  sendQueueRequest() {
    this.socket.emit('queue-request');
    console.log('hiiiiiiiiiiii');
  }

  getQueue() {
    let observable = new Observable<any[]>((observer) => {
      this.socket.on('updated-queue', (data: any[]) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  queueUpdateEvent() {
    let observable = new Observable<any[]>((observer) => {
      this.socket.on('new-queue-update', () => {
        observer.next();
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}
