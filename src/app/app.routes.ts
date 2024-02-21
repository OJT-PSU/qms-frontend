import { Routes } from '@angular/router';
import { QueueInputComponent } from './queue-input/queue-input.component';
import { Theme0Component } from './theme-0/queue-display.component';
import { QueueTerminalComponent } from './queue-terminal/queue-terminal.component';
import { Theme1Component } from './theme-1/theme-1.component';
export const routes: Routes = [
  {
    path: 'queue',
    component: QueueInputComponent,
  },
  {
    path: 'theme/0',
    component: Theme0Component,
  },
  {
    path: 'terminal',
    component: QueueTerminalComponent,
  },
  {
    path: 'theme/1',
    component: Theme1Component,
  },
];
