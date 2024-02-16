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
  payment: any[] = [];
  checkReleasing: any[] = [];
  inquiry: any[] = [];

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
      console.log(response);
    });

    this.websocketService.getQueue().subscribe((response) => {
      let hasAlreadyPlayed = false;
      this.hasWaiting = false;

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
      this.data.forEach((item) => {
        if (item.queueStatus == 'ongoing' && !hasAlreadyPlayed) {
          this.sound.play();
          hasAlreadyPlayed = true;
        }
      });
      let count = 0;
      this.payment = this.data
        .map((item, index) => {
          if (item.transactionType === 'payment') {
            count += 1;
            return { ...item, index: index };
          }
        })
        .filter((item) => item !== undefined);
      count = 0;
      this.checkReleasing = this.data
        .map((item, index) => {
          if (item.transactionType === 'checkReleasing') {
            count += 1;
            return { ...item, index: index };
          }
        })
        .filter((item) => item !== undefined);
      count = 0;
      this.inquiry = this.data
        .map((item, index) => {
          if (item.transactionType === 'inquiry') {
            count += 1;
            return { ...item, index: index };
          }
        })
        .filter((item) => item !== undefined);

      console.log('EXECUTED from websocket ');
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

        const currentDate = moment().format('YYYY-MM-DD');
        let count = 0;
        this.payment = this.data
          .map((item, index) => {
            const date = moment(item.createdAt, 'YYYY-MM-DD');
            if (
              item.transactionType === 'payment' &&
              item.toDisplay == 0 &&
              date.isSame(currentDate, 'day')
            ) {
              count += 1;

              return { ...item, index: count };
            }
          })
          .filter((item) => item !== undefined);

        count = 0;
        this.checkReleasing = this.data
          .map((item, index) => {
            const date = moment(item.createdAt, 'YYYY-MM-DD');
            if (
              item.transactionType === 'checkReleasing' &&
              item.toDisplay == 0 &&
              date.isSame(currentDate, 'day')
            ) {
              count += 1;
              console.log({
                transaction: item.transactionType,
                status: item.toDisplay,
              });
              return { ...item, index: count };
            }
          })
          .filter((item) => item !== undefined);

        count = 0;
        this.inquiry = this.data
          .map((item, index) => {
            const date = moment(item.createdAt, 'YYYY-MM-DD');
            if (
              item.transactionType === 'inquiry' &&
              item.toDisplay == 0 &&
              date.isSame(currentDate, 'day')
            ) {
              count += 1;
              return { ...item, index: count };
            }
          })
          .filter((item) => item !== undefined);

        console.log('EXECUTED from oninit ');
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
