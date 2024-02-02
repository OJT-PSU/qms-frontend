import { Routes } from '@angular/router';
import { QueueInputComponent } from './queue-input/queue-input.component';
import { QueueDisplayComponent } from './queue-display/queue-display.component';

export const routes: Routes = [
  {
    path: 'queue',
    component: QueueInputComponent,
  },
  {
    path: 'display',
    component: QueueDisplayComponent,
  },
];
