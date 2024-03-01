import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
import { WebSocketService } from '../socket/web-socket.service';
import moment from 'moment';
import _ from 'lodash';
import { Howl, Howler } from 'howler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theme-2',
  standalone: true,
  imports: [],
  templateUrl: './theme-2.component.html',
  styleUrl: './theme-2.component.css',
})
export class Theme2Component implements OnInit {
  data: any[] = [];
  payment: any[] = [];
  checkReleasing: any[] = [];
  inquiry: any[] = [];

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
  last_id: any = null;

  constructor(
    private queueService: QueueService,
    private websocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getConfig();

    this.websocketService.themeUpdateEvent().subscribe((config: any) => {
      const { themeType } = config;
      this.router.navigate([`/theme/`, `${themeType}`]);
      console.log(themeType);
    });

    this.websocketService.queuePingEvent().subscribe((response: any) => {
      this.sound.play();
      const elementToAlert = document.getElementById(response.queueId);
      elementToAlert?.classList.add('alert');
      elementToAlert?.classList.remove('notAlert');

      if (this.last_id !== null) {
        clearTimeout(this.last_id);
      }

      this.last_id = setTimeout(() => {
        elementToAlert?.classList.add('notAlert');
        elementToAlert?.classList.remove('alert');
      }, 5000);
    });

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
      this.refresh();
    });

    this.websocketService.queueUpdateEvent().subscribe((response) => {
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
    const currentDate = moment();
    this.data = _.filter(this.data, (o) => {
      const dateItem = moment(o.createdAt);
      return (
        currentDate.isSame(dateItem, 'day') &&
        currentDate.isSame(dateItem, 'month') &&
        currentDate.isSame(dateItem, 'year') &&
        o.toDisplay == 0
      );
    });
    this.payment = _.filter(this.data, (o) => {
      return o.queueStatus != 'accommodated' && o.transactionType == 'payment';
    });
    this.payment = _.slice(this.payment, 0, 7);
    this.checkReleasing = _.filter(this.data, (o) => {
      return (
        o.queueStatus != 'accommodated' && o.transactionType == 'checkReleasing'
      );
    });
    this.checkReleasing = _.slice(this.checkReleasing, 0, 7);

    this.inquiry = _.filter(this.data, (o) => {
      return o.queueStatus != 'accommodated' && o.transactionType == 'inquiry';
    });
    this.inquiry = _.slice(this.inquiry, 0, 7);
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
