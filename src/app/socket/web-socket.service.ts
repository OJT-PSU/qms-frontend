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
      this.socket.on('new-queue-update', (response: any) => {
        observer.next(response);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  themeUpdateEvent() {
    let observable = new Observable<any[]>((observer) => {
      this.socket.on('new-theme-update', (response: any) => {
        observer.next(response);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  queuePingEvent() {
    let observable = new Observable<any[]>((observer) => {
      this.socket.on('ping-event', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}
