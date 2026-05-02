import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { DocumentService } from '../../core/services/document.service';
import { Document } from '../../shared/models/document.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private documentService = inject(DocumentService);
  private router = inject(Router);

  readonly documents = this.documentService.documents;
  readonly loading = this.documentService.loading;
  readonly error = this.documentService.error;

  readonly displayedColumns = [
    'fileName',
    'status',
    'createdAt',
    'errors',
    'actions',
  ];

  constructor() {
    this.documentService.loadAll();
  }

  viewDocument = (id: string) =>
    this.router.navigate(['/documents', id]);

  errorCount = (doc: Document) =>
    doc.validationResult?.errors?.length ?? 0;

  trackById = (_: number, item: Document) => item.id;
}