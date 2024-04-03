import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
import { WebSocketService } from '../socket/web-socket.service';
import { DisplayService } from '../service/display.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import _ from 'lodash';
import { Howl, Howler } from 'howler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theme-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-1.component.html',
  styleUrl: './theme-1.component.css',
})
export class Theme1Component implements OnInit {
  slice: number = 0;

  data: any[] = [];
  extraLeft: any[] = [];
  extraRight: any[] = [];

  ongoingPayment: any[] = [];
  ongoingCheckReleasing: any[] = [];
  ongoingInquiry: any[] = [];

  waitingPayment: any[] = [];
  waitingCheckReleasing: any[] = [];
  waitingInquiry: any[] = [];

  selectedInquiry: any[] = [];
  selectedCheckReleasing: any[] = [];
  selectedPayment: any[] = [];

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
  last_id: Map<number, any> = new Map();

  constructor(
    private queueService: QueueService,
    private displayService: DisplayService,
    private websocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getConfig();

    this.websocketService.themeUpdateEvent().subscribe((config: any) => {
      const { themeType } = config;
      const urlParts = this.router.url.split('/');
      if (urlParts[urlParts.length - 1] !== themeType.toString()) {
        this.router.navigate([`/theme/`, `${themeType}`]);
      } else {
        this.getConfig();
      }
    });

    this.websocketService.queuePingEvent().subscribe((response: any) => {
      this.sound.play();
      const elementToAlert = document.getElementById(response.queueId);
      elementToAlert?.classList.add('alert');
      elementToAlert?.classList.remove('notAlert');

      if (this.last_id.get(response.queueId) !== null) {
        clearTimeout(this.last_id.get(response.queueId));
      }

      const id = setTimeout(() => {
        elementToAlert?.classList.add('notAlert');
        elementToAlert?.classList.remove('alert');
      }, 5000);

      this.last_id.set(response.queueId, id);
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

      const currentDate = moment();

      this.data = _.filter(this.data, (o) => {
        const dateItem = moment(o.createdAt);
        return (
          currentDate.isSame(dateItem, 'day') &&
          currentDate.isSame(dateItem, 'month') &&
          currentDate.isSame(dateItem, 'year') &&
          o.toDisplay === 0
        );
      });

      this.data = _.filter(this.data, (item) => {
        return item.queueStatus === 'waiting' || item.queueStatus === 'ongoing';
      });
      // Filter ongoing for each transaction type

      this.ongoingPayment = this.data.filter(
        (item) =>
          item.transactionType === 'payment' &&
          item.queueStatus === 'ongoing' &&
          item.toDisplay === 0
      );

      this.waitingPayment = this.data.filter(
        (item) =>
          item.transactionType === 'payment' &&
          item.queueStatus === 'waiting' &&
          item.toDisplay === 0
      );

      this.ongoingCheckReleasing = this.data.filter(
        (item) =>
          item.transactionType === 'checkReleasing' &&
          item.queueStatus === 'ongoing' &&
          item.toDisplay === 0
      );

      this.waitingCheckReleasing = this.data.filter(
        (item) =>
          item.transactionType === 'checkReleasing' &&
          item.queueStatus === 'waiting' &&
          item.toDisplay === 0
      );

      this.ongoingInquiry = this.data.filter(
        (item) =>
          item.transactionType === 'inquiry' &&
          item.queueStatus === 'ongoing' &&
          item.toDisplay === 0
      );

      this.waitingInquiry = this.data.filter(
        (item) =>
          item.transactionType === 'inquiry' &&
          item.queueStatus === 'waiting' &&
          item.toDisplay === 0
      );

      const leftWaitingPayment = _.slice(this.waitingPayment, 5);
      const leftWaitingInquiry = _.slice(this.waitingInquiry, 5);
      const leftWaitingCheckReleasing = _.slice(this.waitingCheckReleasing, 5);
      const concatArr = [
        ...leftWaitingInquiry,
        ...leftWaitingCheckReleasing,
        ...leftWaitingPayment,
      ];
      console.log(concatArr);
      this.extraLeft = _.slice(concatArr, 0, 4);
      this.extraRight = _.slice(concatArr, 4, 7);

      const maxDisplay = _.max([
        this.ongoingPayment.length,
        this.ongoingCheckReleasing.length,
        this.ongoingInquiry.length,
      ]);
      const leftToDisplay = 5 - (maxDisplay ? maxDisplay : 0);
      this.waitingPayment = _.slice(this.waitingPayment, 0, leftToDisplay);
      this.waitingCheckReleasing = _.slice(
        this.waitingCheckReleasing,
        0,
        leftToDisplay
      );
      this.waitingInquiry = _.slice(this.waitingInquiry, 0, leftToDisplay);
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

        const currentDate = moment();

        this.data = _.filter(this.data, (o) => {
          const dateItem = moment(o.createdAt);
          return (
            currentDate.isSame(dateItem, 'day') &&
            currentDate.isSame(dateItem, 'month') &&
            currentDate.isSame(dateItem, 'year') &&
            o.toDisplay === 0
          );
        });

        this.data = _.filter(this.data, (item) => {
          return (
            item.queueStatus === 'waiting' || item.queueStatus === 'ongoing'
          );
        });
        // Filter ongoing for each transaction type

        this.ongoingPayment = this.data.filter(
          (item) =>
            item.transactionType === 'payment' &&
            item.queueStatus === 'ongoing' &&
            item.toDisplay === 0
        );

        this.waitingPayment = this.data.filter(
          (item) =>
            item.transactionType === 'payment' &&
            item.queueStatus === 'waiting' &&
            item.toDisplay === 0
        );

        this.ongoingCheckReleasing = this.data.filter(
          (item) =>
            item.transactionType === 'checkReleasing' &&
            item.queueStatus === 'ongoing' &&
            item.toDisplay === 0
        );

        this.waitingCheckReleasing = this.data.filter(
          (item) =>
            item.transactionType === 'checkReleasing' &&
            item.queueStatus === 'waiting' &&
            item.toDisplay === 0
        );

        this.ongoingInquiry = this.data.filter(
          (item) =>
            item.transactionType === 'inquiry' &&
            item.queueStatus === 'ongoing' &&
            item.toDisplay === 0
        );

        this.waitingInquiry = this.data.filter(
          (item) =>
            item.transactionType === 'inquiry' &&
            item.queueStatus === 'waiting' &&
            item.toDisplay === 0
        );

        const leftWaitingPayment = _.slice(this.waitingPayment, 5);
        const leftWaitingInquiry = _.slice(this.waitingInquiry, 5);
        const leftWaitingCheckReleasing = _.slice(
          this.waitingCheckReleasing,
          5
        );
        const concatArr = [
          ...leftWaitingInquiry,
          ...leftWaitingCheckReleasing,
          ...leftWaitingPayment,
        ];
        console.log(concatArr);
        this.extraLeft = _.slice(concatArr, 0, 4);
        this.extraRight = _.slice(concatArr, 4, 7);

        const maxDisplay = _.max([
          this.ongoingPayment.length,
          this.ongoingCheckReleasing.length,
          this.ongoingInquiry.length,
        ]);
        const leftToDisplay = 5 - (maxDisplay ? maxDisplay : 0);
        this.waitingPayment = _.slice(this.waitingPayment, 0, leftToDisplay);
        this.waitingCheckReleasing = _.slice(
          this.waitingCheckReleasing,
          0,
          leftToDisplay
        );
        this.waitingInquiry = _.slice(this.waitingInquiry, 0, leftToDisplay);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getConfig(): void {
    this.displayService.getConfig().subscribe(
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
