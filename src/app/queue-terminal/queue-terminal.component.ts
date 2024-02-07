import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
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

type AdminStatus = 'active' | 'inactive';

interface Terminal {
  terminalName: string;
  status: AdminStatus;
  remarks: string;
  terminalId: number;
  isEditing: boolean;
}

interface TerminalDialog {
  terminalName?: string;
  status?: AdminStatus;
  remarks?: string;
  terminalId?: number;
  isEditing?: boolean;
}

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

  newStatuses: any[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getTerminal();
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
    const { terminalName, status, remarks, terminalId } = terminal;
    this.adminService
      .updateTerminal(terminalId, terminalName, status, remarks)
      .subscribe((response) => {
        console.log(response);
        this.getTerminal();
      });
    // Here, you would typically send the updated data back to the server
    // And then possibly fetch the updated list or update the UI accordingly
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
    const { terminalName, status, remarks } = this.terminal;

    this.adminService
      .createTerminal(terminalName, status, remarks)
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
    const ids = this.selectedTerminals.map((t) => t.terminalId);
    this.adminService.deleteTerminals(ids).subscribe((response) => {
      console.log({ response });
      this.getTerminal();
    });
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to delete the selected products?',
    //   header: 'Confirm',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     // this.products = this.products.filter(val => !this.selectedProducts.includes(val));
    //     // this.selectedProducts = null;
    //     console.log('noice');
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Products Deleted',
    //       life: 3000,
    //     });
    //   },
    // });
  }

  showSuccess() {
    this.messageService.add({
      key: 'successEvent',
      severity: 'success',
      summary: 'Success',
      detail: `A new terminal has been added!`,
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
