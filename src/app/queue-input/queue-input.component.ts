import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';

import { TransactionType, PriorityType } from '../interfaces/queueCustomer';
import { QueueService } from '../queue.service';
import { catchError, throwError } from 'rxjs';

import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';

type ListboxOptionsType<T> = Array<{
  label: string;
  value: T;
  icon?: string;
}>;

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
    CommonModule,
    NgClass,
    CardModule,
    DropdownModule,
    CheckboxModule,
    ListboxModule,
  ],
  providers: [MessageService],
  templateUrl: './queue-input.component.html',
  styleUrl: './queue-input.component.css',
})
export class QueueInputComponent {
  queueForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    email: new FormControl(''),
    contactNumber: new FormControl(''),
    transactionType: new FormControl<TransactionType | null>(null),
    privacyAgreement: new FormControl<boolean>(false),
    priorityType: new FormControl<PriorityType>('normal'),
  });
  submitAttempted: boolean = false;
  currentPage = 1;
  transactions: ListboxOptionsType<TransactionType> = [
    { label: 'Payment', value: 'payment', icon: 'pi-credit-card' },
    { label: 'Check Releasing', value: 'checkReleasing', icon: 'pi-file' },
    { label: 'Inquiry', value: 'inquiry', icon: 'pi-search' },
  ];

  priorityTypes: ListboxOptionsType<PriorityType> = [
    { label: 'Normal', value: 'normal', icon: 'pi-search' },
    { label: 'Senior Citizen', value: 'senior', icon: 'pi-credit-card' },
    { label: 'PWD', value: 'pwd', icon: 'pi-file' },
    { label: 'Pregnant', value: 'pregnant', icon: 'pi-search' },
  ];

  constructor(
    private service: QueueService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  async postData() {
    this.submitAttempted = true;
    if (!this.queueForm.value.privacyAgreement) {
      this.showPrivacyAgreementToast();
    } else {
      let { name, email, contactNumber, transactionType, priorityType } =
        this.queueForm.value;
      email = email !== '' ? email : undefined;
      contactNumber = contactNumber !== '' ? contactNumber : undefined;
      console.log(priorityType);

      if (this.queueForm.valid) {
        const observable = await this.service.createQueueCustomer(
          name ?? '',
          email,
          contactNumber,
          transactionType,
          priorityType
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
              this.showSuccess();
              this.queueForm.setValue({
                name: '',
                email: '',
                contactNumber: '',
                transactionType: 'checkReleasing',
                privacyAgreement: false,
                priorityType: 'normal',
              });
              this.submitAttempted = false;
              this.currentPage = 1;
              this.queueForm.value.transactionType = null;
            },
            error: (error) => {
              // Handle any errors that might happen after catchError
              console.error('An error occurred:', error);
            },
          });
      } else {
        this.showRequiredError();
      }
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

  showRequiredError() {
    this.messageService.add({
      key: 'errorEvent',
      severity: 'error',
      summary: 'Error',
      detail: `Please fill in the required field (Name and Transaction Type)`,
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

  showPrivacyAgreementToast() {
    this.messageService.add({
      key: 'errorEvent',
      severity: 'warn',
      summary: 'Error',
      detail: 'Please agree to the Privacy Policy to proceed.',
    });
  }

  showNameRequiredToast() {
    this.messageService.add({
      key: 'errorEvent',
      severity: 'error',
      summary: 'Error',
      detail: 'Please put a name or nickname.',
    });
  }

  showTransactionRequiredToast() {
    this.messageService.add({
      key: 'errorEvent',
      severity: 'error',
      summary: 'Error',
      detail: 'Please choose a transaction.',
    });
  }

  goToPageOne() {
    this.currentPage = 1;
  }

  goToPageTwo() {
    if (this.queueForm.value.name === '') {
      this.showNameRequiredToast();
    } else {
      this.currentPage = 2;
    }
  }

  goToPageThree() {
    if (this.queueForm.value.transactionType === null) {
      this.showTransactionRequiredToast();
    } else {
      this.currentPage = 3;
    }
  }
}
