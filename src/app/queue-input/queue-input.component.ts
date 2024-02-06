import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QueueService } from '../queue.service';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-queue-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    RippleModule,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './queue-input.component.html',
  styleUrl: './queue-input.component.css',
})
export class QueueInputComponent {
  queueForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl(''),
    contactNumber: new FormControl(''),
  });

  constructor(
    private service: QueueService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  async postData() {
    const { name, email, contactNumber } = this.queueForm.value;
    this.appendToQueueSuccess();

    // if (this.queueForm.valid) {
    //   const observable = await this.service.createQueueCustomer(
    //     name ?? '',
    //     email ?? '',
    //     contactNumber ?? ''
    //   );

    //   observable.subscribe(
    //     (config) => {
    //       this.queueForm.setValue({ name: '', email: '', contactNumber: '' });
    //     },
    //     (error: HttpErrorResponse) => {
    //       console.log('hi');
    //     }
    //   );

    //   // console.log(response);
    // }
  }

  appendToQueueSuccess() {
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Info',
      detail: 'Message Content',
    });
  }
}
