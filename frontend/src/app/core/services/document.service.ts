import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Document } from '../../shared/models/document.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    constructor(private api: ApiService) { }

    upload(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return this.api.post<any>('/documents/upload', formData);
    }

    getAll() {
        return this.api.get<Document[]>('/documents');
    }

    getOne(id: string) {
        return this.api.get<Document>(`/documents/${id}`);
    }

    update(id: string, data: any): Observable<Document> {
        return this.api.patch<Document>(`/documents/${id}`, data);
    }

    dashboard() {
        return this.api.get('/documents/dashboard');
    }
}