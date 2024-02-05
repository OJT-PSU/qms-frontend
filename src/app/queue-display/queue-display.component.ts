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
    // setInterval(() => {
    this.queueService.getQueueCustomer().subscribe(
      (response) => {
        this.data = response;
        console.log('Refresh');
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    // }, 15000);
  }
}
