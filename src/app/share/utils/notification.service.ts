// src/app/core/services/notification.service.ts
import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog'; // ✅ Thêm cái này
import { Observable, map } from 'rxjs';
import { pickApiMessage } from '../models';
import { ConfirmDialogComponent } from './confirm-dialog.component'; // ✅ Sẽ tạo ở bước 2

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  private config(typeClass: string, duration: number): MatSnackBarConfig {
    return {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-top-right', typeClass],
    };
  }

  // ✅ Hàm confirm mới cho Phúc
  confirm(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title, message },
      disableClose: true, // Bắt buộc khách phải bấm nút
    });

    return dialogRef.afterClosed().pipe(map(result => !!result));
  }

  showSuccess(message: string) {
    this.snack.open(message, 'Đóng', this.config('snackbar-success', 2500));
  }

  showInfo(message: string) {
    this.snack.open(message, 'Đóng', this.config('snackbar-info', 3000));
  }

  showError(message: string) {
    this.snack.open(message, 'Đóng', this.config('snackbar-error', 7000));
  }

  showApiError(err: any, fallback = 'Đã có lỗi xảy ra') {
    const raw = err?.error ?? err;
    const msg = typeof raw === 'string' ? raw : pickApiMessage(raw, fallback);
    this.showError(msg);
  }
}
