import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
import { WebSocketService } from '../socket/web-socket.service';
import moment from 'moment';
import _ from 'lodash';
import { Howl, Howler } from 'howler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-queue-display',
  standalone: true,
  templateUrl: './theme-0.component.html',
  styleUrls: ['./theme-0.component.css'],
})
export class Theme0Component implements OnInit {
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
    private websocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getConfig();
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.volume = 0;
    }

    this.websocketService.themeUpdateEvent().subscribe(() => {
      this.queueService.checkThemeActive().subscribe({
        next: (response) => {
          const { themeType } = response;
          console.log({ themeType });
          this.router.navigate([`/theme/`, `${themeType}`]);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });

    this.websocketService.queuePingEvent().subscribe((response) => {
      this.alertName = '';
      this.alertQueueId = '';
      this.alertName = '';
      this.alertQueue = response;
      this.alertName = this.alertQueue.name;
      this.alertQueueId = this.alertQueue.queueId;
      const alertNow = this.alertName + '' + this.alertQueueId;
      const putAlert = document.querySelector(`.${alertNow}`);
      putAlert?.classList.add('alert');
      this.sound.play();
    });

    this.websocketService.getQueue().subscribe((response) => {
      this.hasWaiting = false;
      console.log(this.alertQueueId);
      console.log(this.alertName);

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

    const currentDate = moment();
    this.data = _.filter(this.data, (o) => {
      const dateItem = moment(o.createdAt);
      return (
        currentDate.isSame(dateItem, 'day') &&
        currentDate.isSame(dateItem, 'month') &&
        currentDate.isSame(dateItem, 'year')
      );
    });

    const filter = _.filter(this.data, (item) => {
      return item.queueStatus === 'waiting' || item.queueStatus === 'ongoing';
    });
    this.display = _.slice(filter, 0, 7);
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
