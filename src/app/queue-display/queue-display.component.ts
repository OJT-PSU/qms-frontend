import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
import { WebSocketService } from '../socket/web-socket.service';
import moment from 'moment';
import _ from 'lodash';
import { Howl, Howler } from 'howler';
@Component({
  selector: 'app-queue-display',
  standalone: true,
  templateUrl: './queue-display.component.html',
  styleUrls: ['./queue-display.component.css'],
})
export class QueueDisplayComponent implements OnInit {
  data: any[] = [];
  display: any[] = [];

  alertNow: boolean = false;
  alertQueue: any = [];
  alertName: string = '';
  alertQueueId: string = '';

  fetchData: any[] = [];
  text: string = '';
  animation: string = '';
  videoUrl: string = '';
  hasWaiting: Boolean = false;
  month: string = '';
  day: string = '';
  year: string = '';

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

    this.websocketService.queuePingEvent().subscribe((response) => {
      this.alertName = '';
      this.alertQueueId = '';
      this.alertName = '';
      this.alertQueue = response;
      this.alertName = this.alertQueue.name;
      this.alertQueueId = this.alertQueue.QueueId;
      this.sound.play();
    });

    this.websocketService.getQueue().subscribe((response) => {
      this.hasWaiting = false;
      console.log(this.alertQueueId);
      console.log(this.alertName);

      this.data = response.sort((a, b) => {
        const dataDate = moment(a.createdAt, 'YYYY-MM-DD');
        const isSameDate = dataDate.isSame(dataDate);
        if (isSameDate) {
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
        }
      });
      this.refresh();
    });

    this.websocketService.queueUpdateEvent().subscribe(() => {
      this.websocketService.sendQueueRequest();
    });
    setInterval(() => {
      this.amPm = moment().format('A');
      this.getHour = moment().format('h');
      this.getMins = moment().format('mm');
    }, 1000);
    this.month = moment().format('MMMM');
    this.day = moment().format('DD');
    this.year = moment().format('YYYY');
  }

  refresh(): void {
    this.alertName = '';
    this.alertQueueId = '';
    let hasAlreadyPlayed = false;
    this.hasWaiting = false;
    setInterval(() => {
      const parentDiv = document.querySelector('.parentAlert');
      if (parentDiv) {
        const elementsToRemove = parentDiv.querySelectorAll('.alert');
        elementsToRemove.forEach((element) =>
          element.classList.remove('alert')
        );
      }
      this.alertName = '';
    }, 5000);
    this.data.forEach((item) => {
      if (item.queueStatus == 'ongoing' && !hasAlreadyPlayed) {
        this.sound.play();
        hasAlreadyPlayed = true;
      }
    });
    this.display = _.slice(this.data, 0, 7);
    console.log('EXECUTED from oninit ');
  }
  getData(): void {
    this.queueService.getQueueCustomer().subscribe(
      (response) => {
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
        this.refresh();
        console.log(this.data);
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
