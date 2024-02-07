import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socketio2';
import { Observable, tap } from 'rxjs';

@Injectable()
export class WebSocketService {
  constructor(private socket: Socket) {}

  sendQueueRequest() {
    this.socket.emit('queue-request');
    console.log('hiiiiiiiiiiii');
  }

  getQueue() {
    return this.socket.on('updated-queue').pipe(
      tap((args) => {
        return args;
      })
    );
    // let observable = new Observable<any[]>((observer) => {
    //   this.socket.on('updated-queue', (data: any[]) => {
    //     observer.next(data);
    //   });
    //   return () => {
    //     this.socket.disconnect();
    //   };
    // });
    // return observable;
  }

  queueUpdateEvent() {
    return this.socket.on('new-queue-update').pipe(
      tap(() => {
        return;
      })
    );
  }
}
