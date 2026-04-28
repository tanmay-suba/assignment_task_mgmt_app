import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private readonly snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 4000 });
  }

  undo(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, 'Undo', { duration: 5000 });
  }
}
