import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueService } from '../queue.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-queue-display',
  templateUrl: './queue-display.component.html',
  styleUrls: ['./queue-display.component.css'],
})
export class QueueDisplayComponent implements OnInit, OnDestroy {
  data: any[] = [];
  fetchData: any[] = [];
  text: string = '';
  animation: string = '';
  private subscription: Subscription;
  constructor(private queueService: QueueService) {
    this.subscription = interval(50000)
      .pipe(switchMap(() => this.queueService.getQueueCustomer()))
      .subscribe((data) => {
        console.log(data);
        this.data = data;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getData();
    this.getConfig();
  }

  getData(): void {
    this.queueService.getQueueCustomer().subscribe(
      (response) => {
        console.log(response);
        this.data = response.sort((a, b) => {
          if (a.queueStatus !== b.queueStatus) {
            return a.queueStatus.localeCompare(b.queueStatus);
          } else {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
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
        const { displayId, dispMsg, scrollTime } = response[0];
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
