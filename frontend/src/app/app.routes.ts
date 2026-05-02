import { Routes } from '@angular/router';
import { UploadComponent } from './features/upload-component/upload.component';
import { DashboardComponent } from './features/dashboard-component/dashboard.component';
import { DocumentDetailsComponent } from './features/document-details/document-details.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'upload', component: UploadComponent },
    { path: 'documents/:id', component: DocumentDetailsComponent },
];
