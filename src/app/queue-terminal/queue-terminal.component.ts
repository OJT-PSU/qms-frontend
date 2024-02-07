import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-queue-terminal',
  standalone: true,
  imports: [],
  templateUrl: './queue-terminal.component.html',
  styleUrl: './queue-terminal.component.css',
})
export class QueueTerminalComponent {
  list: any[] = [];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getTerminal();
  }

  getTerminal(): void {
    this.adminService.getAllTerminals().subscribe((response) => {
      this.list = response;
    });
  }
}
