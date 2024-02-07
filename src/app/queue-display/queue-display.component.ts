import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
@Component({
  selector: 'app-queue-display',
  templateUrl: './queue-display.component.html',
  styleUrls: ['./queue-display.component.css'],
})
export class QueueDisplayComponent implements OnInit {
  data: any[] = [];
  fetchData: any[] = [];
  text: string = '';
  animation: string = '';
  constructor(private queueService: QueueService) {}

  ngOnInit(): void {
    this.getData();
    this.getConfig();
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
