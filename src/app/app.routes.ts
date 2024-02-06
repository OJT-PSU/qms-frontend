import { Routes } from '@angular/router';
import { QueueInputComponent } from './queue-input/queue-input.component';
import { QueueDisplayComponent } from './queue-display/queue-display.component';
import { QueueAdminComponent } from './queue-admin/queue-admin.component';

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
    path: 'admin',
    component: QueueAdminComponent,
  },
];
