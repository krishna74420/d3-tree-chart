
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-decommission-ui',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormlyMaterialModule, MatButtonModule, MatIconModule, MatDialogModule, MatToolbarModule],
  templateUrl: './decommission-ui.component.html',
  styleUrls: ['./decommission-ui.component.scss']
})
export class DecommissionUiComponent {
  @Input() steps: any[] = [];
  @Input() currentStep = 0;
  @Input() totalSteps = 0;
  @Input() fields: any[] = [];
  @Input() model: any = {};

  @Output() modelChange = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();
  @Output() openInfo = new EventEmitter<void>();

  stepState(index: number): 'completed' | 'current' | 'pending' {
    if (index === this.currentStep) return 'current';
    const step = this.steps[index];
    if (!step) return 'pending';
    const keys = (step.fields || []).map((f: any) => f.key);
    for (const k of keys) {
      if (this.model && this.model[k] !== undefined && this.model[k] !== null && this.model[k] !== '') return 'completed';
    }
    return 'pending';
  }

  bubbleClass(index: number) {
    const s = this.stepState(index);
    return {
      'bubble-completed': s === 'completed',
      'bubble-current': s === 'current',
      'bubble-pending': s === 'pending'
    };
  }
}
