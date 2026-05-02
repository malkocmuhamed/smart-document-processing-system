import { Routes } from '@angular/router';
import { UploadComponent } from './features/upload-component/upload.component';
import { DashboardComponent } from './features/dashboard-component/dashboard.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'upload', component: UploadComponent },
    // { path: 'documents/:id', component: DocumentDetailComponent },
];
