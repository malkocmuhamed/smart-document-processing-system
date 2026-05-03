import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../core/services/document.service';
import { Document } from '../../shared/models/document.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { UploadComponent } from '../upload-component/upload.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private documentService = inject(DocumentService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  readonly loading = this.documentService.loading;
  readonly error = this.documentService.error;
  readonly documents = this.documentService.documents;
  readonly currencyTotals = this.documentService.currencyTotals;

  readonly displayedColumns = [
    'fileName',
    'status',
    'createdAt',
    'errors',
    'actions',
  ];

  constructor() {
    this.documentService.loadDashboard();
  }

  openUpload() {
    this.dialog.open(UploadComponent, {
      width: '500px'
    });
  }

  viewDocument = (id: string) =>
    this.router.navigate(['/documents', id]);

  errorCount = (doc: Document) =>
    doc.validationResult?.errors?.length ?? 0;

  trackById = (_: number, item: Document) => item.id;
}