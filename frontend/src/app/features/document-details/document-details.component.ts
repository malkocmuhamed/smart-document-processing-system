import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { DocumentService } from '../../core/services/document.service';
import { Document } from '../../shared/models/document.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-document-details',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './document-details.component.html',
    styleUrls: ['./document-details.component.scss'],
})
export class DocumentDetailsComponent {
    private route = inject(ActivatedRoute);
    private documentService = inject(DocumentService);
    private toastr = inject(ToastrService);
    private fb = inject(FormBuilder);

    readonly document = signal<Document | null>(null);
    readonly loading = signal(false);
    readonly saving = signal(false);
    readonly error = signal<string | null>(null);

    form = this.fb.group({
        documentType: [''],
        supplier: [''],
        documentNumber: [''],
        currency: [''],
        issueDate: [null as Date | null],
        dueDate: [null as Date | null],
        subtotal: [''],
        tax: [''],
        total: [''],
    });

    readonly extracted = computed(() =>
        this.document()?.extractedData ?? {}
    );

    readonly validation = computed(() =>
        this.document()?.validationResult
    );

    readonly isDirty = computed(() => this.form.dirty);

    constructor() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) this.loadDocument(id);
        });

        effect(() => {
            const doc = this.document();
            if (!doc) return;

            this.form.reset(
                {
                    documentType: doc.extractedData?.documentType ?? '',
                    supplier: doc.extractedData?.supplier ?? '',
                    documentNumber: doc.extractedData?.documentNumber ?? '',
                    currency: doc.extractedData?.currency ?? '',
                    issueDate: doc.extractedData?.issueDate
                        ? new Date(doc.extractedData.issueDate)
                        : null,
                    dueDate: doc.extractedData?.dueDate
                        ? new Date(doc.extractedData.dueDate)
                        : null,
                    subtotal: doc.extractedData?.subtotal ?? '',
                    tax: doc.extractedData?.tax ?? '',
                    total: doc.extractedData?.total ?? '',
                },
                { emitEvent: false }
            );
        });
    }

    private loadDocument(id: string) {
        this.loading.set(true);

        this.documentService.getOne(id).subscribe({
            next: (doc) => {
                this.document.set(doc);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to load document');
                this.loading.set(false);
            }
        });
    }

    save() {
        if (this.form.invalid) {
            this.toastr.warning('Please fix errors before saving');
            return;
        }

        const doc = this.document();
        if (!doc) return;

        const formValue = this.form.getRawValue();

        const payload = {
            ...formValue,
            lineItems: this.document()?.extractedData?.lineItems ?? [],
            issueDate: this.formatDate(formValue.issueDate),
            dueDate: this.formatDate(formValue.dueDate),
        };

        this.saving.set(true);

        this.documentService.update(doc.id, payload)
            .pipe(finalize(() => this.saving.set(false)))
            .subscribe({
                next: async (updatedDoc) => {
                    this.toastr.success('Document updated successfully');
                    await this.documentService.refresh();
                    this.document.set(updatedDoc);
                },
                error: () => {
                    this.toastr.error('Failed to update document');
                }
            });
    }

    formatDate(date: Date | null): string | null {
        if (!date) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    hasError(field: string): boolean {
        return !!this.validation()?.errors?.some(e => e.field === field);
    }

    getError(field: string): string | null {
        const err = this.validation()?.errors?.find(e => e.field === field);
        return err?.message || null;
    }
}