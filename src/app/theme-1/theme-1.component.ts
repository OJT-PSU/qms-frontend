import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
import { WebSocketService } from '../socket/web-socket.service';
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
  data: any[] = [];
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
      console.log({ data: this.data });
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

      this.waitingPayment = _.slice(this.waitingPayment, 0, 5);
      this.waitingCheckReleasing = _.slice(this.waitingCheckReleasing, 0, 5);
      this.waitingInquiry = _.slice(this.waitingInquiry, 0, 5);
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
        console.log({ data: this.data });
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

        this.waitingPayment = _.slice(this.waitingPayment, 0, 5);
        this.waitingCheckReleasing = _.slice(this.waitingCheckReleasing, 0, 5);
        this.waitingInquiry = _.slice(this.waitingInquiry, 0, 5);
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
