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

    async loadAll() {
        try {
            this._loading.set(true);
            this._error.set(null);

            const data = await firstValueFrom(
                this.api.get<Document[]>('/documents')
            );

            this._documents.set(data);
        } catch (err: any) {
            this._error.set(err.message || 'Failed to load documents');
        } finally {
            this._loading.set(false);
        }
    }

    async refresh() {
        await this.loadAll();
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

    dashboard() {
        return this.api.get('/documents/dashboard');
    }
}