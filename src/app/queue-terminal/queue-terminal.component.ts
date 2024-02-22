import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { QueueService } from '../queue.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { TransactionType } from '../interfaces/queueCustomer';
import { config } from 'node:process';
import { response } from 'express';
import { error } from 'node:console';

type AdminStatus = 'active' | 'inactive';

type ThemeType = 1 | 2 | 0;

interface Terminal {
  terminalName: string;
  status: AdminStatus;
  remarks: string;
  terminalId: number;
  transactionType: TransactionType;
  isEditing: boolean;
}

interface TerminalDialog {
  terminalName?: string;
  status?: AdminStatus;
  remarks?: string;
  terminalId?: number;
  transactionType?: TransactionType;
  isEditing?: boolean;
}

type DropdownOptionsType<T> = Array<{
  label: string;
  value: T;
}>;

@Component({
  selector: 'app-queue-terminal',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    FormsModule,
    DropdownModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ToolbarModule,
    DialogModule,
    InputTextareaModule,
    ConfirmDialogModule,
    ContextMenuModule,
    RadioButtonModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './queue-terminal.component.html',
  styleUrl: './queue-terminal.component.css',
})
export class QueueTerminalComponent {
  terminalList: Terminal[] = [];
  selectedTerminals: Terminal[] = [];
  statuses = ['active', 'inactive'];
  originalData = new Map<number, Terminal>();

  terminalDialog: boolean = false;
  submitted: boolean = false;
  terminal: TerminalDialog = {};

  themeUpdateValue: ThemeType = 0;
  editThemeType: boolean = false;

  newStatuses: DropdownOptionsType<AdminStatus> = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  transactions: DropdownOptionsType<TransactionType> = [
    { label: 'Payment', value: 'payment' },
    { label: 'Check Releasing', value: 'checkReleasing' },
    { label: 'Inquiry', value: 'inquiry' },
  ];

  themeOptions: DropdownOptionsType<ThemeType> = [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
  ];

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private queueService: QueueService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getTerminal();

    this.queueService.checkThemeActive().subscribe({
      next: (response) => {
        const { themeType } = response;
        this.themeUpdateValue = themeType;
        console.log(themeType);
      },
      error: (err) => {
        console.log(err);
        this.showError(err);
      },
    });
  }

  updateThemeType(value: ThemeType) {
    this.queueService.updateThemeType(value).subscribe({
      error: (error) => {
        this.showError(error);
      },
    });

    this.disableEditTheme();
  }

  editTheme() {
    this.editThemeType = true;
  }

  disableEditTheme() {
    this.editThemeType = false;
  }

  getValueByLabel(value: TransactionType) {
    const transaction = this.transactions.find((t) => t.value === value);
    return transaction ? transaction.label : null;
  }

  getStatusByValue(value: AdminStatus) {
    const status = this.newStatuses.find((s) => s.value === value)!;
    return status.label;
  }

  getTerminal(): void {
    this.adminService.getAllTerminals().subscribe((response) => {
      console.log(response);
      this.terminalList = response.map((terminal) => ({
        ...terminal,
        isEditing: false,
      }));
    });

    console.log(this.terminalList);
  }

  onRowEditInit(terminal: Terminal) {
    this.originalData.set(terminal.terminalId, { ...terminal });
    terminal.isEditing = true;
    console.log(this.terminalList);
  }

  onRowEditSave(terminal: Terminal) {
    terminal.isEditing = false;
    const { terminalName, status, remarks, terminalId, transactionType } =
      terminal;
    console.log(terminal);
    this.adminService
      .updateTerminal(
        terminalId,
        terminalName,
        status,
        remarks,
        transactionType
      )
      .subscribe((response) => {
        console.log(response);
        this.getTerminal();
      });
  }

  onRowEditCancel(terminal: Terminal) {
    const originalTerminal = this.originalData.get(terminal.terminalId);
    if (originalTerminal) {
      // Restore the original data
      Object.assign(terminal, originalTerminal);
      terminal.isEditing = false;
    }
    // Clean up the original data storage
    this.originalData.delete(terminal.terminalId);
  }

  openNew() {
    this.terminal = {};
    this.submitted = false;
    this.terminalDialog = true;
  }

  hideDialog() {
    this.terminalDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
    console.log(this.terminal);
    const { terminalName, status, remarks, transactionType } = this.terminal;

    this.adminService
      .createTerminal(terminalName, status, remarks, transactionType)
      .pipe(
        catchError((error) => {
          this.showError(error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (config) => {
          console.log({ config });
          this.getTerminal();

          this.showSuccess();
          this.terminal = {};
          this.terminalDialog = false;
        },
        error: (error) => {
          // Handle any errors that might happen after catchError
          console.error('An error occurred:', error);
        },
      });

    // if (this.terminal.name.trim()) {
    //   if (this.terminal.id) {
    //     this.products[this.findIndexById(this.terminal.id)] = this.terminal;
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Product Updated',
    //       life: 3000,
    //     });
    //   } else {
    //     this.terminal.id = this.createId();
    //     this.terminal.image = 'terminal-placeholder.svg';
    //     this.products.push(this.terminal);
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Product Created',
    //       life: 3000,
    //     });
    //   }

    //   this.products = [...this.products];
    //   this.productDialog = false;
    //   this.terminal = {};
    // }
  }

  deleteSelectedTerminals() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected terminals?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedTerminals.map((t) => t.terminalId);
        this.adminService.deleteTerminals(ids).subscribe((response) => {
          console.log({ response });
          this.getTerminal();
        });
        this.messageService.add({
          severity: 'info',
          summary: 'Successful',
          detail: 'Terminals Deleted',
          life: 3000,
        });
      },
    });
  }

  resetQueue() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset the queue?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedTerminals.map((t) => t.terminalId);
        this.queueService.updateToDisplayList().subscribe((config) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Successful',
            detail: 'Queue Reset',
            life: 3000,
          });
        });
      },
    });
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `A new terminal has been added!`,
    });
  }

  showError(err: HttpErrorResponse) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `${err.error.message}`,
    });
  }
}
