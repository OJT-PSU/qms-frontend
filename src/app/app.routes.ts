import { Routes } from '@angular/router';
import { QueueInputComponent } from './queue-input/queue-input.component';
import { Theme0Component } from './theme-0/theme-0.component';
import { QueueTerminalComponent } from './queue-terminal/queue-terminal.component';
import { Theme1Component } from './theme-1/theme-1.component';
import { DestinedThemeComponent } from './destined-theme/destined-theme.component';
export const routes: Routes = [
  {
    path: 'destined-theme',
    component: DestinedThemeComponent,
  },
  {
    path: '',
    redirectTo: '/destined-theme',
    pathMatch: 'full',
  },
  {
    path: 'queue',
    component: QueueInputComponent,
  },
  {
    path: 'theme/0',
    component: Theme0Component,
  },
  {
    path: 'theme/1',
    component: Theme1Component,
  },
  {
    path: 'terminal',
    component: QueueTerminalComponent,
  },
  {
    path: '**',
    redirectTo: '/destined-theme',
  },
];
