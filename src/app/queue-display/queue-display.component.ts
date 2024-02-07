import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
import { WebSocketService } from '../socket/web-socket.service';
import moment from 'moment';
// import { Howl, Howler } from 'howler';
@Component({
  selector: 'app-queue-display',
  standalone: true,
  templateUrl: './queue-display.component.html',
  styleUrls: ['./queue-display.component.css'],
})
export class QueueDisplayComponent implements OnInit {
  data: any[] = [];
  fetchData: any[] = [];
  text: string = '';
  animation: string = '';
  stringDate: string = moment().format('LT');
  // sound = new Howl({
  //   src: ['../../assets/sound.mp3'],
  //   html5: true,
  // });
  constructor(
    private queueService: QueueService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getConfig();
    // this.sound.play();
    this.websocketService.getQueue().subscribe((response) => {
      this.data = response.sort((a, b) => {
        if (a.queueStatus !== b.queueStatus) {
          return a.queueStatus.localeCompare(b.queueStatus);
        } else {
          return a.queueId - b.queueId;
        }
      });
    });

    this.websocketService.queueUpdateEvent().subscribe(() => {
      this.websocketService.sendQueueRequest();
    });
    console.log(moment().format('LT'));
    setInterval(() => {
      const currentTime = moment().format('LT');
      this.stringDate = currentTime;
    }, 1000);
  }

  getData(): void {
    this.queueService.getQueueCustomer().subscribe(
      (response) => {
        this.data = response.sort((a, b) => {
          if (a.queueStatus !== b.queueStatus) {
            return a.queueStatus.localeCompare(b.queueStatus);
          } else {
            return a.queueId - b.queueId;
          }
        });
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getConfig(): void {
    this.queueService.getConfig().subscribe(
      (response) => {
        console.log(response);
        const { dispMsg, scrollTime } = response[0];
        // this.animation = `scroll-left ${scrollTime} ease-in-out infinite`;
        this.animation = scrollTime;
        this.text = dispMsg;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
