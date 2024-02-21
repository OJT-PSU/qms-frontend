import { Component, OnInit } from '@angular/core';
import { QueueService } from '../queue.service';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-destined-theme',
  standalone: true,
  imports: [],
  templateUrl: './destined-theme.component.html',
  styleUrl: './destined-theme.component.css',
})
export class DestinedThemeComponent implements OnInit {
  constructor(private service: QueueService, private router: Router) {}
  getDestinedTheme(): void {
    this.service.checkThemeActive().subscribe({
      next: (response) => {
        const { themeType } = response;
        console.log(themeType);
        this.router.navigate([`/theme/`, `${themeType}`]);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit(): void {
    this.getDestinedTheme();
  }
}
