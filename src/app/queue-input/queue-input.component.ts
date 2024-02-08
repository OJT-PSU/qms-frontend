import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { QueueService } from '../queue.service';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TransactionType } from '../interfaces/queueCustomer';

@Component({
  selector: 'app-queue-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    RippleModule,
    ButtonModule,
    InputTextModule,
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
    transactionType: new FormControl<TransactionType>('checkReleasing'),
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
    let { name, email, contactNumber, transactionType } = this.queueForm.value;
    email = email !== '' ? email : undefined;
    contactNumber = contactNumber !== '' ? contactNumber : undefined;
    console.log(name, email, contactNumber, transactionType);

    if (this.queueForm.valid) {
      const observable = await this.service.createQueueCustomer(
        name ?? '',
        email,
        contactNumber,
        transactionType
      );

      observable
        .pipe(
          catchError((error) => {
            this.showError(error);
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (config) => {
            console.log({ config });
            this.showSuccess();
            this.queueForm.setValue({
              name: '',
              email: '',
              contactNumber: '',
              transactionType: 'checkReleasing',
            });
          },
          error: (error) => {
            // Handle any errors that might happen after catchError
            console.error('An error occurred:', error);
          },
        });
    }
  }

  showSuccess() {
    this.messageService.add({
      key: 'successEvent',
      severity: 'success',
      summary: 'Success',
      detail: `You have been added to the queue!`,
    });
  }

  showError(err: HttpErrorResponse) {
    this.messageService.add({
      key: 'errorEvent',
      severity: 'error',
      summary: 'Error',
      detail: `${err.error.message}`,
    });
  }
}
