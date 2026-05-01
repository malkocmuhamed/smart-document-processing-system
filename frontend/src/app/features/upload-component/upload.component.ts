import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

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
  selectedFile: File | null = null;
  loading = false;

  result: any = null;

  constructor(
    private documentService: DocumentService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.result = null;
    }
  }

  upload() {
    if (!this.selectedFile) {
      this.toastr.warning('Please select a file');
      return;
    }

    this.loading = true;
    this.documentService
      .upload(this.selectedFile)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges(); 
        })
      )
      .subscribe({
        next: (res) => {
          this.toastr.success('File uploaded successfully');
          this.result = res.document;
          this.selectedFile = null;
        },
      });
  }
}