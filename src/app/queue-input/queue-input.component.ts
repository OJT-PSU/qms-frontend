import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QueueService } from '../queue.service';
import { RouterLink } from '@angular/router';
import { config } from 'process';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-queue-input',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './queue-input.component.html',
  styleUrl: './queue-input.component.css',
})
export class QueueInputComponent {
  queueForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl(''),
    contactNumber: new FormControl(''),
  });

  constructor(private service: QueueService) {}

  async postData() {
    const { name, email, contactNumber } = this.queueForm.value;
    if (this.queueForm.valid) {
      const observable = await this.service.createQueueCustomer(
        name ?? '',
        email ?? '',
        contactNumber ?? ''
      );

      observable.subscribe(
        (config) => {
          this.queueForm.setValue({ name: '', email: '', contactNumber: '' });
        },
        (error: HttpErrorResponse) => {
          console.log('hi');
        }
      );

      // console.log(response);
    }
  }
}
