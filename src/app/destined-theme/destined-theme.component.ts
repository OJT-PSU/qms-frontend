import { Component, OnInit } from '@angular/core';
import { DisplayService } from '../service/display.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-destined-theme',
  standalone: true,
  imports: [],
  templateUrl: './destined-theme.component.html',
  styleUrl: './destined-theme.component.css',
})
export class DestinedThemeComponent implements OnInit {
  constructor(private service: DisplayService, private router: Router) {}
  getDestinedTheme(): void {
    this.service.checkThemeActive().subscribe({
      next: (response) => {
        const { themeType } = response;
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
