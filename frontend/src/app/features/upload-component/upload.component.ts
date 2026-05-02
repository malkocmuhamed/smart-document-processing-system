import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  private documentService = inject(DocumentService);
  private toastr = inject(ToastrService);

  selectedFile = signal<File | null>(null);
  loading = signal(false);
  result = signal<any | null>(null);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      this.result.set(null);
    }
  }

  upload() {
    const file = this.selectedFile();

    if (!file) {
      this.toastr.warning('Please select a file');
      return;
    }

    this.loading.set(true);

    this.documentService.upload(file)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.toastr.success('Uploaded successfully');
          this.result.set(res.document);
          this.selectedFile.set(null);
        }
      });
  }
}