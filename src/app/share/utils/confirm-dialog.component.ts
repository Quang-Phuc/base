import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="text-blue-600">{{ data.title }}</h2>
    <mat-dialog-content>
      <p class="text-gray-600 text-base">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="pb-4 pr-4">
      <button mat-button (click)="ref.close(false)">Bỏ qua</button>
      <button mat-raised-button color="primary" (click)="ref.close(true)">Đồng ý</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  ref = inject(MatDialogRef<ConfirmDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
}
