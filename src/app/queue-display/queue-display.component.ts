import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
import { WebSocketService } from '../socket/web-socket.service';
import moment from 'moment';
import { Howl, Howler } from 'howler';
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
  videoUrl: string = '';
  hasWaiting: Boolean = false;

  amPm: string = moment().format('A');
  getHour: string = moment().format('HH');
  getMins: string = moment().format('mm');
  sound = new Howl({
    src: ['../../assets/sound.mp3'],
    html5: true,
  });
  constructor(
    private queueService: QueueService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getConfig();
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.volume = 0;
    }
    this.websocketService.getQueue().subscribe((response) => {
      let hasAlreadyPlayed = false;
      this.hasWaiting = false;

      this.data = response.sort((a, b) => {
        if (
          a.queueStatus == 'waiting' ||
          (a.queueStatus == 'ongoing' && a.toDisplay === 0)
        ) {
          this.hasWaiting = true;
        }
        if (a.queueStatus !== b.queueStatus) {
          return a.queueStatus.localeCompare(b.queueStatus);
        } else {
          return a.queueId - b.queueId;
        }
      });
      this.data.forEach((item) => {
        if (item.queueStatus == 'ongoing' && !hasAlreadyPlayed) {
          this.sound.play();
          hasAlreadyPlayed = true;
        }
      });
      console.log(this.hasWaiting);
    });

    this.websocketService.queueUpdateEvent().subscribe(() => {
      this.websocketService.sendQueueRequest();
    });
    setInterval(() => {
      this.amPm = moment().format('A');
      this.getHour = moment().format('h');
      this.getMins = moment().format('mm');
    }, 1000);
  }

  getData(): void {
    this.queueService.getQueueCustomer().subscribe(
      (response) => {
        let hasAlreadyPlayed = false;
        this.hasWaiting = false;

        this.data = response.sort((a, b) => {
          if (
            a.queueStatus == 'waiting' ||
            (a.queueStatus == 'ongoing' && a.toDisplay === 0)
          ) {
            this.hasWaiting = true;
          }
          if (a.queueStatus !== b.queueStatus) {
            return a.queueStatus.localeCompare(b.queueStatus);
          } else {
            return a.queueId - b.queueId;
          }
        });
        this.data.forEach((item) => {
          if (item.queueStatus == 'ongoing' && !hasAlreadyPlayed) {
            this.sound.play();
            hasAlreadyPlayed = true;
          }
        });
        console.log(this.hasWaiting);
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
        const { dispMsg, scrollTime, video } = response[0];
        this.videoUrl = '../../assets/' + video;
        this.animation = scrollTime;
        this.text = dispMsg;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
