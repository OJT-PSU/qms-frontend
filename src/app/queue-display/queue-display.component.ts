import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
@Component({
  selector: 'app-queue-display',
  templateUrl: './queue-display.component.html',
  styleUrls: ['./queue-display.component.css'],
})
export class QueueDisplayComponent implements OnInit {
  data: any[] = [];

  constructor(private queueService: QueueService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.queueService.getQueueCustomer().subscribe(
      (response) => {
        // Sort the data based on 'queueStatus' and 'createdAt'
        this.data = response.sort((a, b) => {
          if (a.queueStatus !== b.queueStatus) {
            return a.queueStatus.localeCompare(b.queueStatus);
          } else {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }
        });

        console.log(this.data);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
