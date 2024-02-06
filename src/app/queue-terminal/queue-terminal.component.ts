import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';

@Component({
  selector: 'app-queue-terminal',
  standalone: true,
  imports: [],
  templateUrl: './queue-terminal.component.html',
  styleUrl: './queue-terminal.component.css',
})
export class QueueTerminalComponent {
  list: any[] = [];
  constructor(private queueService: QueueService) {}

  ngOnInit(): void {
    this.getTerminal();
  }

  getTerminal(): void {
    this.queueService.getTerminalList().subscribe(
      (response) => {
        console.log(response);
        this.list = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
