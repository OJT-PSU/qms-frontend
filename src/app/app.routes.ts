import { Routes } from '@angular/router';
import { QueueInputComponent } from './queue-input/queue-input.component';
import { QueueDisplayComponent } from './queue-display/queue-display.component';
import { QueueTerminalComponent } from './queue-terminal/queue-terminal.component';
export const routes: Routes = [
  {
    path: 'queue',
    component: QueueInputComponent,
  },
  {
    path: 'display',
    component: QueueDisplayComponent,
  },
  {
    path: 'terminal',
    component: QueueTerminalComponent,
  },
];
