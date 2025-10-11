import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.description }}</p>
      <ul>
        <li *ngFor="let l of data.links"><a [href]="l.url" target="_blank">{{ l.label }}</a></li>
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class InfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
