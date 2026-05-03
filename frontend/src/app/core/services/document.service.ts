import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Document } from '../../shared/models/document.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    private api = inject(ApiService);

    private _documents = signal<Document[]>([]);
    readonly documents = this._documents.asReadonly();

    private _loading = signal(false);
    readonly loading = this._loading.asReadonly();

    private _error = signal<string | null>(null);
    readonly error = this._error.asReadonly();

    private _currencyTotals = signal<Record<string, number>>({});
    readonly currencyTotals = this._currencyTotals.asReadonly();

    async refresh() {
        await this.loadDashboard();
    }

    upload(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return this.api.post<any>('/documents/upload', formData);
    }

    getOne(id: string) {
        return this.api.get<Document>(`/documents/${id}`);
    }

    update(id: string, data: any) {
        return this.api.patch<Document>(`/documents/${id}`, data);
    }

    loadDashboard() {
        this._loading.set(true);
        this._error.set(null);

        this.api.get<any>('/documents/dashboard')
            .subscribe({
                next: (res) => {
                    this._documents.set(res.documents || []);
                    this._currencyTotals.set(res.totalsByCurrency || {});
                    this._loading.set(false);
                },
                error: (err) => {
                    this._error.set(err.message || 'Dashboard load failed');
                    this._loading.set(false);
                }
            });
    }
}