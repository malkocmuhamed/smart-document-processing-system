import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { DocumentService } from '../../core/services/document.service';
import { Document } from '../../shared/models/document.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private documentService = inject(DocumentService);
  private router = inject(Router);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly documents = toSignal(
    this.documentService.getAll().pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.error.set(err.message || 'Failed to load documents');
        this.loading.set(false);
        return of([]);
      })
    ),
    { initialValue: [] as Document[] }
  );

  readonly displayedColumns = [
    'fileName',
    'status',
    'createdAt',
    'errors',
    'actions',
  ];

  viewDocument = (id: string) =>
    this.router.navigate(['/documents', id]);

  errorCount = (doc: Document) =>
    doc.validationResult?.errors?.length ?? 0;

  trackById = (_: number, item: Document) => item.id;
}