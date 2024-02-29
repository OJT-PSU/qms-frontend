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
  last_id: any = null;

  constructor(
    private queueService: QueueService,
    private websocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getConfig();

    this.websocketService.queuePingEvent().subscribe((response: any) => {
      this.sound.play();
      console.log('hi');
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

    this.websocketService.themeUpdateEvent().subscribe((config: any) => {
      const { themeType } = config;
      this.router.navigate([`/theme/`, `${themeType}`]);
      console.log(themeType);
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
          currentDate.isSame(dateItem, 'year')
        );
      });

      const filteredQueue = _.filter(this.data, (item) => {
        return item.queueStatus === 'waiting' || item.queueStatus === 'ongoing';
      });

      this.display = _.slice(filteredQueue, 0, 7);
      // this.refresh();
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

  // refresh(): void {
  //   this.alertName = '';
  //   this.alertQueueId = '';
  //   let hasAlreadyPlayed = false;
  //   this.hasWaiting = false;
  //   setInterval(() => {
  //     const parentDiv = document.querySelector('.parentAlert');
  //     if (parentDiv) {
  //       const elementsToRemove = parentDiv.querySelectorAll('.alert');
  //       elementsToRemove.forEach((element) =>
  //         element.classList.remove('alert')
  //       );
  //     }
  //     this.alertName = '';
  //   }, 5000);
  //   this.data.forEach((item) => {
  //     if (item.queueStatus == 'ongoing' && !hasAlreadyPlayed) {
  //       this.sound.play();
  //       hasAlreadyPlayed = true;
  //     }
  //   });

  //   const currentDate = moment();
  //   this.data = _.filter(this.data, (o) => {
  //     const dateItem = moment(o.createdAt);
  //     return (
  //       currentDate.isSame(dateItem, 'day') &&
  //       currentDate.isSame(dateItem, 'month') &&
  //       currentDate.isSame(dateItem, 'year')
  //     );
  //   });

  //   const filter = _.filter(this.data, (item) => {
  //     return item.queueStatus === 'waiting' || item.queueStatus === 'ongoing';
  //   });
  //   this.display = _.slice(filter, 0, 7);
  //   console.log(this.display);
  // }

  getData(): void {
    this.queueService.getQueueCustomer().subscribe(
      (response) => {
        const currentDate = moment();

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

        this.data = _.filter(this.data, (o) => {
          const dateItem = moment(o.createdAt);
          return (
            currentDate.isSame(dateItem, 'day') &&
            currentDate.isSame(dateItem, 'month') &&
            currentDate.isSame(dateItem, 'year')
          );
        });

        const filteredQueue = _.filter(this.data, (item) => {
          return (
            item.queueStatus === 'waiting' || item.queueStatus === 'ongoing'
          );
        });

        this.display = _.slice(filteredQueue, 0, 7);
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
