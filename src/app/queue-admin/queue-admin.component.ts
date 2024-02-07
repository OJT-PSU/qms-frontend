import { Component } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-queue-admin',
  standalone: true,
  imports: [],
  templateUrl: './queue-admin.component.html',
  styleUrl: './queue-admin.component.css',
})
export class QueueAdminComponent implements OnInit {
  data: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getTerminalData();
  }

  getTerminalData() {
    const observable = this.adminService.getAllTerminals();
    observable.subscribe((response) => {
      this.data = response;
      console.log(response);
    });
  }
}
