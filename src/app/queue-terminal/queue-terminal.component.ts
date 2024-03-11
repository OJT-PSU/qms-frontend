import { Component } from '@angular/core';
import { QueueService } from '../queue.service';
import { AdminService } from '../service/admin.service';
import { DisplayService } from '../service/display.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { catchError, throwError } from 'rxjs';
import { TransactionType } from '../interfaces/queueCustomer';

type AdminStatus = 'active' | 'inactive';

type ThemeType = 1 | 2 | 0;

interface Config {
  displayId: number;
  dispMsg: string;
  scrollTime: string;
  video: string;
  themeType: number;
  isEditing: boolean;
}

interface DisplayConfig {
  displayId?: number;
  dispMsg?: string;
  scrollTime?: string;
  video?: string;
  themeType?: number;
  isEditing: boolean;
}

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
  originalConfig = new Map<number, DisplayConfig>();

  terminalDialog: boolean = false;
  submitted: boolean = false;
  terminal: TerminalDialog = {};

  configList: DisplayConfig[] = [];

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

  themeUpdateValue: ThemeType = 1;
  editThemeType: boolean = false;

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private queueService: QueueService,
    private displayService: DisplayService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getTerminal();
    this.getConfig();

    this.displayService.checkThemeActive().subscribe({
      next: (response) => {
        const { themeType } = response;
        this.themeUpdateValue = themeType;
      },
      error: (err) => {
        console.log(err);
        this.showError(err);
      },
    });
  }

  updateThemeType(value: ThemeType) {
    this.displayService.updateThemeType(value).subscribe({
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
      this.terminalList = response.map((terminal) => ({
        ...terminal,
        isEditing: false,
      }));
    });
  }

  getConfig() {
    this.displayService.getConfig().subscribe((response: any) => {
      this.configList = response.map((item: any) => {
        return {
          ...item,
          isEditable: false,
        };
      });
    });
  }

  onRowEditInit(terminal: Terminal) {
    this.originalData.set(terminal.terminalId, { ...terminal });
    terminal.isEditing = true;
  }

  onRowEditSave(terminal: Terminal) {
    terminal.isEditing = false;
    const { terminalName, status, remarks, terminalId, transactionType } =
      terminal;
    this.adminService
      .updateTerminal(
        terminalId,
        terminalName,
        status,
        remarks,
        transactionType
      )
      .subscribe((response) => {
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

  onConfigRowEditInit(config: Config) {
    this.originalConfig.set(config.displayId, { ...config });
    config.isEditing = true;
  }

  onConfigRowEditSave(config: Config) {
    config.isEditing = false;
    const { displayId, dispMsg, scrollTime, video, themeType } = config;
    this.displayService
      .updateConfig(displayId, dispMsg, video, themeType, scrollTime)
      .subscribe(() => {
        this.getConfig();
      });
  }

  onConfigRowEditCancel(config: Config) {
    const originalConfigData = this.originalConfig.get(config.displayId);
    if (originalConfigData) {
      // Restore the original data
      Object.assign(config, originalConfigData);
      config.isEditing = false;
    }
    // Clean up the original data storage
    this.originalData.delete(config.displayId);
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

  updateThemeMessage() {
    console.log('hiiii');
    this.displayService
      .updateThemeMessage(1, 'Sticking out your gyatt for nerizzler')
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error: unknown) => {
          console.log(error);
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
